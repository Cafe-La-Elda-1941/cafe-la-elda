import { NextRequest, NextResponse } from "next/server";
import {
  getTrialBalance,
  getIncomeStatement,
  getBalanceSheet,
  getAccountLedger,
} from "@/lib/contabilidad";

/**
 * GET /api/admin/contabilidad/reports
 *
 * Query param principal: report
 *   - trial_balance  : Balance de comprobación
 *   - income_statement : Estado de resultados (P&L)
 *   - balance_sheet  : Balance general (estado de situación financiera)
 *   - ledger         : Mayor contable de una cuenta (requiere account=CODE)
 *
 * Parámetros comunes:
 *   - startDate (ISO)
 *   - endDate (ISO)
 *   - account (solo para ledger) - código PUC de la cuenta
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const report = searchParams.get("report");

  if (!report) {
    return NextResponse.json(
      {
        error:
          "Parámetro 'report' es obligatorio. Valores: trial_balance, income_statement, balance_sheet, ledger",
      },
      { status: 400 }
    );
  }

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const startDate = startDateParam ? new Date(startDateParam) : undefined;
  const endDate = endDateParam ? new Date(endDateParam) : undefined;

  try {
    switch (report) {
      // ─────────────────────────────────────────────────
      // BALANCE DE COMPROBACIÓN
      // ─────────────────────────────────────────────────
      case "trial_balance": {
        const rows = await getTrialBalance(startDate, endDate);

        const totals = rows.reduce(
          (acc, r) => {
            acc.opening += r.openingBalance;
            acc.debit += r.debit;
            acc.credit += r.credit;
            acc.closing += r.closingBalance;
            return acc;
          },
          { opening: 0, debit: 0, credit: 0, closing: 0 }
        );

        return NextResponse.json({
          report: "trial_balance",
          period: { startDate, endDate },
          totals,
          rows,
        });
      }

      // ─────────────────────────────────────────────────
      // ESTADO DE RESULTADOS (P&L)
      // ─────────────────────────────────────────────────
      case "income_statement": {
        if (!startDate || !endDate) {
          return NextResponse.json(
            {
              error:
                "income_statement requiere startDate y endDate (ISO strings)",
            },
            { status: 400 }
          );
        }

        const pl = await getIncomeStatement(startDate, endDate);

        return NextResponse.json({
          report: "income_statement",
          period: { startDate, endDate },
          ...pl,
        });
      }

      // ─────────────────────────────────────────────────
      // BALANCE GENERAL
      // ─────────────────────────────────────────────────
      case "balance_sheet": {
        const asOfDate = endDate || new Date();
        const bs = await getBalanceSheet(asOfDate);

        return NextResponse.json({
          report: "balance_sheet",
          asOfDate,
          ...bs,
        });
      }

      // ─────────────────────────────────────────────────
      // MAYOR DE UNA CUENTA
      // ─────────────────────────────────────────────────
      case "ledger": {
        const accountCode = searchParams.get("account");
        if (!accountCode) {
          return NextResponse.json(
            { error: "El reporte 'ledger' requiere el parámetro account (código PUC)" },
            { status: 400 }
          );
        }

        const ledger = await getAccountLedger(accountCode, startDate, endDate);

        return NextResponse.json({
          report: "ledger",
          period: { startDate, endDate },
          ...ledger,
        });
      }

      default:
        return NextResponse.json(
          {
            error: `Reporte '${report}' no reconocido. Valores válidos: trial_balance, income_statement, balance_sheet, ledger`,
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al generar el reporte" },
      { status: 500 }
    );
  }
}
