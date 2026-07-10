/**
 * Motor Contable - Café La Elda 1941
 * Maneja asientos contables, balance de comprobación y estados financieros
 * Sigue el principio de partida doble (débito = crédito)
 */

import { prisma } from "./prisma";

// ============================================================
// TIPOS
// ============================================================

export interface JournalLineInput {
  accountCode: string;  // Código PUC de la cuenta
  debit: number;        // Centavos (0 si es crédito)
  credit: number;       // Centavos (0 si es débito)
  description?: string;
  thirdPartyId?: string;
  costCenter?: string;
  baseAmount?: number;
}

export interface JournalEntryInput {
  type: string;         // DIARIO, INGRESO, EGRESO, VENTA, COMPRA, NOMINA, AJUSTE
  description: string;
  reference?: string;
  entryDate?: Date;
  source?: string;      // MANUAL, FACTURA, NOMINA, BANCO, INVENTARIO
  sourceId?: string;
  lines: JournalLineInput[];
}

// ============================================================
// CREACIÓN DE ASIENTOS CONTABLES
// ============================================================

/**
 * Crea un asiento contable con partida doble.
 * Valida que débitos = créditos antes de guardar.
 * Si autoPost es true, lo postea automáticamente y actualiza saldos.
 */
export async function createJournalEntry(
  input: JournalEntryInput,
  autoPost: boolean = true
): Promise<{ id: string; number: number; totalDebit: number; totalCredit: number }> {
  // 1. Validar que hay líneas
  if (input.lines.length < 2) {
    throw new Error("Un asiento contable debe tener al menos 2 líneas");
  }

  // 2. Calcular totales
  const totalDebit = input.lines.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = input.lines.reduce((sum, l) => sum + l.credit, 0);

  if (totalDebit !== totalCredit) {
    throw new Error(
      `El asiento no balancea: Débitos=${totalDebit}, Créditos=${totalCredit}, Diferencia=${totalDebit - totalCredit}`
    );
  }

  // 3. Obtener el próximo número de comprobante
  const lastEntry = await prisma.journalEntry.findFirst({
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const nextNumber = (lastEntry?.number || 0) + 1;

  // 4. Resolver códigos PUC a IDs de cuentas
  const accountCodes = [...new Set(input.lines.map((l) => l.accountCode))];
  const accounts = await prisma.account.findMany({
    where: { code: { in: accountCodes } },
    select: { id: true, code: true },
  });
  const accountMap = new Map(accounts.map((a) => [a.code, a.id]));

  // Validar que todas las cuentas existen
  for (const code of accountCodes) {
    if (!accountMap.has(code)) {
      throw new Error(`La cuenta PUC ${code} no existe`);
    }
  }

  // 5. Crear el asiento en una transacción
  const result = await prisma.$transaction(async (tx) => {
    // Crear el encabezado del asiento
    const entry = await tx.journalEntry.create({
      data: {
        number: nextNumber,
        type: input.type,
        description: input.description,
        reference: input.reference || null,
        entryDate: input.entryDate || new Date(),
        status: autoPost ? "POSTEADO" : "BORRADOR",
        postedAt: autoPost ? new Date() : null,
        totalDebit,
        totalCredit,
        source: input.source || "MANUAL",
        sourceId: input.sourceId || null,
      },
    });

    // Crear las líneas
    for (const line of input.lines) {
      await tx.journalEntryLine.create({
        data: {
          journalEntryId: entry.id,
          accountId: accountMap.get(line.accountCode)!,
          costCenter: line.costCenter || null,
          thirdPartyId: line.thirdPartyId || null,
          debit: line.debit,
          credit: line.credit,
          description: line.description || null,
          baseAmount: line.baseAmount || null,
        },
      });

      // Actualizar el saldo de la cuenta
      const account = await tx.account.findUnique({
        where: { id: accountMap.get(line.accountCode)! },
        select: { nature: true, balance: true },
      });

      if (account && autoPost) {
        // Naturaleza DÉBITO: el débito aumenta, el crédito disminuye
        // Naturaleza CRÉDITO: el crédito aumenta, el débito disminuye
        const newBalance =
          account.nature === "DEBITO"
            ? account.balance + line.debit - line.credit
            : account.balance + line.credit - line.debit;

        await tx.account.update({
          where: { id: accountMap.get(line.accountCode)! },
          data: { balance: newBalance },
        });
      }
    }

    return entry;
  });

  return {
    id: result.id,
    number: result.number,
    totalDebit,
    totalCredit,
  };
}

/**
 * Postea un asiento en estado BORRADOR (cambia a POSTEADO y actualiza saldos)
 */
export async function postJournalEntry(entryId: string): Promise<void> {
  const entry = await prisma.journalEntry.findUnique({
    where: { id: entryId },
    include: { lines: true },
  });

  if (!entry) throw new Error("Asiento no encontrado");
  if (entry.status !== "BORRADOR") throw new Error("El asiento ya está posteado o anulado");

  await prisma.$transaction(async (tx) => {
    await tx.journalEntry.update({
      where: { id: entryId },
      data: { status: "POSTEADO", postedAt: new Date() },
    });

    for (const line of entry.lines) {
      const account = await tx.account.findUnique({
        where: { id: line.accountId },
        select: { nature: true, balance: true },
      });

      if (account) {
        const newBalance =
          account.nature === "DEBITO"
            ? account.balance + line.debit - line.credit
            : account.balance + line.credit - line.debit;

        await tx.account.update({
          where: { id: line.accountId },
          data: { balance: newBalance },
        });
      }
    }
  });
}

/**
 * Anula un asiento contable (crea un asiento de reversión)
 */
export async function reverseJournalEntry(entryId: string): Promise<string> {
  const original = await prisma.journalEntry.findUnique({
    where: { id: entryId },
    include: { lines: true },
  });

  if (!original) throw new Error("Asiento no encontrado");

  // Crear asiento de reversión (invierte débitos y créditos)
  const reversalLines: JournalLineInput[] = original.lines.map((line) => {
    const account = original.lines.find((l) => l.id === line.id);
    return {
      accountCode: "", // Necesitamos el código, lo obtenemos abajo
      debit: line.credit,  // Invertido
      credit: line.debit,  // Invertido
      description: `Reversión: ${line.description || ""}`,
    };
  });

  // Obtener códigos de cuenta
  const accountIds = original.lines.map((l) => l.accountId);
  const accounts = await prisma.account.findMany({
    where: { id: { in: accountIds } },
    select: { id: true, code: true },
  });
  const accountCodeMap = new Map(accounts.map((a) => [a.id, a.code]));

  const linesWithCodes: JournalLineInput[] = original.lines.map((line) => ({
    accountCode: accountCodeMap.get(line.accountId)!,
    debit: line.credit,
    credit: line.debit,
    description: `Reversión: ${line.description || ""}`,
  }));

  const reversal = await createJournalEntry({
    type: original.type,
    description: `ANULACIÓN: ${original.description}`,
    reference: `Reversión asiento #${original.number}`,
    source: original.source,
    lines: linesWithCodes,
  });

  await prisma.journalEntry.update({
    where: { id: entryId },
    data: { status: "ANULADO" },
  });

  return reversal.id;
}

// ============================================================
// CONSULTAS Y REPORTES
// ============================================================

/**
 * Obtiene el balance de comprobación en un rango de fechas
 * Devuelve el saldo inicial, débitos, créditos y saldo final por cuenta
 */
export async function getTrialBalance(
  startDate?: Date,
  endDate?: Date
): Promise<Array<{
  code: string;
  name: string;
  type: string;
  nature: string;
  openingBalance: number;
  debit: number;
  credit: number;
  closingBalance: number;
}>> {
  // Obtener todas las cuentas activas (solo las de 6 dígitos = hojas)
  const accounts = await prisma.account.findMany({
    where: { active: true },
    orderBy: { code: "asc" },
  });

  // Filtrar solo cuentas hoja (6+ dígitos)
  const leafAccounts = accounts.filter((a) => a.code.length >= 6);

  const result = [];

  for (const account of leafAccounts) {
    // Obtener movimientos del periodo
    const whereClause: any = { accountId: account.id };
    if (startDate || endDate) {
      whereClause.journalEntry = {};
      if (startDate) whereClause.journalEntry.entryDate = { gte: startDate };
      if (endDate) {
        whereClause.journalEntry.entryDate = {
          ...(whereClause.journalEntry.entryDate || {}),
          lte: endDate,
        };
      }
      whereClause.journalEntry.status = "POSTEADO";
    }

    const lines = await prisma.journalEntryLine.findMany({
      where: whereClause,
      include: { journalEntry: { select: { entryDate: true, status: true } } },
    });

    // Solo líneas de asientos posteados
    const postedLines = lines.filter((l) => l.journalEntry.status === "POSTEADO");

    const debit = postedLines.reduce((sum, l) => sum + l.debit, 0);
    const credit = postedLines.reduce((sum, l) => sum + l.credit, 0);

    // Saldo según naturaleza
    const closingBalance =
      account.nature === "DEBITO"
        ? account.balance
        : account.balance;

    result.push({
      code: account.code,
      name: account.name,
      type: account.type,
      nature: account.nature,
      openingBalance: 0, // TODO: calcular saldo anterior al startDate
      debit,
      credit,
      closingBalance,
    });
  }

  return result;
}

/**
 * Obtiene el estado de resultados (P&L) del periodo
 * Ingresos - Costos - Gastos = Utilidad/Pérdida
 */
export async function getIncomeStatement(
  startDate: Date,
  endDate: Date
): Promise<{
  ingresos: Array<{ code: string; name: string; amount: number }>;
  costos: Array<{ code: string; name: string; amount: number }>;
  gastos: Array<{ code: string; name: string; amount: number }>;
  totalIngresos: number;
  totalCostos: number;
  totalGastos: number;
  utilidadBruta: number;
  utilidadOperacional: number;
  utilidadNeta: number;
}> {
  const accounts = await prisma.account.findMany({
    where: { active: true, type: { in: ["INGRESO", "COSTO", "GASTO"] } },
    orderBy: { code: "asc" },
  });

  const leafAccounts = accounts.filter((a) => a.code.length >= 6);

  const ingresos: any[] = [];
  const costos: any[] = [];
  const gastos: any[] = [];

  let totalIngresos = 0;
  let totalCostos = 0;
  let totalGastos = 0;

  for (const account of leafAccounts) {
    const lines = await prisma.journalEntryLine.findMany({
      where: {
        accountId: account.id,
        journalEntry: {
          entryDate: { gte: startDate, lte: endDate },
          status: "POSTEADO",
        },
      },
    });

    const debit = lines.reduce((sum, l) => sum + l.debit, 0);
    const credit = lines.reduce((sum, l) => sum + l.credit, 0);

    // Para ingresos (naturaleza crédito), el saldo = crédito - débito
    // Para costos/gastos (naturaleza débito), el saldo = débito - crédito
    const amount =
      account.nature === "CREDITO" ? credit - debit : debit - credit;

    if (amount === 0) continue;

    const item = { code: account.code, name: account.name, amount };

    if (account.type === "INGRESO") {
      ingresos.push(item);
      totalIngresos += amount;
    } else if (account.type === "COSTO") {
      costos.push(item);
      totalCostos += amount;
    } else if (account.type === "GASTO") {
      gastos.push(item);
      totalGastos += amount;
    }
  }

  const utilidadBruta = totalIngresos - totalCostos;
  const utilidadOperacional = utilidadBruta - totalGastos;
  const utilidadNeta = utilidadOperacional; // Simplificado (sin impuestos)

  return {
    ingresos,
    costos,
    gastos,
    totalIngresos,
    totalCostos,
    totalGastos,
    utilidadBruta,
    utilidadOperacional,
    utilidadNeta,
  };
}

/**
 * Obtiene el balance general (estado de situación financiera)
 * Activo = Pasivo + Patrimonio
 */
export async function getBalanceSheet(asOfDate: Date = new Date()): Promise<{
  activo: Array<{ code: string; name: string; amount: number }>;
  pasivo: Array<{ code: string; name: string; amount: number }>;
  patrimonio: Array<{ code: string; name: string; amount: number }>;
  totalActivo: number;
  totalPasivo: number;
  totalPatrimonio: number;
  balanceOk: boolean;
}> {
  const accounts = await prisma.account.findMany({
    where: { active: true, type: { in: ["ACTIVO", "PASIVO", "PATRIMONIO"] } },
    orderBy: { code: "asc" },
  });

  const leafAccounts = accounts.filter((a) => a.code.length >= 6);

  const activo: any[] = [];
  const pasivo: any[] = [];
  const patrimonio: any[] = [];

  let totalActivo = 0;
  let totalPasivo = 0;
  let totalPatrimonio = 0;

  for (const account of leafAccounts) {
    const balance = account.balance;
    if (balance === 0) continue;

    const item = { code: account.code, name: account.name, amount: balance };

    if (account.type === "ACTIVO") {
      activo.push(item);
      totalActivo += balance;
    } else if (account.type === "PASIVO") {
      pasivo.push(item);
      totalPasivo += balance;
    } else if (account.type === "PATRIMONIO") {
      patrimonio.push(item);
      totalPatrimonio += balance;
    }
  }

  return {
    activo,
    pasivo,
    patrimonio,
    totalActivo,
    totalPasivo,
    totalPatrimonio,
    balanceOk: totalActivo === totalPasivo + totalPatrimonio,
  };
}

/**
 * Obtiene el mayor de una cuenta (todas las líneas de asientos que la afectan)
 */
export async function getAccountLedger(
  accountCode: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  account: { code: string; name: string; nature: string; type: string };
  openingBalance: number;
  movements: Array<{
    date: string;
    entryNumber: number;
    description: string;
    reference: string;
    debit: number;
    credit: number;
    balance: number;
  }>;
  closingBalance: number;
}> {
  const account = await prisma.account.findUnique({
    where: { code: accountCode },
  });

  if (!account) throw new Error(`Cuenta ${accountCode} no encontrada`);

  const whereClause: any = {
    accountId: account.id,
    journalEntry: { status: "POSTEADO" },
  };

  if (startDate || endDate) {
    whereClause.journalEntry.entryDate = {};
    if (startDate) whereClause.journalEntry.entryDate.gte = startDate;
    if (endDate) whereClause.journalEntry.entryDate.lte = endDate;
  }

  const lines = await prisma.journalEntryLine.findMany({
    where: whereClause,
    include: {
      journalEntry: { select: { number: true, entryDate: true, description: true, reference: true } },
    },
    orderBy: { journalEntry: { entryDate: "asc" } },
  });

  let runningBalance = 0;
  const movements = lines.map((line) => {
    if (account.nature === "DEBITO") {
      runningBalance += line.debit - line.credit;
    } else {
      runningBalance += line.credit - line.debit;
    }

    return {
      date: line.journalEntry.entryDate.toISOString(),
      entryNumber: line.journalEntry.number,
      description: line.journalEntry.description,
      reference: line.journalEntry.reference || "",
      debit: line.debit,
      credit: line.credit,
      balance: runningBalance,
    };
  });

  return {
    account: {
      code: account.code,
      name: account.name,
      nature: account.nature,
      type: account.type,
    },
    openingBalance: 0,
    movements,
    closingBalance: account.balance,
  };
}
