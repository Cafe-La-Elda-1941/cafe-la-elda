import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/facturacion";
import { toCents } from "@/lib/format";
import type { InvoiceItemInput } from "@/lib/facturacion";

// ============================================================
// GET /api/admin/facturas
// Lista facturas con paginación, filtros (estado, rango de fecha, búsqueda)
// ============================================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Paginación
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

  // Filtros
  const status = searchParams.get("status"); // BORRADOR, ACEPTADA, etc.
  const paymentStatus = searchParams.get("paymentStatus"); // PAGADA, PENDIENTE...
  const search = searchParams.get("search")?.trim();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Construir cláusula WHERE
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (status && status !== "TODAS") {
    where.status = status;
  }

  if (paymentStatus && paymentStatus !== "TODAS") {
    where.paymentStatus = paymentStatus;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  if (search) {
    where.OR = [
      { fullNumber: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { customerDocument: { contains: search, mode: "insensitive" } },
    ];
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            documentNumber: true,
            documentType: true,
            email: true,
            phone: true,
          },
        },
        items: true,
      },
      orderBy: { number: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  return NextResponse.json({
    data: invoices,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// ============================================================
// POST /api/admin/facturas
// Crea una factura usando createInvoice() del lib de facturación
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "La factura debe tener al menos un item." },
        { status: 400 }
      );
    }

    // Validar método de pago
    const validMethods = ["EFECTIVO", "TARJETA", "TRANSFERENCIA", "ONLINE", "NEQUI"];
    const paymentMethod = body.paymentMethod || "EFECTIVO";
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: `Método de pago inválido: ${paymentMethod}` },
        { status: 400 }
      );
    }

    // Mapear items: los precios llegan en pesos y se convierten a centavos
    const items: InvoiceItemInput[] = body.items.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => ({
        productId: item.productId || undefined,
        description: item.description,
        quantity: Number(item.quantity),
        // El frontend envía el precio unitario en pesos -> convertir a centavos
        unitPrice: toCents(Number(item.unitPrice)),
        discount: item.discount ? toCents(Number(item.discount)) : undefined,
        ivaRate: item.ivaRate ?? 0, // 0 para "No responsable de IVA"
      })
    );

    // Crear la factura (la lib se encarga de cliente, numeración, totales, asiento y DIAN)
    const result = await createInvoice({
      customerId: body.customerId || undefined,
      customerData: body.customerData || undefined,
      items,
      paymentMethod,
      notes: body.notes || undefined,
      orderId: body.orderId || undefined,
      sendToDian: body.sendToDian ?? true,
    });

    // Devolver la factura completa con relaciones
    const invoice = await prisma.invoice.findUnique({
      where: { id: result.invoiceId },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            documentNumber: true,
            documentType: true,
            email: true,
            phone: true,
          },
        },
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al crear la factura";
    console.error("[POST /api/admin/facturas]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
