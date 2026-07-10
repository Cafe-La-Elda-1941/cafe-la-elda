"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCOP, formatDate, toCents } from "@/lib/format";

// ============================================================
// TIPOS
// ============================================================

interface AccountOption {
  code: string;
  name: string;
  type: string;
  nature: string;
}

interface JournalLineApi {
  id: string;
  accountId: string;
  account: { code: string; name: string; type: string; nature: string };
  debit: number;
  credit: number;
  description: string | null;
  costCenter: string | null;
}

interface JournalEntryApi {
  id: string;
  number: number;
  type: string;
  description: string;
  reference: string | null;
  entryDate: string;
  status: string;
  postedAt: string | null;
  totalDebit: number;
  totalCredit: number;
  source: string;
  lines: JournalLineApi[];
}

interface JournalResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  entries: JournalEntryApi[];
}

interface DraftLine {
  key: string;
  accountCode: string;
  debit: string; // pesos para edición
  credit: string;
  description: string;
}

// ============================================================
// CONFIG
// ============================================================

const ENTRY_TYPES: Array<{ value: string; label: string; icon: string }> = [
  { value: "DIARIO", label: "Diario", icon: "📔" },
  { value: "INGRESO", label: "Ingreso", icon: "⬆" },
  { value: "EGRESO", label: "Egreso", icon: "⬇" },
  { value: "AJUSTE", label: "Ajuste", icon: "⚖" },
];

const TYPE_BADGE: Record<string, string> = {
  DIARIO: "bg-crema/[0.08] text-crema/70",
  INGRESO: "bg-emerald-500/15 text-emerald-300",
  EGRESO: "bg-red-500/15 text-red-300",
  VENTA: "bg-amarillo/15 text-amarillo",
  COMPRA: "bg-sky-500/15 text-sky-300",
  NOMINA: "bg-purple-500/15 text-purple-300",
  AJUSTE: "bg-orange-500/15 text-orange-300",
};

const STATUS_BADGE: Record<string, string> = {
  BORRADOR: "bg-crema/[0.08] text-crema/50",
  POSTEADO: "bg-verde-claro/15 text-verde-claro",
  ANULADO: "bg-red-500/15 text-red-400",
};

const inputCn =
  "w-full bg-crema/[0.06] border border-crema/15 text-crema py-2.5 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors placeholder:text-crema/25";

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AdminAsientos() {
  const [data, setData] = useState<JournalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);

  // Expansión
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Formulario nuevo asiento
  const [showForm, setShowForm] = useState(false);
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [form, setForm] = useState({
    type: "DIARIO",
    description: "",
    reference: "",
    entryDate: new Date().toISOString().split("T")[0],
  });
  const [lines, setLines] = useState<DraftLine[]>([
    { key: crypto.randomUUID(), accountCode: "", debit: "", credit: "", description: "" },
    { key: crypto.randomUUID(), accountCode: "", debit: "", credit: "", description: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Cargar asientos
  const loadEntries = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", "20");
    if (filterType) params.set("type", filterType);
    if (filterStatus) params.set("status", filterStatus);

    fetch(`/api/admin/contabilidad/journal?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar asientos");
        return r.json();
      })
      .then((d: JournalResponse) => {
        setData(d);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterType, filterStatus]);

  // Cargar cuentas para el select del formulario
  useEffect(() => {
    if (!showForm) return;
    fetch("/api/admin/contabilidad/accounts?hierarchy=false&leaf=true")
      .then((r) => r.json())
      .then((d) => setAccounts(d.accounts || []))
      .catch(() => setAccounts([]));
  }, [showForm]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ============================================================
  // MANEJO DE LÍNEAS DEL FORMULARIO
  // ============================================================

  const updateLine = (key: string, field: keyof DraftLine, value: string) => {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, [field]: value } : l))
    );
  };

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { key: crypto.randomUUID(), accountCode: "", debit: "", credit: "", description: "" },
    ]);
  };

  const removeLine = (key: string) => {
    if (lines.length <= 2) return;
    setLines((prev) => prev.filter((l) => l.key !== key));
  };

  // Totales del formulario (en centavos)
  const totals = useMemo(() => {
    let debit = 0;
    let credit = 0;
    for (const l of lines) {
      debit += toCents(Number(l.debit) || 0);
      credit += toCents(Number(l.credit) || 0);
    }
    return { debit, credit, diff: debit - credit, balanced: debit === credit };
  }, [lines]);

  const canSubmit =
    form.description.trim() !== "" &&
    lines.length >= 2 &&
    totals.balanced &&
    totals.debit > 0 &&
    lines.every((l) => l.accountCode !== "") &&
    !submitting;

  const handleSubmit = async () => {
    setFormError(null);
    if (!canSubmit) {
      if (!totals.balanced) {
        setFormError(
          `El asiento no balancea. Diferencia: ${formatCOP(Math.abs(totals.diff))}`
        );
      } else if (lines.some((l) => !l.accountCode)) {
        setFormError("Todas las líneas deben tener una cuenta seleccionada");
      } else if (!form.description.trim()) {
        setFormError("La descripción es obligatoria");
      }
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type: form.type,
        description: form.description.trim(),
        reference: form.reference || undefined,
        entryDate: new Date(form.entryDate).toISOString(),
        source: "MANUAL",
        lines: lines.map((l) => ({
          accountCode: l.accountCode,
          debit: toCents(Number(l.debit) || 0),
          credit: toCents(Number(l.credit) || 0),
          description: l.description || undefined,
        })),
      };

      const res = await fetch("/api/admin/contabilidad/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al crear el asiento");
      }

      // Reset y recargar
      setForm({
        type: "DIARIO",
        description: "",
        reference: "",
        entryDate: new Date().toISOString().split("T")[0],
      });
      setLines([
        { key: crypto.randomUUID(), accountCode: "", debit: "", credit: "", description: "" },
        { key: crypto.randomUUID(), accountCode: "", debit: "", credit: "", description: "" },
      ]);
      setShowForm(false);
      setPage(1);
      loadEntries();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormError(null);
    setForm({
      type: "DIARIO",
      description: "",
      reference: "",
      entryDate: new Date().toISOString().split("T")[0],
    });
    setLines([
      { key: crypto.randomUUID(), accountCode: "", debit: "", credit: "", description: "" },
      { key: crypto.randomUUID(), accountCode: "", debit: "", credit: "", description: "" },
    ]);
  };

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
            <span className="text-crema/40">Asientos</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl text-crema mb-1">
            Asientos Contables
          </h1>
          <p className="text-sm text-crema/50 font-josefin">
            {data?.total ?? 0} comprobantes registrados &middot; Partida doble
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none font-josefin transition-all ${
            showForm
              ? "bg-crema/10 text-crema"
              : "bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro"
          }`}
        >
          {showForm ? "✕ Cancelar" : "+ Nuevo Asiento"}
        </button>
      </div>

      {/* FORMULARIO NUEVO ASIENTO */}
      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-crema/[0.04] border border-amarillo/15">
          <h3 className="font-playfair text-lg text-crema mb-1">
            Nuevo Asiento Contable
          </h3>
          <p className="text-xs text-crema/40 font-josefin mb-5">
            Registre el comprobante con partida doble. Los valores se ingresan en pesos (COP).
          </p>

          {/* Encabezado del asiento */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5 font-josefin">
                Tipo de comprobante
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputCn}
              >
                {ENTRY_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-cafe-oscuro">
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5 font-josefin">
                Fecha
              </label>
              <input
                type="date"
                value={form.entryDate}
                onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
                className={inputCn}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5 font-josefin">
                Referencia
              </label>
              <input
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
                placeholder="Factura, recibo..."
                className={inputCn}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5 font-josefin">
                Descripción *
              </label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Concepto del asiento"
                className={inputCn}
              />
            </div>
          </div>

          {/* Líneas dinámicas */}
          <div className="rounded-lg border border-crema/[0.08] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-crema/[0.03] border-b border-crema/[0.08]">
                  <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-crema/40 font-josefin font-normal w-[45%]">
                    Cuenta PUC
                  </th>
                  <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                    Detalle
                  </th>
                  <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-emerald-300/60 font-josefin font-normal">
                    Débito
                  </th>
                  <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-red-300/60 font-josefin font-normal">
                    Crédito
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr
                    key={line.key}
                    className="border-b border-crema/[0.04] last:border-0"
                  >
                    <td className="px-3 py-2">
                      <select
                        value={line.accountCode}
                        onChange={(e) => updateLine(line.key, "accountCode", e.target.value)}
                        className="w-full bg-crema/[0.04] border border-crema/10 text-crema py-2 px-2 font-josefin text-xs rounded-md outline-none focus:border-amarillo transition-colors"
                      >
                        <option value="" className="bg-cafe-oscuro">
                          Seleccionar cuenta...
                        </option>
                        {accounts.map((a) => (
                          <option key={a.code} value={a.code} className="bg-cafe-oscuro">
                            {a.code} — {a.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={line.description}
                        onChange={(e) => updateLine(line.key, "description", e.target.value)}
                        placeholder="Detalle"
                        className="w-full bg-crema/[0.04] border border-crema/10 text-crema py-2 px-2 font-josefin text-xs rounded-md outline-none focus:border-amarillo transition-colors"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={line.debit}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateLine(line.key, "debit", val);
                          if (val !== "" && val !== "0") {
                            updateLine(line.key, "credit", "");
                          }
                        }}
                        placeholder="0"
                        className="w-full bg-crema/[0.04] border border-crema/10 text-crema py-2 px-2 font-josefin text-xs rounded-md text-right outline-none focus:border-emerald-400/60 transition-colors tabular-nums"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={line.credit}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateLine(line.key, "credit", val);
                          if (val !== "" && val !== "0") {
                            updateLine(line.key, "debit", "");
                          }
                        }}
                        placeholder="0"
                        className="w-full bg-crema/[0.04] border border-crema/10 text-crema py-2 px-2 font-josefin text-xs rounded-md text-right outline-none focus:border-red-400/60 transition-colors tabular-nums"
                      />
                    </td>
                    <td className="px-2 text-center">
                      <button
                        onClick={() => removeLine(line.key)}
                        disabled={lines.length <= 2}
                        className="text-crema/30 hover:text-rojo disabled:opacity-30 disabled:hover:text-crema/30 cursor-pointer bg-transparent border-none text-sm"
                        title="Eliminar línea"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-crema/[0.04] border-t-2 border-crema/10">
                  <td colSpan={2} className="px-3 py-2.5">
                    <button
                      onClick={addLine}
                      className="text-xs font-josefin text-amarillo hover:text-amarillo-oscuro cursor-pointer bg-transparent border border-amarillo/30 hover:border-amarillo/60 rounded-md px-3 py-1 transition-colors"
                    >
                      + Agregar línea
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-right font-bebas text-emerald-400 text-lg tabular-nums">
                    {formatCOP(totals.debit)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bebas text-red-400 text-lg tabular-nums">
                    {formatCOP(totals.credit)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Estado de balance y error */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-josefin ${
                  totals.balanced && totals.debit > 0
                    ? "bg-verde-claro/15 text-verde-claro"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    totals.balanced && totals.debit > 0 ? "bg-verde-claro" : "bg-red-400"
                  }`}
                />
                {totals.balanced && totals.debit > 0
                  ? "Asiento balanceado"
                  : totals.debit === 0
                    ? "Ingrese valores"
                    : `Diferencia: ${formatCOP(Math.abs(totals.diff))}`}
              </span>
              {formError && (
                <span className="text-xs text-rojo font-josefin">{formError}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="px-5 py-2.5 rounded-lg cursor-pointer text-sm font-josefin tracking-wider uppercase border-none bg-crema/[0.08] text-crema hover:bg-crema/15 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-8 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-verde text-crema font-josefin hover:bg-verde-claro transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Guardando..." : "Crear Asiento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTROS */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
          className="bg-crema/[0.04] border border-crema/10 text-crema py-2 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo cursor-pointer"
        >
          <option value="" className="bg-cafe-oscuro">Todos los tipos</option>
          {ENTRY_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-cafe-oscuro">
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="bg-crema/[0.04] border border-crema/10 text-crema py-2 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo cursor-pointer"
        >
          <option value="" className="bg-cafe-oscuro">Todos los estados</option>
          <option value="POSTEADO" className="bg-cafe-oscuro">Posteado</option>
          <option value="BORRADOR" className="bg-cafe-oscuro">Borrador</option>
          <option value="ANULADO" className="bg-cafe-oscuro">Anulado</option>
        </select>
        <span className="text-xs text-crema/40 font-josefin ml-auto">
          {data ? `Página ${data.page} de ${data.totalPages}` : ""}
        </span>
      </div>

      {/* LISTA DE ASIENTOS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-8 h-8 border-2 border-amarillo/30 border-t-amarillo rounded-full animate-spin" />
          <p className="text-crema/40 font-josefin text-sm">Cargando asientos...</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-rojo font-josefin">{error}</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-crema/[0.025] border border-crema/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-crema/10 bg-crema/[0.02]">
                    <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal w-10" />
                    <th className="text-left px-3 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                      N°
                    </th>
                    <th className="text-left px-3 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                      Fecha
                    </th>
                    <th className="text-left px-3 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                      Tipo
                    </th>
                    <th className="text-left px-3 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                      Descripción
                    </th>
                    <th className="text-left px-3 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                      Estado
                    </th>
                    <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                      Total Débito
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.entries.map((entry) => {
                    const isOpen = expanded.has(entry.id);
                    return (
                      <AsientoRow
                        key={entry.id}
                        entry={entry}
                        isOpen={isOpen}
                        toggle={() => toggleExpand(entry.id)}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {data && data.entries.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-crema/30 font-josefin text-sm">
                No hay asientos contables registrados con estos filtros.
              </p>
            </div>
          )}

          {/* Paginación */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-crema/[0.04] border border-crema/10 text-crema/70 text-sm font-josefin hover:bg-crema/[0.08] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-crema/50 font-josefin px-2">
                {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="px-3 py-1.5 rounded-lg bg-crema/[0.04] border border-crema/10 text-crema/70 text-sm font-josefin hover:bg-crema/[0.08] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// FILA DE ASIENTO (EXPANDIBLE)
// ============================================================

function AsientoRow({
  entry,
  isOpen,
  toggle,
}: {
  entry: JournalEntryApi;
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={toggle}
        className="border-b border-crema/[0.04] last:border-0 hover:bg-crema/[0.02] transition-colors cursor-pointer"
      >
        <td className="px-5 py-3 text-crema/30 text-xs">
          {isOpen ? "▾" : "▸"}
        </td>
        <td className="px-3 py-3">
          <span className="font-bebas text-amarillo text-base tracking-wider">
            #{String(entry.number).padStart(5, "0")}
          </span>
        </td>
        <td className="px-3 py-3 text-sm text-crema/60 font-josefin">
          {formatDate(entry.entryDate)}
        </td>
        <td className="px-3 py-3">
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${TYPE_BADGE[entry.type] || TYPE_BADGE.DIARIO}`}
          >
            {entry.type}
          </span>
        </td>
        <td className="px-3 py-3 text-sm text-crema/80 font-josefin max-w-md truncate">
          {entry.description}
          {entry.reference && (
            <span className="text-crema/30 text-xs ml-2">· {entry.reference}</span>
          )}
        </td>
        <td className="px-3 py-3">
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[entry.status] || STATUS_BADGE.BORRADOR}`}
          >
            {entry.status}
          </span>
        </td>
        <td className="px-5 py-3 text-right">
          <span className="font-bebas text-crema text-base tabular-nums">
            {formatCOP(entry.totalDebit)}
          </span>
        </td>
      </tr>

      {/* Detalle expandido */}
      {isOpen && (
        <tr className="bg-cafe-oscuro/30">
          <td colSpan={7} className="px-5 py-4">
            <div className="rounded-lg border border-crema/[0.06] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-crema/[0.03] border-b border-crema/[0.08]">
                    <th className="text-left px-4 py-2 text-[10px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                      Código
                    </th>
                    <th className="text-left px-4 py-2 text-[10px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                      Cuenta
                    </th>
                    <th className="text-left px-4 py-2 text-[10px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                      Detalle
                    </th>
                    <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider text-emerald-300/60 font-josefin font-normal">
                      Débito
                    </th>
                    <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider text-red-300/60 font-josefin font-normal">
                      Crédito
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entry.lines.map((line) => (
                    <tr
                      key={line.id}
                      className="border-b border-crema/[0.04] last:border-0"
                    >
                      <td className="px-4 py-2">
                        <span className="font-bebas text-amarillo/70 text-sm tracking-wider">
                          {line.account.code}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="font-josefin text-sm text-crema/80">
                          {line.account.name}
                        </span>
                        <span className="text-crema/30 text-xs ml-1">
                          ({line.account.type})
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="font-josefin text-xs text-crema/50 italic">
                          {line.description || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        {line.debit > 0 ? (
                          <span className="font-bebas text-emerald-400 tabular-nums">
                            {formatCOP(line.debit)}
                          </span>
                        ) : (
                          <span className="text-crema/20">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {line.credit > 0 ? (
                          <span className="font-bebas text-red-400 tabular-nums">
                            {formatCOP(line.credit)}
                          </span>
                        ) : (
                          <span className="text-crema/20">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-crema/[0.05] border-t-2 border-crema/10">
                    <td colSpan={3} className="px-4 py-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-crema/40 font-josefin">
                        Totales · {entry.lines.length} líneas · Origen: {entry.source}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-bebas text-emerald-400 text-base tabular-nums">
                      {formatCOP(entry.totalDebit)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bebas text-red-400 text-base tabular-nums">
                      {formatCOP(entry.totalCredit)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
