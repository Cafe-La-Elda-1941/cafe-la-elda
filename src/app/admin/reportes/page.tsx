"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCOP, formatDate } from "@/lib/format";

// ============================================================
// TIPOS
// ============================================================

interface ReportRow {
  code: string;
  name: string;
  type?: string;
  nature?: string;
  openingBalance?: number;
  debit?: number;
  credit?: number;
  closingBalance?: number;
  amount?: number;
}

interface TrialBalanceData {
  report: "trial_balance";
  period: { startDate: string | null; endDate: string | null };
  totals: { opening: number; debit: number; credit: number; closing: number };
  rows: ReportRow[];
}

interface IncomeStatementRow { code: string; name: string; amount: number; }

interface IncomeStatementData {
  report: "income_statement";
  period: { startDate: string | null; endDate: string | null };
  ingresos: IncomeStatementRow[];
  costos: IncomeStatementRow[];
  gastos: IncomeStatementRow[];
  totalIngresos: number;
  totalCostos: number;
  totalGastos: number;
  utilidadBruta: number;
  utilidadOperacional: number;
  utilidadNeta: number;
}

interface BalanceSheetData {
  report: "balance_sheet";
  asOfDate: string | null;
  activo: IncomeStatementRow[];
  pasivo: IncomeStatementRow[];
  patrimonio: IncomeStatementRow[];
  totalActivo: number;
  totalPasivo: number;
  totalPatrimonio: number;
  balanceOk: boolean;
}

type ReportData = TrialBalanceData | IncomeStatementData | BalanceSheetData | null;

type TabKey = "trial_balance" | "income_statement" | "balance_sheet";

// ============================================================
// CONFIG
// ============================================================

const TABS: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "trial_balance", label: "Balance de Comprobación", icon: "⚖" },
  { key: "income_statement", label: "Estado de Resultados", icon: "📈" },
  { key: "balance_sheet", label: "Balance General", icon: "🏛" },
];

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AdminReportes() {
  const [tab, setTab] = useState<TabKey>("trial_balance");
  const [data, setData] = useState<ReportData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros de fecha: por defecto, año actual
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), 0, 1)
    .toISOString()
    .split("T")[0];
  const defaultEnd = now.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const loadReport = () => {
    setLoading(true);
    setError(null);
    setData(null);

    const params = new URLSearchParams();
    params.set("report", tab);
    if (tab !== "balance_sheet") {
      params.set("startDate", new Date(startDate).toISOString());
    }
    params.set("endDate", new Date(endDate).toISOString());

    fetch(`/api/admin/contabilidad/reports?${params.toString()}`)
      .then((r) => {
        if (!r.ok) {
          return r.json().then((e) => {
            throw new Error(e.error || "Error al generar el reporte");
          });
        }
        return r.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const periodLabel = useMemo(() => {
    const f = (s: string) => formatDate(new Date(s));
    if (tab === "balance_sheet") {
      return `Al ${f(endDate)}`;
    }
    return `Del ${f(startDate)} al ${f(endDate)}`;
  }, [tab, startDate, endDate]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="animate-fade-in">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amarillo/60 text-xs font-josefin uppercase tracking-[0.2em] mb-2">
            <span>Contabilidad</span>
            <span className="text-crema/20">/</span>
            <span className="text-crema/40">Reportes</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl text-crema mb-1">
            Estados Financieros
          </h1>
          <p className="text-sm text-crema/50 font-josefin">
            {periodLabel}
          </p>
        </div>
        <button
          onClick={loadReport}
          disabled={loading}
          className="px-5 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-amarillo/15 text-amarillo font-josefin hover:bg-amarillo/25 transition-colors disabled:opacity-40"
        >
          {loading ? "Generando..." : "↻ Actualizar"}
        </button>
      </div>

      {/* PESTAÑAS */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-josefin border transition-all cursor-pointer ${
                isActive
                  ? "bg-amarillo text-cafe-oscuro border-amarillo font-semibold"
                  : "bg-crema/[0.03] text-crema/60 border-crema/[0.08] hover:bg-crema/[0.07] hover:text-crema"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* SELECTOR DE FECHAS + EXPORTAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5 p-4 rounded-xl bg-crema/[0.025] border border-crema/[0.08]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[11px] uppercase tracking-wider text-crema/50 font-josefin">
              {tab === "balance_sheet" ? "Corte al:" : "Desde:"}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={tab === "balance_sheet"}
              className="bg-crema/[0.06] border border-crema/15 text-crema py-2 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors disabled:opacity-40"
            />
          </div>
          {tab !== "balance_sheet" && (
            <>
              <span className="text-crema/30">→</span>
              <div className="flex items-center gap-2">
                <label className="text-[11px] uppercase tracking-wider text-crema/50 font-josefin">
                  Hasta:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-crema/[0.06] border border-crema/15 text-crema py-2 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors"
                />
              </div>
            </>
          )}
          <button
            onClick={loadReport}
            className="px-4 py-2 rounded-lg cursor-pointer text-xs font-josefin tracking-wider uppercase bg-verde text-crema hover:bg-verde-claro transition-colors border-none"
          >
            Aplicar
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg cursor-pointer text-xs font-josefin tracking-wider uppercase bg-crema/[0.06] text-crema/70 hover:bg-crema/[0.12] transition-colors border border-crema/10"
            title="Exportar a PDF (próximamente)"
          >
            ⤓ PDF
          </button>
          <button
            className="px-4 py-2 rounded-lg cursor-pointer text-xs font-josefin tracking-wider uppercase bg-crema/[0.06] text-crema/70 hover:bg-crema/[0.12] transition-colors border border-crema/10"
            title="Exportar a Excel (próximamente)"
          >
            ⤓ Excel
          </button>
        </div>
      </div>

      {/* CONTENIDO DEL REPORTE */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-10 h-10 border-2 border-amarillo/30 border-t-amarillo rounded-full animate-spin" />
          <p className="text-crema/40 font-josefin text-sm">Generando reporte...</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-rojo font-josefin">{error}</p>
        </div>
      ) : data ? (
        <>
          {tab === "trial_balance" && <TrialBalanceView data={data as TrialBalanceData} />}
          {tab === "income_statement" && <IncomeStatementView data={data as IncomeStatementData} />}
          {tab === "balance_sheet" && <BalanceSheetView data={data as BalanceSheetData} />}
        </>
      ) : null}
    </div>
  );
}

// ============================================================
// VISTA: BALANCE DE COMPROBACIÓN
// ============================================================

function TrialBalanceView({ data }: { data: TrialBalanceData }) {
  return (
    <ReportShell title="Balance de Comprobación" subtitle="Listado de saldos y movimientos por cuenta">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b-2 border-amarillo/20">
              <Th align="left">Código</Th>
              <Th align="left">Cuenta</Th>
              <Th align="left">Naturaleza</Th>
              <Th align="right">Saldo Inicial</Th>
              <Th align="right">Débito</Th>
              <Th align="right">Crédito</Th>
              <Th align="right">Saldo Final</Th>
            </tr>
          </thead>
          <tbody>
            {data.rows.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-crema/30 font-josefin text-sm">
                  No hay movimientos en el periodo seleccionado.
                </td>
              </tr>
            )}
            {data.rows.map((r) => (
              <tr
                key={r.code}
                className="border-b border-crema/[0.04] last:border-0 hover:bg-crema/[0.02] transition-colors"
              >
                <td className="px-4 py-2">
                  <span className="font-bebas text-amarillo/70 text-sm tracking-wider">
                    {r.code}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="font-josefin text-sm text-crema/80">{r.name}</span>
                </td>
                <td className="px-4 py-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-crema/[0.06] text-crema/50 font-semibold tracking-wider">
                    {r.nature || "—"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right font-josefin text-sm text-crema/60 tabular-nums">
                  {formatCOP(r.openingBalance || 0)}
                </td>
                <td className="px-4 py-2 text-right font-bebas text-emerald-400/90 tabular-nums">
                  {(r.debit ?? 0) > 0 ? formatCOP(r.debit ?? 0) : "—"}
                </td>
                <td className="px-4 py-2 text-right font-bebas text-red-400/90 tabular-nums">
                  {(r.credit ?? 0) > 0 ? formatCOP(r.credit ?? 0) : "—"}
                </td>
                <td className="px-4 py-2 text-right font-bebas text-crema tabular-nums">
                  {formatCOP(r.closingBalance || 0)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-amarillo/[0.08] border-t-2 border-amarillo/30">
              <td colSpan={3} className="px-4 py-3">
                <span className="font-playfair text-crema font-bold tracking-wide">
                  TOTALES
                </span>
              </td>
              <td className="px-4 py-3 text-right font-bebas text-amarillo text-lg tabular-nums">
                {formatCOP(data.totals.opening)}
              </td>
              <td className="px-4 py-3 text-right font-bebas text-emerald-400 text-lg tabular-nums">
                {formatCOP(data.totals.debit)}
              </td>
              <td className="px-4 py-3 text-right font-bebas text-red-400 text-lg tabular-nums">
                {formatCOP(data.totals.credit)}
              </td>
              <td className="px-4 py-3 text-right font-bebas text-amarillo text-lg tabular-nums">
                {formatCOP(data.totals.closing)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Validación de cuadre */}
      <div className="mt-4 flex items-center justify-end gap-2 text-xs font-josefin">
        {data.totals.debit === data.totals.credit ? (
          <>
            <span className="w-2 h-2 rounded-full bg-verde-claro" />
            <span className="text-verde-claro">
              Balance cuadrado: débitos = créditos
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-rojo" />
            <span className="text-rojo">Descuadre detectado</span>
          </>
        )}
      </div>
    </ReportShell>
  );
}

// ============================================================
// VISTA: ESTADO DE RESULTADOS
// ============================================================

function IncomeStatementView({ data }: { data: IncomeStatementData }) {
  return (
    <ReportShell
      title="Estado de Resultados"
      subtitle={`Del ${formatDate(new Date(data.period.startDate || Date.now()))} al ${formatDate(new Date(data.period.endDate || Date.now()))}`}
    >
      {/* INGRESOS */}
      <PLSection
        title="Ingresos Operacionales"
        accent="text-amarillo"
        rows={data.ingresos}
        total={data.totalIngresos}
        emptyText="Sin ingresos registrados en el periodo."
      />

      {/* COSTOS */}
      <div className="mt-6">
        <PLSection
          title="Costo de Ventas"
          accent="text-rose-400"
          rows={data.costos}
          total={data.totalCostos}
          isDebit
          emptyText="Sin costos registrados en el periodo."
        />
      </div>

      {/* UTILIDAD BRUTA */}
      <ResultRow
        label="UTILIDAD BRUTA"
        value={data.utilidadBruta}
        bold
      />

      <div className="my-5 border-t border-dashed border-crema/10" />

      {/* GASTOS */}
      <PLSection
        title="Gastos Operacionales"
        accent="text-orange-400"
        rows={data.gastos}
        total={data.totalGastos}
        isDebit
        emptyText="Sin gastos registrados en el periodo."
      />

      <div className="my-5 border-t border-dashed border-crema/10" />

      {/* RESULTADOS FINALES */}
      <ResultRow
        label="UTILIDAD OPERACIONAL"
        value={data.utilidadOperacional}
        accent="text-crema"
      />
      <ResultRow
        label="UTILIDAD NETA DEL PERIODO"
        value={data.utilidadNeta}
        bold
        accent={
          data.utilidadNeta >= 0 ? "text-verde-claro" : "text-rojo"
        }
      />
    </ReportShell>
  );
}

// ============================================================
// VISTA: BALANCE GENERAL
// ============================================================

function BalanceSheetView({ data }: { data: BalanceSheetData }) {
  return (
    <ReportShell
      title="Balance General"
      subtitle={`Estado de Situación Financiera al ${formatDate(new Date(data.asOfDate || Date.now()))}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ACTIVO */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-emerald-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="font-playfair text-lg text-crema font-bold tracking-wide">
              ACTIVO
            </h3>
          </div>
          <table className="w-full">
            <tbody>
              {data.activo.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-crema/30 font-josefin text-sm">
                    Sin cuentas de activo con saldo.
                  </td>
                </tr>
              )}
              {data.activo.map((r) => (
                <tr
                  key={r.code}
                  className="border-b border-crema/[0.04] last:border-0 hover:bg-crema/[0.02] transition-colors"
                >
                  <td className="py-2 pr-2">
                    <span className="font-bebas text-amarillo/60 text-xs tracking-wider mr-2">
                      {r.code}
                    </span>
                    <span className="font-josefin text-sm text-crema/70">
                      {r.name}
                    </span>
                  </td>
                  <td className="py-2 text-right font-bebas text-crema/80 tabular-nums whitespace-nowrap">
                    {formatCOP(r.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-emerald-500/[0.08] border-t-2 border-emerald-500/30">
                <td className="py-3 px-2">
                  <span className="font-playfair text-emerald-400 font-bold tracking-wide">
                    TOTAL ACTIVO
                  </span>
                </td>
                <td className="py-3 px-2 text-right font-bebas text-emerald-400 text-xl tabular-nums">
                  {formatCOP(data.totalActivo)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* PASIVO + PATRIMONIO */}
        <div className="space-y-6">
          {/* PASIVO */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-red-500/30">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <h3 className="font-playfair text-lg text-crema font-bold tracking-wide">
                PASIVO
              </h3>
            </div>
            <table className="w-full">
              <tbody>
                {data.pasivo.length === 0 && (
                  <tr>
                    <td className="py-4 text-center text-crema/30 font-josefin text-sm">
                      Sin pasivos.
                    </td>
                  </tr>
                )}
                {data.pasivo.map((r) => (
                  <tr
                    key={r.code}
                    className="border-b border-crema/[0.04] last:border-0 hover:bg-crema/[0.02] transition-colors"
                  >
                    <td className="py-2 pr-2">
                      <span className="font-bebas text-amarillo/60 text-xs tracking-wider mr-2">
                        {r.code}
                      </span>
                      <span className="font-josefin text-sm text-crema/70">
                        {r.name}
                      </span>
                    </td>
                    <td className="py-2 text-right font-bebas text-crema/80 tabular-nums whitespace-nowrap">
                      {formatCOP(r.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-red-500/[0.08] border-t-2 border-red-500/30">
                  <td className="py-3 px-2">
                    <span className="font-playfair text-red-400 font-bold tracking-wide">
                      TOTAL PASIVO
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-bebas text-red-400 text-lg tabular-nums">
                    {formatCOP(data.totalPasivo)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* PATRIMONIO */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-sky-500/30">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <h3 className="font-playfair text-lg text-crema font-bold tracking-wide">
                PATRIMONIO
              </h3>
            </div>
            <table className="w-full">
              <tbody>
                {data.patrimonio.length === 0 && (
                  <tr>
                    <td className="py-4 text-center text-crema/30 font-josefin text-sm">
                      Sin patrimonio registrado.
                    </td>
                  </tr>
                )}
                {data.patrimonio.map((r) => (
                  <tr
                    key={r.code}
                    className="border-b border-crema/[0.04] last:border-0 hover:bg-crema/[0.02] transition-colors"
                  >
                    <td className="py-2 pr-2">
                      <span className="font-bebas text-amarillo/60 text-xs tracking-wider mr-2">
                        {r.code}
                      </span>
                      <span className="font-josefin text-sm text-crema/70">
                        {r.name}
                      </span>
                    </td>
                    <td className="py-2 text-right font-bebas text-crema/80 tabular-nums whitespace-nowrap">
                      {formatCOP(r.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-sky-500/[0.08] border-t-2 border-sky-500/30">
                  <td className="py-3 px-2">
                    <span className="font-playfair text-sky-400 font-bold tracking-wide">
                      TOTAL PATRIMONIO
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-bebas text-sky-400 text-lg tabular-nums">
                    {formatCOP(data.totalPatrimonio)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* TOTAL PASIVO + PATRIMONIO */}
          <div className="rounded-lg bg-amarillo/[0.08] border border-amarillo/25 p-3 flex justify-between items-center">
            <span className="font-playfair text-amarillo font-bold tracking-wide">
              TOTAL PASIVO + PATRIMONIO
            </span>
            <span className="font-bebas text-amarillo text-xl tabular-nums">
              {formatCOP(data.totalPasivo + data.totalPatrimonio)}
            </span>
          </div>
        </div>
      </div>

      {/* ECUACIÓN CONTABLE */}
      <div
        className={`mt-6 p-4 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
          data.balanceOk
            ? "bg-verde-claro/[0.08] border-verde-claro/30"
            : "bg-red-500/[0.08] border-red-500/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full ${data.balanceOk ? "bg-verde-claro" : "bg-rojo"}`}
          />
          <span
            className={`font-playfair font-bold tracking-wide ${
              data.balanceOk ? "text-verde-claro" : "text-rojo"
            }`}
          >
            {data.balanceOk
              ? "Balance cuadrado"
              : "Descuadre en la ecuación contable"}
          </span>
        </div>
        <div className="font-bebas text-crema/80 text-sm tabular-nums">
          ACTIVO {formatCOP(data.totalActivo)} = PASIVO {formatCOP(data.totalPasivo)} +
          PATRIMONIO {formatCOP(data.totalPatrimonio)}
          {!data.balanceOk && (
            <span className="text-rojo ml-2">
              (Diferencia: {formatCOP(data.totalActivo - data.totalPasivo - data.totalPatrimonio)})
            </span>
          )}
        </div>
      </div>
    </ReportShell>
  );
}

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

function ReportShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-crema/[0.025] border border-crema/[0.08] overflow-hidden">
      {/* Encabezado del reporte */}
      <div className="px-6 py-5 border-b border-amarillo/15 bg-gradient-to-r from-cafe-oscuro/40 to-transparent">
        <h2 className="font-playfair text-2xl text-crema font-bold tracking-wide">
          {title}
        </h2>
        <p className="text-xs text-amarillo/70 font-josefin uppercase tracking-[0.15em] mt-1">
          {subtitle}
        </p>
        <p className="text-[10px] text-crema/30 font-josefin mt-1">
          Café La Elda 1941 · Persona Natural · Valores en pesos colombianos (COP)
        </p>
      </div>

      {/* Cuerpo */}
      <div className="p-6">{children}</div>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-2.5 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function PLSection({
  title,
  accent,
  rows,
  total,
  isDebit = false,
  emptyText,
}: {
  title: string;
  accent: string;
  rows: IncomeStatementRow[];
  total: number;
  isDebit?: boolean;
  emptyText: string;
}) {
  return (
    <div>
      <h3 className={`font-playfair text-base ${accent} font-bold mb-2 tracking-wide uppercase`}>
        {title}
      </h3>
      <table className="w-full">
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="py-3 text-center text-crema/30 font-josefin text-sm">
                {emptyText}
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr
              key={r.code}
              className="border-b border-crema/[0.04] last:border-0 hover:bg-crema/[0.02] transition-colors"
            >
              <td className="py-2 pr-2 pl-2">
                <span className="font-bebas text-amarillo/60 text-xs tracking-wider mr-2">
                  {r.code}
                </span>
                <span className="font-josefin text-sm text-crema/70">{r.name}</span>
              </td>
              <td className="py-2 text-right font-bebas text-crema/80 tabular-nums whitespace-nowrap pr-2">
                {isDebit ? `(${formatCOP(r.amount)})` : formatCOP(r.amount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={`bg-crema/[0.04] border-t border-crema/15`}>
            <td className="py-2.5 px-2">
              <span className={`font-playfair text-sm font-bold tracking-wide ${accent}`}>
                Total {title}
              </span>
            </td>
            <td className={`py-2.5 px-2 text-right font-bebas text-lg tabular-nums ${accent}`}>
              {isDebit ? `(${formatCOP(total)})` : formatCOP(total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function ResultRow({
  label,
  value,
  bold = false,
  accent = "text-crema",
}: {
  label: string;
  value: number;
  bold?: boolean;
  accent?: string;
}) {
  return (
    <div
      className={`flex justify-between items-center mt-3 py-3 px-4 rounded-lg ${
        bold ? "bg-amarillo/[0.1] border border-amarillo/25" : "bg-crema/[0.03]"
      }`}
    >
      <span
        className={`font-playfair tracking-wide ${
          bold ? "text-crema font-bold text-base" : "text-crema/70 text-sm"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-bebas tabular-nums ${bold ? "text-2xl" : "text-xl"} ${accent}`}
      >
        {formatCOP(value)}
      </span>
    </div>
  );
}
