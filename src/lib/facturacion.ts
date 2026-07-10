/**
 * Sistema de Facturación Electrónica - Café La Elda 1941
 * Genera facturas según normatividad DIAN (Resolución 000165/2023)
 * Integración con MATIAS API como proveedor tecnológico
 */

import { prisma } from "./prisma";
import { createJournalEntry } from "./contabilidad";
import { dianDate, pad } from "./format";
import { sendInvoiceToMatias } from "./matias-api";

// ============================================================
// TIPOS
// ============================================================

export interface InvoiceItemInput {
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;  // centavos
  discount?: number;  // centavos
  ivaRate?: number;   // porcentaje (0 para no responsables)
}

export interface CreateInvoiceInput {
  customerId?: string;  // ID del ThirdParty (opcional, usa eventual si no se especifica)
  customerData?: {
    documentType: string;
    documentNumber: string;
    fullName: string;
    email?: string;
    phone?: string;
  };
  items: InvoiceItemInput[];
  paymentMethod: string; // EFECTIVO, TARJETA, TRANSFERENCIA, ONLINE
  orderId?: string;      // Si viene de un pedido web
  notes?: string;
  sendToDian?: boolean;  // Si se debe enviar a DIAN inmediatamente
}

// ============================================================
// NUMERACIÓN DE FACTURAS
// ============================================================

/** Obtiene el próximo número de factura basado en el rango autorizado */
export async function getNextInvoiceNumber(): Promise<{ prefix: string; number: number }> {
  const settings = await prisma.companySettings.findFirst();
  const prefix = settings?.resolutionPrefix || "FE";

  const lastInvoice = await prisma.invoice.findFirst({
    where: { prefix },
    orderBy: { number: "desc" },
    select: { number: true },
  });

  const lastNumber = lastInvoice?.number || settings?.resolutionRangeStart || 1;
  const nextNumber = lastNumber + 1;

  return { prefix, number: nextNumber };
}

// ============================================================
// CÁLCULO DE TOTALES
// ============================================================

export function calculateInvoiceTotals(items: InvoiceItemInput[], isResponsibleIva: boolean = false) {
  let subtotal = 0;
  let discount = 0;
  let iva = 0;

  const calculatedItems = items.map((item) => {
    const lineSubtotal = item.unitPrice * item.quantity;
    const lineDiscount = item.discount || 0;
    const baseImponible = lineSubtotal - lineDiscount;
    const lineIva = isResponsibleIva ? Math.round(baseImponible * (item.ivaRate || 0) / 100) : 0;
    const lineTotal = baseImponible + lineIva;

    subtotal += lineSubtotal;
    discount += lineDiscount;
    iva += lineIva;

    return {
      ...item,
      lineSubtotal,
      lineDiscount,
      baseImponible,
      lineIva,
      lineTotal,
    };
  });

  const total = subtotal - discount + iva;

  return {
    items: calculatedItems,
    subtotal,
    discount,
    iva,
    total,
  };
}

// ============================================================
// CREACIÓN DE FACTURA
// ============================================================

export async function createInvoice(
  input: CreateInvoiceInput
): Promise<{ invoiceId: string; number: string; status: string }> {
  // 1. Resolver cliente
  let customer = input.customerId
    ? await prisma.thirdParty.findUnique({ where: { id: input.customerId } })
    : null;

  if (!customer && input.customerData) {
    // Crear o buscar cliente por documento
    customer = await prisma.thirdParty.upsert({
      where: {
        documentType_documentNumber: {
          documentType: input.customerData.documentType,
          documentNumber: input.customerData.documentNumber,
        },
      },
      update: {},
      create: {
        type: "CLIENTE",
        documentType: input.customerData.documentType,
        documentNumber: input.customerData.documentNumber,
        fullName: input.customerData.fullName,
        email: input.customerData.email || null,
        phone: input.customerData.phone || null,
        taxRegime: "NO_RESPONSABLE",
        isResponsibleIva: false,
        balance: 0,
      },
    });
  }

  if (!customer) {
    // Usar cliente eventual
    customer = await prisma.thirdParty.findFirst({
      where: { documentNumber: "22222222" },
    });
    if (!customer) throw new Error("No se encontró cliente para facturar");
  }

  // 2. Calcular totales
  const totals = calculateInvoiceTotals(input.items, customer.isResponsibleIva);

  // 3. Obtener número de factura
  const { prefix, number } = await getNextInvoiceNumber();
  const fullNumber = `${prefix}${pad(number, 0)}`;

  // 4. Crear factura
  const invoice = await prisma.invoice.create({
    data: {
      prefix,
      number,
      fullNumber,
      type: "FACTURA",
      customerId: customer.id,
      customerName: customer.fullName,
      customerDocument: `${customer.documentType} ${customer.documentNumber}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      subtotal: totals.subtotal,
      discount: totals.discount,
      iva: totals.iva,
      total: totals.total,
      status: "BORRADOR",
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "EFECTIVO" || input.paymentMethod === "ONLINE" ? "PAGADA" : "PENDIENTE",
      paymentDate: input.paymentMethod === "EFECTIVO" || input.paymentMethod === "ONLINE" ? new Date() : null,
      ...(input.orderId ? { order: { connect: { id: input.orderId } } } : {}),
      notes: input.notes || null,
      items: {
        create: totals.items.map((item) => ({
          productId: item.productId || null,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.lineDiscount,
          ivaRate: item.ivaRate || 0,
          ivaAmount: item.lineIva,
          total: item.lineTotal,
        })),
      },
    },
    include: { items: true },
  });

  // 5. Generar asiento contable automático
  await generateInvoiceAccountingEntry(invoice.id);

  // 6. Enviar a DIAN si se solicita
  if (input.sendToDian !== false) {
    try {
      await sendInvoiceToDian(invoice.id);
    } catch (error) {
      console.error("Error enviando a DIAN:", error);
      // No fallar la creación de factura si DIAN falla
    }
  }

  return {
    invoiceId: invoice.id,
    number: fullNumber,
    status: invoice.status,
  };
}

// ============================================================
// ASIENTO CONTABLE DE FACTURA
// ============================================================

/**
 * Genera el asiento contable para una factura.
 * Para "No responsable de IVA":
 *   Débito:  110505 Caja (o 1110xx Bancos)     → total
 *   Crédito: 413505 Ingresos por Venta          → subtotal (igual al total sin IVA)
 *   Crédito: 613505 Costo de Mercancías         → (se registra por separado)
 */
export async function generateInvoiceAccountingEntry(invoiceId: string): Promise<string | null> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true },
  });

  if (!invoice) return null;
  if (invoice.journalEntryId) return invoice.journalEntryId;

  // Determinar la cuenta de pago (caja o banco)
  let paymentAccountCode = "110505"; // Caja por defecto
  if (invoice.paymentMethod === "TRANSFERENCIA") paymentAccountCode = "111005";
  else if (invoice.paymentMethod === "ONLINE") paymentAccountCode = "111006";
  else if (invoice.paymentMethod === "NEQUI") paymentAccountCode = "111010";

  // Determinar cuenta de ingreso (café o derivados)
  const revenueAccountCode = "413505"; // Ingresos por Venta de Café (general)

  const lines = [
    {
      accountCode: paymentAccountCode,
      debit: invoice.total,
      credit: 0,
      description: `Factura ${invoice.fullNumber}`,
    },
    {
      accountCode: revenueAccountCode,
      debit: 0,
      credit: invoice.subtotal - invoice.discount,
      description: `Ventas - Factura ${invoice.fullNumber}`,
    },
  ];

  // Si hay IVA (responsable), registrarlo
  if (invoice.iva > 0) {
    lines.push({
      accountCode: "240805", // IVA Generado
      debit: 0,
      credit: invoice.iva,
      description: `IVA Factura ${invoice.fullNumber}`,
    });
  }

  const entry = await createJournalEntry({
    type: "VENTA",
    description: `Factura de venta ${invoice.fullNumber} - ${invoice.customerName}`,
    reference: invoice.fullNumber,
    source: "FACTURA",
    sourceId: invoiceId,
    lines,
  });

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { journalEntryId: entry.id },
  });

  return entry.id;
}

// ============================================================
// ENVÍO A DIAN VIA MATIAS API
// ============================================================

export async function sendInvoiceToDian(invoiceId: string): Promise<{ success: boolean; cufe?: string; qrCode?: string; error?: string }> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true, customer: true },
  });

  if (!invoice) throw new Error("Factura no encontrada");

  const settings = await prisma.companySettings.findFirst();
  if (!settings) throw new Error("Configuración de empresa no encontrada");

  // Si no hay token de MATIAS, generar CUFE local (modo offline/borrador)
  if (!settings.matiasApiToken) {
    const cufe = generateLocalCUFE(invoice, settings);
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "BORRADOR",
        cufe,
        errorMessage: "Sin configuración MATIAS API. Factura en modo borrador.",
      },
    });
    return { success: false, cufe, error: "MATIAS API no configurado" };
  }

  try {
    // Enviar via MATIAS API
    const result = await sendInvoiceToMatias(invoice, settings);

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: result.success ? "ACEPTADA" : "RECHAZADA",
        cufe: result.cufe || null,
        qrCode: result.qrCode || null,
        xmlContent: result.xml || null,
        dianResponse: result.response || null,
        errorMessage: result.error || null,
      },
    });

    return result;
  } catch (error: any) {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "RECHAZADA",
        errorMessage: error.message,
      },
    });
    return { success: false, error: error.message };
  }
}

/**
 * Genera un CUFE local (placeholder) cuando no hay MATIAS configurado
 * El CUFE real lo genera la DIAN. Esto es solo para pruebas.
 */
function generateLocalCUFE(invoice: any, settings: any): string {
  const crypto = require("crypto");
  const data = [
    dianDate(invoice.createdAt),
    dianDate(invoice.createdAt),
    invoice.fullNumber,
    "01", // Tipo documento: Factura de venta
    settings.documentNumber,
    invoice.customerDocument.replace(/\D/g, ""),
    String(invoice.total),
    "0", // Sin IVA
    settings.matiasApiToken || "offline",
    "1", // Ambiente
  ].join("");

  return crypto.createHash("sha384").update(data).digest("hex");
}

// ============================================================
// CONSULTAS DE FACTURAS
// ============================================================

export async function getInvoicesByDateRange(startDate: Date, endDate: Date) {
  return prisma.invoice.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
    include: {
      customer: { select: { fullName: true, documentNumber: true } },
      items: true,
    },
    orderBy: { number: "desc" },
  });
}

export async function getInvoiceStats(startDate: Date, endDate: Date) {
  const invoices = await prisma.invoice.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { in: ["ACEPTADA", "ENVIADA"] },
    },
    select: { total: true, iva: true, paymentStatus: true },
  });

  const totalVentas = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalIVA = invoices.reduce((sum, inv) => sum + inv.iva, 0);
  const facturasPagadas = invoices.filter((i) => i.paymentStatus === "PAGADA").length;
  const facturasPendientes = invoices.filter((i) => i.paymentStatus === "PENDIENTE").length;

  return {
    cantidadFacturas: invoices.length,
    totalVentas,
    totalIVA,
    facturasPagadas,
    facturasPendientes,
  };
}

// ============================================================
// ANULACIÓN DE FACTURA
// ============================================================

export async function cancelInvoice(
  invoiceId: string,
  reason: string
): Promise<void> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) throw new Error("Factura no encontrada");
  if (invoice.status === "ANULADA") throw new Error("La factura ya está anulada");

  // Revertir el asiento contable
  if (invoice.journalEntryId) {
    const { reverseJournalEntry } = await import("./contabilidad");
    await reverseJournalEntry(invoice.journalEntryId);
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: "ANULADA",
      errorMessage: `ANULADA: ${reason}`,
    },
  });
}
