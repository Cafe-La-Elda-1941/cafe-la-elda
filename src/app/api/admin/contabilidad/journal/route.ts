import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createJournalEntry } from "@/lib/contabilidad";

/**
 * GET /api/admin/contabilidad/journal
 * Lista asientos contables con paginación y filtros.
 * Query params:
 *   - page (default 1)
 *   - pageSize (default 20)
 *   - type: DIARIO | INGRESO | EGRESO | VENTA | COMPRA | NOMINA | AJUSTE
 *   - status: BORRADOR | POSTEADO | ANULADO
 *   - startDate, endDate (ISO)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageSize = Math.min(
    200,
    Math.max(1, Number(searchParams.get("pageSize") || "20"))
  );

  const type = searchParams.get("type") || undefined;
  const status = searchParams.get("status") || undefined;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (status) where.status = status;

  if (startDate || endDate) {
    const range: Record<string, Date> = {};
    if (startDate) range.gte = new Date(startDate);
    if (endDate) range.lte = new Date(endDate);
    where.entryDate = range;
  }

  const [total, entries] = await Promise.all([
    prisma.journalEntry.count({ where }),
    prisma.journalEntry.findMany({
      where,
      orderBy: [{ entryDate: "desc" }, { number: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        lines: {
          include: {
            account: {
              select: {
                code: true,
                name: true,
                type: true,
                nature: true,
              },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    }),
  ]);

  return NextResponse.json({
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    entries,
  });
}

/**
 * POST /api/admin/contabilidad/journal
 * Crea un nuevo asiento contable usando el motor de partida doble.
 * Body:
 *   - type: DIARIO | INGRESO | EGRESO | AJUSTE (...)
 *   - description: string
 *   - reference?: string
 *   - entryDate?: ISO string
 *   - source?: string
 *   - lines: Array<{ accountCode, debit, credit, description?, thirdPartyId?, costCenter?, baseAmount? }>
 *           (valores en CENTAVOS)
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validaciones básicas
  if (!body.type || typeof body.type !== "string") {
    return NextResponse.json(
      { error: "El campo 'type' es obligatorio" },
      { status: 400 }
    );
  }
  if (!body.description || typeof body.description !== "string") {
    return NextResponse.json(
      { error: "El campo 'description' es obligatorio" },
      { status: 400 }
    );
  }
  if (!Array.isArray(body.lines) || body.lines.length < 2) {
    return NextResponse.json(
      { error: "Un asiento debe tener al menos 2 líneas" },
      { status: 400 }
    );
  }

  // Normalizar líneas: asegurar valores numéricos en centavos
  const lines = body.lines.map((l: any) => ({
    accountCode: String(l.accountCode),
    debit: Math.round(Number(l.debit) || 0),
    credit: Math.round(Number(l.credit) || 0),
    description: l.description ? String(l.description) : undefined,
    thirdPartyId: l.thirdPartyId ? String(l.thirdPartyId) : undefined,
    costCenter: l.costCenter ? String(l.costCenter) : undefined,
    baseAmount: l.baseAmount != null ? Number(l.baseAmount) : undefined,
  }));

  // Validación local: débitos = créditos (lo refuerza el motor también)
  const totalDebit = lines.reduce((s: number, l: any) => s + l.debit, 0);
  const totalCredit = lines.reduce((s: number, l: any) => s + l.credit, 0);

  if (totalDebit !== totalCredit) {
    return NextResponse.json(
      {
        error: `El asiento no balancea. Débitos=${totalDebit}, Créditos=${totalCredit}, Diferencia=${
          totalDebit - totalCredit
        }`,
        totalDebit,
        totalCredit,
      },
      { status: 400 }
    );
  }

  // Validar que cada línea tenga cuenta y al menos un valor
  for (const l of lines) {
    if (!l.accountCode) {
      return NextResponse.json(
        { error: "Cada línea debe tener un accountCode" },
        { status: 400 }
      );
    }
    if (l.debit < 0 || l.credit < 0) {
      return NextResponse.json(
        { error: "Los valores de débito y crédito no pueden ser negativos" },
        { status: 400 }
      );
    }
    if (l.debit > 0 && l.credit > 0) {
      return NextResponse.json(
        {
          error: `La cuenta ${l.accountCode} no puede tener débito y crédito simultáneamente`,
        },
        { status: 400 }
      );
    }
    if (l.debit === 0 && l.credit === 0) {
      return NextResponse.json(
        { error: `La cuenta ${l.accountCode} debe tener un valor mayor a 0` },
        { status: 400 }
      );
    }
  }

  try {
    const result = await createJournalEntry({
      type: body.type,
      description: body.description,
      reference: body.reference,
      entryDate: body.entryDate ? new Date(body.entryDate) : undefined,
      source: body.source || "MANUAL",
      sourceId: body.sourceId,
      lines,
    });

    // Devolver el asiento completo creado
    const created = await prisma.journalEntry.findUnique({
      where: { id: result.id },
      include: {
        lines: {
          include: {
            account: {
              select: { code: true, name: true, type: true, nature: true },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    });

    return NextResponse.json(
      { ...result, entry: created },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al crear el asiento contable" },
      { status: 400 }
    );
  }
}
