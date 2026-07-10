"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  formatCOP,
  formatDate,
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  DOCUMENT_TYPE_LABELS,
} from "@/lib/format";

// ============================================================
// TIPOS
// ============================================================

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface Invoice {
  id: string;
  fullNumber: string;
  customerName: string;
  customerDocument: string;
  subtotal: number;
  discount: number;
  iva: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: InvoiceItem[];
}

interface Product {
  id: string;
  name: string;
  price: number; // pesos
  weight: string;
  active: boolean;
}

// ============================================================
// HELPERS DE FORMATO
// ============================================================

/** Formatea un valor en pesos COP (productos del formulario) */
function formatPesos(p: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(p);
}

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

// ============================================================
// COMPONENTES DE BADGE
// ============================================================

function StatusBadge({ status }: { status: string }) {
  const cfg = INVOICE_STATUS_LABELS[status] || {
    label: status,
    color: "bg-gray-500/20 text-gray-400",
  };
  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-full font-josefin font-semibold uppercase tracking-wider ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const cn = PAYMENT_STATUS_CN[status] || "bg-gray-500/20 text-gray-400";
  const label = PAYMENT_STATUS_LABEL[status] || status;
  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-full font-josefin font-semibold uppercase tracking-wider ${cn}`}>
      {label}
    </span>
  );
}

// ============================================================
// MODAL: NUEVA FACTURA
// ============================================================

interface CreateItem {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number; // pesos
}

interface CreateFormState {
  documentType: string;
  documentNumber: string;
  fullName: string;
  email: string;
  phone: string;
  paymentMethod: string;
  notes: string;
  items: CreateItem[];
}

const emptyForm: CreateFormState = {
  documentType: "CC",
  documentNumber: "",
  fullName: "",
  email: "",
  phone: "",
  paymentMethod: "EFECTIVO",
  notes: "",
  items: [],
};

function NewInvoiceModal({
  products,
  onClose,
  onCreated,
}: {
  products: Product[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<CreateFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Total del formulario (en pesos)
  const formTotal = useMemo(
    () => form.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0),
    [form.items]
  );

  const addProduct = (product: Product) => {
    setForm((prev) => {
      // Si ya existe, incrementar cantidad
      const existing = prev.items.find((it) => it.productId === product.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((it) =>
            it.productId === product.id
              ? { ...it, quantity: it.quantity + 1 }
              : it
          ),
        };
      }
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            productId: product.id,
            description: product.name,
            quantity: 1,
            unitPrice: product.price,
          },
        ],
      };
    });
  };

  const addCustomItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: "", description: "", quantity: 1, unitPrice: 0 },
      ],
    }));
  };

  const updateItem = (index: number, field: keyof CreateItem, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, i) =>
        i === index ? { ...it, [field]: value } : it
      ),
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    // Validaciones
    if (!form.fullName.trim()) {
      setError("Ingrese el nombre del cliente.");
      return;
    }
    if (!form.documentNumber.trim()) {
      setError("Ingrese el número de documento del cliente.");
      return;
    }
    if (form.items.length === 0) {
      setError("Agregue al menos un producto a la factura.");
      return;
    }
    if (form.items.some((it) => !it.description.trim() || it.quantity < 1)) {
      setError("Todos los items deben tener descripción y cantidad válida.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/facturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerData: {
            documentType: form.documentType,
            documentNumber: form.documentNumber,
            fullName: form.fullName,
            email: form.email || undefined,
            phone: form.phone || undefined,
          },
          items: form.items.map((it) => ({
            productId: it.productId || undefined,
            description: it.description,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
          paymentMethod: form.paymentMethod,
          notes: form.notes || undefined,
          sendToDian: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al crear la factura");
      }

      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la factura");
    } finally {
      setSaving(false);
    }
  };

  const inputCn =
    "w-full bg-crema/[0.06] border border-crema/15 text-crema py-2.5 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors placeholder:text-crema/25";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-8 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-amarillo/20 my-4"
        style={{ background: "#1a0f08" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-crema/10 sticky top-0 z-10 rounded-t-2xl" style={{ background: "#1a0f08" }}>
          <div>
            <h3 className="font-playfair text-xl text-crema">Nueva Factura Electrónica</h3>
            <p className="text-[11px] text-crema/40 font-josefin">Resolución DIAN · No responsable de IVA</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-crema/[0.08] text-crema/60 hover:text-crema hover:bg-crema/15 transition-colors text-lg cursor-pointer border-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto dark-scrollbar">
          {/* Datos del cliente */}
          <section>
            <h4 className="text-[11px] uppercase tracking-wider text-amarillo font-josefin font-bold mb-3">
              Datos del Cliente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/40 mb-1">Tipo Doc.</label>
                <select
                  value={form.documentType}
                  onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                  className={inputCn}
                >
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k} className="bg-cafe-oscuro">
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/40 mb-1">N° Documento *</label>
                <input
                  value={form.documentNumber}
                  onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                  placeholder="Ej: 1037624589"
                  className={inputCn}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-wider text-crema/40 mb-1">Nombre / Razón Social *</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Ej: María González"
                  className={inputCn}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/40 mb-1">Correo</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="cliente@correo.com"
                  className={inputCn}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/40 mb-1">Teléfono</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="300 123 4567"
                  className={inputCn}
                />
              </div>
            </div>
          </section>

          {/* Items / productos */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[11px] uppercase tracking-wider text-amarillo font-josefin font-bold">
                Productos / Items
              </h4>
              <button
                onClick={addCustomItem}
                className="text-[11px] uppercase tracking-wider text-amarillo hover:text-amarillo-oscuro transition-colors cursor-pointer bg-transparent border-none font-josefin font-semibold"
              >
                + Item manual
              </button>
            </div>

            {/* Selector de productos */}
            {products.length > 0 && (
              <div className="mb-3 p-3 rounded-lg bg-crema/[0.03] border border-crema/[0.08]">
                <div className="text-[10px] uppercase tracking-wider text-crema/40 mb-2">
                  Click para agregar
                </div>
                <div className="flex flex-wrap gap-2">
                  {products
                    .filter((p) => p.active)
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addProduct(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-josefin bg-crema/[0.06] text-crema/70 border border-crema/10 hover:bg-amarillo/15 hover:text-amarillo hover:border-amarillo/30 transition-all cursor-pointer"
                      >
                        {p.name} · {formatPesos(p.price)}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Lista de items de la factura */}
            {form.items.length === 0 ? (
              <div className="text-center py-8 text-sm text-crema/30 font-josefin border border-dashed border-crema/10 rounded-lg">
                No hay items. Agregue productos arriba o un item manual.
              </div>
            ) : (
              <div className="space-y-2">
                {form.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-crema/[0.04] border border-crema/[0.08]">
                    <input
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Descripción"
                      className="flex-1 bg-crema/[0.06] border border-crema/15 text-crema py-2 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors min-w-0"
                    />
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                      className="w-16 bg-crema/[0.06] border border-crema/15 text-crema py-2 px-2 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors text-center"
                    />
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))}
                      className="w-28 bg-crema/[0.06] border border-crema/15 text-crema py-2 px-2 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors text-center"
                    />
                    <span className="w-28 text-right font-bebas text-amarillo text-lg shrink-0">
                      {formatPesos(item.unitPrice * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(i)}
                      className="w-8 h-8 shrink-0 rounded-lg bg-rojo/15 text-rojo hover:bg-rojo/25 transition-colors cursor-pointer border-none text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Pago y notas */}
          <section>
            <h4 className="text-[11px] uppercase tracking-wider text-amarillo font-josefin font-bold mb-3">
              Pago y Observaciones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/40 mb-1">Método de Pago</label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className={inputCn}
                >
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => (
                    <option key={k} value={k} className="bg-cafe-oscuro">
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/40 mb-1">Notas</label>
                <input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Observaciones internas (opcional)"
                  className={inputCn}
                />
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-rojo/15 border border-rojo/30 text-rojo text-sm font-josefin">
              {error}
            </div>
          )}
        </div>

        {/* Footer / total */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-crema/10 sticky bottom-0 rounded-b-2xl" style={{ background: "#1a0f08" }}>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-crema/40">Total Factura</div>
            <div className="font-bebas text-3xl text-amarillo leading-none">{formatPesos(formTotal)}</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border border-crema/15 text-crema/70 font-josefin hover:bg-crema/[0.06] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || form.items.length === 0}
              className="px-8 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-amarillo text-cafe-oscuro font-josefin hover:bg-amarillo-oscuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Creando..." : "Crear Factura"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

export default function AdminFacturas() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Filtros
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODAS");

  // Stats calculados
  const [stats, setStats] = useState({
    totalHoy: 0,
    totalMes: 0,
    facturasEmitidas: 0,
    pendientesPago: 0,
  });

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "100");
      if (statusFilter !== "TODAS") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/facturas?${params.toString()}`);
      const data = await res.json();
      const list: Invoice[] = data.data || data;
      setInvoices(list);
      computeStats(list);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
    loadProducts();
  }, [loadInvoices, loadProducts]);

  function computeStats(list: Invoice[]) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalHoy = 0;
    let totalMes = 0;
    let emitidas = 0;
    let pendientes = 0;

    for (const inv of list) {
      const date = new Date(inv.createdAt);
      // Solo contar facturas no anuladas
      if (inv.status === "ANULADA") continue;

      if (date >= startOfMonth) {
        totalMes += inv.total;
      }
      if (date >= startOfToday) {
        totalHoy += inv.total;
      }
      if (inv.status === "ACEPTADA" || inv.status === "ENVIADA" || inv.status === "BORRADOR") {
        emitidas++;
      }
      if (inv.paymentStatus === "PENDIENTE" || inv.paymentStatus === "PARCIAL" || inv.paymentStatus === "VENCIDA") {
        pendientes++;
      }
    }

    setStats({ totalHoy, totalMes, facturasEmitidas: emitidas, pendientesPago: pendientes });
  }

  const handleCreated = () => {
    loadInvoices();
  };

  // Estadísticas cards
  const statCards = [
    {
      label: "Facturado Hoy",
      value: formatCOP(stats.totalHoy),
      icon: "📅",
      accent: "text-amarillo",
    },
    {
      label: "Total del Mes",
      value: formatCOP(stats.totalMes),
      icon: "📈",
      accent: "text-verde-claro",
    },
    {
      label: "Facturas Emitidas",
      value: String(stats.facturasEmitidas),
      icon: "🧾",
      accent: "text-crema",
    },
    {
      label: "Pendientes de Pago",
      value: String(stats.pendientesPago),
      icon: "⏳",
      accent: "text-rojo",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-playfair text-3xl text-crema mb-1">Facturación Electrónica DIAN</h1>
          <p className="text-sm text-crema/50 font-josefin">
            Resolución DIAN 000165/2023 · No responsable de IVA
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-amarillo text-cafe-oscuro font-josefin hover:bg-amarillo-oscuro transition-colors"
        >
          + Nueva Factura
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-xl bg-crema/[0.04] border border-crema/[0.08]"
          >
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`font-bebas text-3xl leading-none mb-1 ${s.accent}`}>
              {s.value}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-crema/40 font-josefin">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-crema/30 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadInvoices()}
            placeholder="Buscar por número o cliente..."
            className="w-full bg-crema/[0.06] border border-crema/15 text-crema py-2.5 pl-9 pr-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors placeholder:text-crema/25"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["TODAS", "BORRADOR", "ENVIADA", "ACEPTADA", "RECHAZADA", "ANULADA"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-lg text-[11px] uppercase tracking-wider font-josefin font-semibold transition-colors cursor-pointer border ${
                statusFilter === st
                  ? "bg-amarillo/15 text-amarillo border-amarillo/40"
                  : "bg-crema/[0.04] text-crema/40 border-crema/10 hover:text-crema/70"
              }`}
            >
              {st === "TODAS" ? "Todas" : INVOICE_STATUS_LABELS[st]?.label || st}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-crema/10">
              {["Número", "Fecha", "Cliente", "Total", "Estado DIAN", "Estado Pago", "Acciones"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-normal font-josefin"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-crema/30 font-josefin">
                  Cargando facturas...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-crema/30 font-josefin">
                  No hay facturas registradas. Cree la primera con &ldquo;Nueva Factura&rdquo;.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-crema/[0.05] last:border-0 hover:bg-crema/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-bebas text-amarillo text-lg tracking-wide">{inv.fullNumber}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-crema/60 font-josefin whitespace-nowrap">
                    {formatDate(inv.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-medium text-crema truncate max-w-[200px]">{inv.customerName}</div>
                    <div className="text-xs text-crema/40 font-josefin">{inv.customerDocument}</div>
                  </td>
                  <td className="px-5 py-3.5 font-bebas text-amarillo text-lg whitespace-nowrap">
                    {formatCOP(inv.total)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1">
                      <PaymentBadge status={inv.paymentStatus} />
                      <span className="text-[10px] text-crema/30 font-josefin">
                        {PAYMENT_METHOD_LABELS[inv.paymentMethod] || inv.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/facturas/${inv.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs cursor-pointer border-none bg-crema/[0.08] text-crema hover:bg-amarillo/15 hover:text-amarillo transition-colors no-underline font-josefin font-semibold"
                    >
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal nueva factura */}
      {showForm && (
        <NewInvoiceModal
          products={products}
          onClose={() => setShowForm(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
