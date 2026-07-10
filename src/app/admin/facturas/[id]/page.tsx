"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  formatCOP,
  formatDateTime,
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/format";

// ============================================================
// TIPOS
// ============================================================

interface InvoiceItemRow {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  ivaRate: number;
  ivaAmount: number;
  total: number;
}

interface JournalLine {
  id: string;
  debit: number;
  credit: number;
  description: string | null;
  account: { code: string; name: string };
}

interface JournalEntry {
  id: string;
  number: number;
  type: string;
  description: string;
  entryDate: string;
  status: string;
  totalDebit: number;
  totalCredit: number;
  lines: JournalLine[];
}

interface InvoiceDetail {
  id: string;
  fullNumber: string;
  type: string;
  status: string;
  cufe: string | null;
  qrCode: string | null;
  errorMessage: string | null;
  dianResponse: unknown;
  // Cliente
  customerName: string;
  customerDocument: string;
  customerEmail: string | null;
  customerPhone: string | null;
  // Totales (centavos)
  subtotal: number;
  discount: number;
  iva: number;
  total: number;
  // Pago
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string | null;
  // Metadata
  notes: string | null;
  createdAt: string;
  // Relaciones
  items: InvoiceItemRow[];
  customer: {
    id: string;
    fullName: string;
    documentNumber: string;
    documentType: string;
    email: string | null;
    phone: string | null;
    city: string | null;
    address: string | null;
  } | null;
  order: { id: string; customerName: string; total: number; status: string } | null;
  journalEntry: JournalEntry | null;
}

// ============================================================
// HELPERS
// ============================================================

const PAYMENT_STATUS_CN: Record<string, string> = {
  PAGADA: "bg-verde-claro/15 text-verde-claro",
  PENDIENTE: "bg-amarillo/15 text-amarillo",
  PARCIAL: "bg-blue-400/15 text-blue-400",
  VENCIDA: "bg-rojo/15 text-rojo",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PAGADA: "Pagada",
  PENDIENTE: "Pendiente",
  PARCIAL: "Parcial",
  VENCIDA: "Vencida",
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
}

// ============================================================
// PÁGINA DE DETALLE
// ============================================================

export default function FacturaDetalle() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [showCancelBox, setShowCancelBox] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [copied, setCopied] = useState(false);

  const loadInvoice = async () => {
    try {
      const res = await fetch(`/api/admin/facturas/${id}`);
      if (!res.ok) throw new Error("No se pudo cargar la factura");
      const data = await res.json();
      setInvoice(data);
    } catch {
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ---------- Acciones ----------

  const handleSendDian = async () => {
    setActionLoading("dian");
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/facturas/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendDian" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error enviando a DIAN");
      setFeedback({
        type: data.dianResult?.success ? "ok" : "err",
        msg: data.dianResult?.success
          ? "Factura enviada y aceptada por la DIAN."
          : data.dianResult?.error || data.errorMessage || "La DIAN no aceptó la factura.",
      });
      await loadInvoice();
    } catch (err) {
      setFeedback({ type: "err", msg: err instanceof Error ? err.message : "Error enviando a DIAN" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      setFeedback({ type: "err", msg: "Debe indicar el motivo de anulación." });
      return;
    }
    setActionLoading("cancel");
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/facturas/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", reason: cancelReason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al anular");
      setFeedback({ type: "ok", msg: "Factura anulada correctamente." });
      setShowCancelBox(false);
      setCancelReason("");
      await loadInvoice();
    } catch (err) {
      setFeedback({ type: "err", msg: err instanceof Error ? err.message : "Error al anular" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkPaid = async () => {
    setActionLoading("paid");
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/facturas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "PAGADA" }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setFeedback({ type: "ok", msg: "Factura marcada como pagada." });
      await loadInvoice();
    } catch (err) {
      setFeedback({ type: "err", msg: err instanceof Error ? err.message : "Error al actualizar" });
    } finally {
      setActionLoading(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyCufe = async () => {
    if (invoice?.cufe) {
      try {
        await navigator.clipboard.writeText(invoice.cufe);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // noop
      }
    }
  };

  // ---------- Render states ----------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-crema/30 font-josefin">
        Cargando factura...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-crema/40 font-josefin">Factura no encontrada.</p>
        <Link href="/admin/facturas" className="text-amarillo hover:text-amarillo-oscuro transition-colors font-josefin text-sm no-underline">
          ← Volver a facturas
        </Link>
      </div>
    );
  }

  const statusCfg = INVOICE_STATUS_LABELS[invoice.status] || {
    label: invoice.status,
    color: "bg-gray-500/20 text-gray-400",
  };
  const isAnulada = invoice.status === "ANULADA";

  const inputCn =
    "w-full bg-crema/[0.06] border border-crema/15 text-crema py-2.5 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors placeholder:text-crema/25";

  return (
    <div>
      {/* Breadcrumb / volver */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/admin/facturas"
          className="text-sm text-crema/40 hover:text-amarillo transition-colors font-josefin no-underline"
        >
          ← Volver a Facturación
        </Link>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-josefin font-semibold cursor-pointer border border-crema/15 text-crema/70 hover:bg-crema/[0.06] transition-colors"
          >
            🖨 Imprimir
          </button>
          {invoice.status !== "ANULADA" && (
            <>
              <button
                onClick={handleSendDian}
                disabled={actionLoading === "dian"}
                className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-josefin font-semibold cursor-pointer border-none bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro transition-colors disabled:opacity-50"
              >
                {actionLoading === "dian" ? "Enviando..." : "📡 Enviar a DIAN"}
              </button>
              {invoice.paymentStatus !== "PAGADA" && (
                <button
                  onClick={handleMarkPaid}
                  disabled={actionLoading === "paid"}
                  className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-josefin font-semibold cursor-pointer border-none bg-verde-claro text-crema hover:bg-verde transition-colors disabled:opacity-50"
                >
                  ✓ Marcar Pagada
                </button>
              )}
              <button
                onClick={() => setShowCancelBox(!showCancelBox)}
                className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-josefin font-semibold cursor-pointer border border-rojo/40 text-rojo hover:bg-rojo/15 transition-colors"
              >
                ✕ Cancelar Factura
              </button>
            </>
          )}
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mb-5 px-4 py-3 rounded-lg text-sm font-josefin border ${
            feedback.type === "ok"
              ? "bg-verde-claro/15 border-verde-claro/30 text-verde-claro"
              : "bg-rojo/15 border-rojo/30 text-rojo"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Caja de anulación */}
      {showCancelBox && (
        <div className="mb-5 p-5 rounded-xl bg-rojo/[0.06] border border-rojo/25">
          <h4 className="font-playfair text-lg text-crema mb-1">Anular Factura</h4>
          <p className="text-xs text-crema/40 font-josefin mb-3">
            Esta acción revierte el asiento contable asociado y no se puede deshacer.
          </p>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={2}
            placeholder="Motivo de anulación..."
            className={`${inputCn} resize-y`}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => { setShowCancelBox(false); setCancelReason(""); }}
              className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-josefin font-semibold cursor-pointer border border-crema/15 text-crema/70 hover:bg-crema/[0.06] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCancel}
              disabled={actionLoading === "cancel"}
              className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-josefin font-semibold cursor-pointer border-none bg-rojo text-crema hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {actionLoading === "cancel" ? "Anulando..." : "Confirmar Anulación"}
            </button>
          </div>
        </div>
      )}

      {/* Documento de factura */}
      <div className="rounded-2xl bg-crema/[0.04] border border-crema/[0.08] overflow-hidden">
        {/* Encabezado de la factura */}
        <div className="px-6 md:px-8 py-6 border-b border-crema/[0.08] flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-center leading-[1.1] shrink-0 bg-amarillo font-playfair text-[10px] font-black text-verde border-2 border-verde">
              la<br />Elda
            </div>
            <div>
              <div className="font-playfair text-2xl text-crema">Café La Elda 1941</div>
              <div className="text-[11px] text-crema/40 font-josefin">
                Persona Natural · No responsable de IVA · NIT/CC 24.694.411-9
              </div>
              <div className="text-[11px] text-crema/40 font-josefin">
                Dosquebradas, Risaralda, Colombia
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-playfair text-xl text-amarillo mb-1">
              {invoice.type === "FACTURA" ? "Factura de Venta Electrónica" : invoice.type}
            </div>
            <div className="font-bebas text-3xl text-crema tracking-wider">{invoice.fullNumber}</div>
            <div className="mt-2 flex items-center gap-2 justify-end">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-josefin font-semibold uppercase tracking-wider ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-josefin font-semibold uppercase tracking-wider ${PAYMENT_STATUS_CN[invoice.paymentStatus] || "bg-gray-500/20 text-gray-400"}`}>
                {PAYMENT_STATUS_LABEL[invoice.paymentStatus] || invoice.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Info fecha + cliente */}
        <div className="px-6 md:px-8 py-5 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-crema/[0.08]">
          {/* Fecha y pago */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-amarillo/50 font-josefin font-bold mb-2">
              Información de Emisión
            </div>
            <dl className="space-y-1.5 text-sm font-josefin">
              <div className="flex justify-between">
                <dt className="text-crema/40">Fecha emisión</dt>
                <dd className="text-crema">{formatDateTime(invoice.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-crema/40">Método de pago</dt>
                <dd className="text-crema">
                  {PAYMENT_METHOD_LABELS[invoice.paymentMethod] || invoice.paymentMethod}
                </dd>
              </div>
              {invoice.paymentDate && (
                <div className="flex justify-between">
                  <dt className="text-crema/40">Fecha de pago</dt>
                  <dd className="text-verde-claro">{formatDateTime(invoice.paymentDate)}</dd>
                </div>
              )}
              {invoice.order && (
                <div className="flex justify-between">
                  <dt className="text-crema/40">Pedido web</dt>
                  <dd className="text-amarillo">#{invoice.order.id.slice(-6).toUpperCase()}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Cliente */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-amarillo/50 font-josefin font-bold mb-2">
              Facturar a
            </div>
            <div className="text-sm font-josefin">
              <div className="text-crema font-medium text-base mb-0.5">{invoice.customerName}</div>
              <div className="text-crema/50">{invoice.customerDocument}</div>
              {invoice.customerEmail && (
                <div className="text-crema/50">{invoice.customerEmail}</div>
              )}
              {invoice.customerPhone && (
                <div className="text-crema/50">{invoice.customerPhone}</div>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 md:px-8 py-5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-crema/10">
                <th className="text-left pb-2 text-[10px] uppercase tracking-wider text-crema/40 font-normal font-josefin">
                  Descripción
                </th>
                <th className="text-center pb-2 text-[10px] uppercase tracking-wider text-crema/40 font-normal font-josefin w-20">
                  Cant.
                </th>
                <th className="text-right pb-2 text-[10px] uppercase tracking-wider text-crema/40 font-normal font-josefin w-32">
                  P. Unit.
                </th>
                <th className="text-right pb-2 text-[10px] uppercase tracking-wider text-crema/40 font-normal font-josefin w-32">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-crema/[0.04] last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 bg-crema/[0.06]">
                        ☕
                      </div>
                      <span className="text-sm text-crema font-josefin">{item.description}</span>
                    </div>
                  </td>
                  <td className="py-3 text-center text-sm text-crema/60 font-josefin">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-sm text-crema/60 font-josefin whitespace-nowrap">
                    {formatCOP(item.unitPrice)}
                  </td>
                  <td className="py-3 text-right font-bebas text-crema text-lg whitespace-nowrap">
                    {formatCOP(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="px-6 md:px-8 py-5 border-t border-crema/[0.08] flex justify-end">
          <div className="w-full md:w-72 space-y-2 font-josefin text-sm">
            <div className="flex justify-between text-crema/50">
              <span>Subtotal</span>
              <span>{formatCOP(invoice.subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-crema/50">
                <span>Descuento</span>
                <span>- {formatCOP(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-crema/50">
              <span>IVA (0% · No responsable)</span>
              <span>{formatCOP(invoice.iva)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-crema/10">
              <span className="text-crema font-semibold uppercase text-xs tracking-wider">Total</span>
              <span className="font-bebas text-3xl text-amarillo">{formatCOP(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Notas */}
        {invoice.notes && (
          <div className="px-6 md:px-8 py-4 border-t border-crema/[0.08]">
            <div className="text-[10px] uppercase tracking-wider text-crema/40 font-josefin mb-1">
              Observaciones
            </div>
            <p className="text-sm text-crema/60 font-josefin">{invoice.notes}</p>
          </div>
        )}

        {/* Mensaje de error / anulación */}
        {invoice.errorMessage && (
          <div className="px-6 md:px-8 py-4 border-t border-crema/[0.08]">
            <div
              className={`px-4 py-3 rounded-lg text-xs font-josefin ${
                isAnulada
                  ? "bg-rojo/10 border border-rojo/20 text-rojo"
                  : "bg-amarillo/[0.08] border border-amarillo/20 text-amarillo"
              }`}
            >
              <strong>{isAnulada ? "Factura anulada: " : "Estado DIAN: "}</strong>
              {invoice.errorMessage}
            </div>
          </div>
        )}
      </div>

      {/* Sección DIAN + Asiento contable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Estado DIAN / CUFE / QR */}
        <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] p-6">
          <h3 className="font-playfair text-lg text-crema mb-4 flex items-center gap-2">
            📡 Validación DIAN
          </h3>

          {/* QR */}
          {invoice.qrCode ? (
            <div className="flex flex-col items-center gap-2 mb-4">
              <img
                src={invoice.qrCode}
                alt="QR DIAN"
                className="w-40 h-40 rounded-lg bg-white p-2"
              />
              <span className="text-[10px] text-crema/40 font-josefin text-center">
                Escanee para validar en la DIAN
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 mb-4 py-6 text-center">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl bg-crema/[0.06]">
                🔲
              </div>
              <span className="text-[11px] text-crema/40 font-josefin">
                {invoice.status === "BORRADOR"
                  ? "QR disponible tras validación DIAN"
                  : "Sin código QR"}
              </span>
            </div>
          )}

          {/* CUFE */}
          <div className="space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-crema/40 font-josefin mb-1">
                CUFE (Código Único)
              </div>
              {invoice.cufe ? (
                <div className="flex items-start gap-2">
                  <code className="flex-1 text-[10px] text-amarillo/80 font-mono break-all bg-crema/[0.04] rounded-lg px-3 py-2 border border-crema/[0.08]">
                    {invoice.cufe}
                  </code>
                  <button
                    onClick={copyCufe}
                    className="shrink-0 px-3 py-2 rounded-lg text-[10px] uppercase tracking-wider font-josefin font-semibold cursor-pointer border border-crema/15 text-crema/60 hover:bg-crema/[0.06] hover:text-amarillo transition-colors"
                  >
                    {copied ? "✓ Copiado" : "Copiar"}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-crema/30 font-josefin">
                  Sin CUFE. Envíe la factura a DIAN para generar el código.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Asiento contable relacionado */}
        <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-hidden">
          <div className="px-6 py-4 border-b border-crema/[0.08] flex items-center justify-between">
            <h3 className="font-playfair text-lg text-crema flex items-center gap-2">
              📒 Asiento Contable
            </h3>
            {invoice.journalEntry && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-amarillo/10 text-amarillo font-josefin font-semibold uppercase tracking-wider">
                {invoice.journalEntry.type} · #{invoice.journalEntry.number}
              </span>
            )}
          </div>

          {invoice.journalEntry ? (
            <div className="p-2">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-crema/10">
                    <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-crema/40 font-normal font-josefin">
                      Cuenta
                    </th>
                    <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-crema/40 font-normal font-josefin">
                      Débito
                    </th>
                    <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-crema/40 font-normal font-josefin">
                      Crédito
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.journalEntry.lines.map((line) => (
                    <tr key={line.id} className="border-b border-crema/[0.04] last:border-0">
                      <td className="px-3 py-2">
                        <div className="text-sm text-crema font-josefin">
                          <span className="text-amarillo/70 font-mono text-xs mr-2">{line.account.code}</span>
                          {truncate(line.account.name, 32)}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-sm text-crema/60 font-josefin whitespace-nowrap">
                        {line.debit > 0 ? formatCOP(line.debit) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right text-sm text-crema/60 font-josefin whitespace-nowrap">
                        {line.credit > 0 ? formatCOP(line.credit) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-crema/15">
                    <td className="px-3 py-2 text-[10px] uppercase tracking-wider text-crema/40 font-josefin">
                      Totales
                    </td>
                    <td className="px-3 py-2 text-right font-bebas text-amarillo text-base whitespace-nowrap">
                      {formatCOP(invoice.journalEntry.totalDebit)}
                    </td>
                    <td className="px-3 py-2 text-right font-bebas text-amarillo text-base whitespace-nowrap">
                      {formatCOP(invoice.journalEntry.totalCredit)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-crema/30 font-josefin">
              No hay asiento contable asociado a esta factura.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
