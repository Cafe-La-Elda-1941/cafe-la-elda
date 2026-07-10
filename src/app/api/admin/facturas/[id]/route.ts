import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cancelInvoice, sendInvoiceToDian } from "@/lib/facturacion";

type RouteContext = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/admin/facturas/[id]
// Obtiene una factura con todos sus detalles (items, cliente, asiento)
// ============================================================
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
      order: {
        select: { id: true, customerName: true, total: true, status: true },
      },
    },
  });

  if (!invoice) {
    return NextResponse.json(
      { error: "Factura no encontrada" },
      { status: 404 }
    );
  }

  // El asiento contable se vincula por journalEntryId (no hay relación directa)
  let journalEntry = null;
  if (invoice.journalEntryId) {
    journalEntry = await prisma.journalEntry.findUnique({
      where: { id: invoice.journalEntryId },
      include: {
        lines: {
          include: {
            account: {
              select: { code: true, name: true },
            },
          },
        },
      },
    });
  }

  return NextResponse.json({ ...invoice, journalEntry });
}

// ============================================================
// PATCH /api/admin/facturas/[id]
// Actualiza notas y/o estado de pago
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Factura no encontrada" },
      { status: 404 }
    );
  }

  const body = await request.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.paymentStatus !== undefined) {
    data.paymentStatus = body.paymentStatus;
    // Si se marca como pagada y no tenía fecha de pago, registrarla
    if (body.paymentStatus === "PAGADA" && !existing.paymentDate) {
      data.paymentDate = new Date();
    }
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data,
    include: {
      customer: { select: { fullName: true, documentNumber: true } },
      items: true,
    },
  });

  return NextResponse.json(invoice);
}

// ============================================================
// POST /api/admin/facturas/[id]
// Acciones: action=cancel (anular con motivo) | action=sendDian (reenviar a DIAN)
// ============================================================
export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const action = body.action;

  // ---------- ANULAR FACTURA ----------
  if (action === "cancel") {
    const reason: string = (body.reason || "").trim();
    if (!reason) {
      return NextResponse.json(
        { error: "Debe indicar el motivo de anulación." },
        { status: 400 }
      );
    }

    try {
      await cancelInvoice(id, reason);
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: { items: true },
      });
      return NextResponse.json(invoice);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al anular la factura";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  // ---------- RE-ENVIAR A DIAN ----------
  if (action === "sendDian") {
    try {
      const result = await sendInvoiceToDian(id);
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        select: {
          id: true,
          fullNumber: true,
          status: true,
          cufe: true,
          qrCode: true,
          errorMessage: true,
        },
      });
      return NextResponse.json({ ...invoice, dianResult: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al enviar a DIAN";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: `Acción no reconocida: ${action}. Use "cancel" o "sendDian".` },
    { status: 400 }
  );
}
