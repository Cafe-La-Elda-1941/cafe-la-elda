"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCOP, formatDate, DOCUMENT_TYPE_LABELS } from "@/lib/format";

interface ThirdParty {
  id: string;
  type: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  active: boolean;
  balance: number;
  createdAt: string;
}

type Tab = "CLIENTE" | "PROVEEDOR" | "TODOS";

const emptyForm = {
  type: "CLIENTE",
  documentType: "CC",
  documentNumber: "",
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

export default function AdminTerceros() {
  const [terceros, setTerceros] = useState<ThirdParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("CLIENTE");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    setLoading(true);
    const data = await fetch("/api/admin/terceros").then((r) => r.json());
    setTerceros(data);
    setLoading(false);
  };

  // Stats
  const stats = useMemo(() => {
    const clientes = terceros.filter((t) => t.type === "CLIENTE" || t.type === "AMBOS").length;
    const proveedores = terceros.filter((t) => t.type === "PROVEEDOR" || t.type === "AMBOS").length;
    const porCobrar = terceros
      .filter((t) => t.type === "CLIENTE" || t.type === "AMBOS")
      .reduce((s, t) => s + (t.balance > 0 ? t.balance : 0), 0);
    const porPagar = terceros
      .filter((t) => t.type === "PROVEEDOR" || t.type === "AMBOS")
      .reduce((s, t) => s + (t.balance < 0 ? Math.abs(t.balance) : 0), 0);
    return { clientes, proveedores, porCobrar, porPagar };
  }, [terceros]);

  // Filtered list
  const filtered = useMemo(() => {
    return terceros.filter((t) => {
      const matchTab = tab === "TODOS" ? true : t.type === tab || t.type === "AMBOS";
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        t.fullName.toLowerCase().includes(q) ||
        t.documentNumber.toLowerCase().includes(q) ||
        (t.email || "").toLowerCase().includes(q) ||
        (t.phone || "").toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [terceros, tab, search]);

  const handleSave = async () => {
    if (!form.documentNumber || !form.fullName) {
      alert("Nombre y número de documento son obligatorios");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/terceros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      await reload();
      setShowForm(false);
      setForm(emptyForm);
    } else {
      const err = await res.text();
      alert("Error al crear tercero: " + err);
    }
  };

  const inputCn =
    "w-full bg-crema/[0.06] border border-crema/15 text-crema py-2.5 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors placeholder:text-crema/25";
  const labelCn = "block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5";

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-crema/30">Cargando...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-crema mb-1">Terceros</h1>
          <p className="text-sm text-crema/50">Clientes y Proveedores</p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro transition-colors font-josefin"
        >
          + Nuevo Tercero
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Clientes" value={String(stats.clientes)} icon="👥" />
        <StatCard label="Total Proveedores" value={String(stats.proveedores)} icon="🚚" />
        <StatCard label="Saldo por Cobrar" value={formatCOP(stats.porCobrar)} icon="📈" mono />
        <StatCard label="Saldo por Pagar" value={formatCOP(stats.porPagar)} icon="📉" mono danger />
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex gap-1 p-1 rounded-lg bg-cafe-oscuro/50 border border-amarillo/10">
          {(["CLIENTE", "PROVEEDOR", "TODOS"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md cursor-pointer text-sm font-josefin transition-all border-none ${
                tab === t
                  ? "bg-amarillo text-cafe-oscuro font-semibold"
                  : "text-crema/50 hover:text-crema"
              }`}
            >
              {t === "CLIENTE" ? "Clientes" : t === "PROVEEDOR" ? "Proveedores" : "Todos"}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, documento, teléfono..."
          className={`${inputCn} md:max-w-sm`}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-crema/10">
              {["Nombre", "Documento", "Tipo", "Teléfono", "Email", "Saldo", "Estado"].map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-normal ${
                    h === "Saldo" ? "text-right" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="border-b border-crema/[0.05] last:border-0 hover:bg-crema/[0.02] transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="text-sm font-medium text-crema">{t.fullName}</div>
                  {t.city && <div className="text-xs text-crema/40">{t.city}</div>}
                </td>
                <td className="px-5 py-3 text-sm text-crema/70">
                  <div>{DOCUMENT_TYPE_LABELS[t.documentType] || t.documentType}</div>
                  <div className="font-bebas text-crema tracking-wider">{t.documentNumber}</div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      t.type === "CLIENTE"
                        ? "bg-verde-claro/15 text-verde-claro"
                        : t.type === "PROVEEDOR"
                        ? "bg-blue-400/15 text-blue-400"
                        : "bg-amarillo/15 text-amarillo"
                    }`}
                  >
                    {t.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-crema/60">{t.phone || "—"}</td>
                <td className="px-5 py-3 text-sm text-crema/60">{t.email || "—"}</td>
                <td className="px-5 py-3 text-right font-bebas text-lg text-amarillo">
                  {formatCOP(t.balance)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      t.active ? "bg-verde-claro/15 text-verde-claro" : "bg-rojo/15 text-rojo"
                    }`}
                  >
                    {t.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-crema/30 text-sm">
                  No hay terceros que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-2xl bg-cafe-oscuro border border-amarillo/20 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-crema/10">
              <h3 className="font-playfair text-xl text-crema">Nuevo Tercero</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-crema/40 hover:text-crema cursor-pointer text-xl border-none bg-transparent"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCn}>Tipo *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={inputCn}
                >
                  <option value="CLIENTE" className="bg-cafe-oscuro">Cliente</option>
                  <option value="PROVEEDOR" className="bg-cafe-oscuro">Proveedor</option>
                  <option value="AMBOS" className="bg-cafe-oscuro">Ambos</option>
                </select>
              </div>
              <div>
                <label className={labelCn}>Tipo de Documento *</label>
                <select
                  value={form.documentType}
                  onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                  className={inputCn}
                >
                  <option value="CC" className="bg-cafe-oscuro">Cédula de Ciudadanía</option>
                  <option value="NIT" className="bg-cafe-oscuro">NIT</option>
                  <option value="CE" className="bg-cafe-oscuro">Cédula de Extranjería</option>
                  <option value="PA" className="bg-cafe-oscuro">Pasaporte</option>
                </select>
              </div>
              <div>
                <label className={labelCn}>Número de Documento *</label>
                <input
                  value={form.documentNumber}
                  onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                  placeholder="Ej: 1037621456"
                  className={inputCn}
                />
              </div>
              <div>
                <label className={labelCn}>Nombre / Razón Social *</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Nombre completo"
                  className={inputCn}
                />
              </div>
              <div>
                <label className={labelCn}>Teléfono</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Ej: 310 456 7890"
                  className={inputCn}
                />
              </div>
              <div>
                <label className={labelCn}>Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className={inputCn}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCn}>Dirección</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Dirección"
                  className={inputCn}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-crema/10">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg cursor-pointer text-sm font-josefin text-crema/60 bg-crema/[0.06] hover:bg-crema/15 transition-colors border-none"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase bg-verde text-crema hover:bg-verde-claro transition-colors border-none font-josefin disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Crear Tercero"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  mono,
  danger,
}: {
  label: string;
  value: string;
  icon: string;
  mono?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="bg-cafe-oscuro/50 border border-amarillo/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-crema/40 font-josefin">{label}</span>
        <span className="text-lg opacity-60">{icon}</span>
      </div>
      <div
        className={`${mono ? "font-bebas" : "font-playfair"} text-2xl ${
          danger ? "text-rojo" : "text-crema"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
