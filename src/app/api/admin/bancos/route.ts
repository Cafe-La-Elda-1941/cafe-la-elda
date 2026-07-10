import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/bancos — Cuentas bancarias + transacciones recientes
export async function GET() {
  const [accounts, transactions] = await Promise.all([
    prisma.bankAccount.findMany({
      orderBy: { createdAt: "asc" },
      include: { account: true },
    }),
    prisma.bankTransaction.findMany({
      take: 30,
      orderBy: { transactionDate: "desc" },
      include: { bankAccount: true },
    }),
  ]);

  return NextResponse.json({ accounts, transactions });
}

// POST /api/admin/bancos — Registra una nueva transacción bancaria
export async function POST(request: NextRequest) {
  const body = await request.json();

  const bankAccountId = String(body.bankAccountId);
  const type = String(body.type || "INGRESO"); // INGRESO | EGRESO
  const amount = Math.round(Number(body.amount) * 100); // pesos -> centavos
  const description = String(body.description || "");

  if (!bankAccountId || amount <= 0) {
    return NextResponse.json(
      { error: "Cuenta y monto (>0) son obligatorios" },
      { status: 400 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const account = await tx.bankAccount.findUnique({ where: { id: bankAccountId } });
    if (!account) throw new Error("Cuenta bancaria no encontrada");

    const delta = type === "EGRESO" ? -amount : amount;
    const updated = await tx.bankAccount.update({
      where: { id: bankAccountId },
      data: { balance: account.balance + delta },
    });

    const transaction = await tx.bankTransaction.create({
      data: {
        bankAccountId,
        type,
        amount,
        description,
        status: "CONCILIADO",
        conciliatedAt: new Date(),
      },
      include: { bankAccount: true },
    });

    return transaction;
  });

  return NextResponse.json(result, { status: 201 });
}
