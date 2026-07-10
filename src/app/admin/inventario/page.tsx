"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCOP } from "@/lib/format";

interface Product {
  id: string;
  name: string;
  unitCost?: number;
}
interface Warehouse {
  id: string;
  name: string;
  code: string;
}
interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reserved: number;
  minStock: number;
  maxStock: number | null;
  unitCost: number;
  totalCost: number;
  product: Product;
  warehouse: Warehouse;
  updatedAt: string;
}

const emptyMovement = {
  productId: "",
  warehouseId: "",
  type: "ENTRADA",
  quantity: 1,
  unitCost: 0,
  reason: "",
};

export default function AdminInventario() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bodegaFilter, setBodegaFilter] = useState("TODAS");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyMovement);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    setLoading(true);
    const data = await fetch("/api/admin/inventario").then((r) => r.json());
    setItems(data.items || []);
    setWarehouses(data.warehouses || []);
    setProducts(data.products || []);
    setLoading(false);
  };

  // Stats
  const stats = useMemo(() => {
    const totalProductos = items.length;
    const valorInventario = items.reduce((s, i) => s + i.totalCost, 0);
    const bajoStock = items.filter((i) => i.quantity > 0 && i.quantity <= i.minStock).length;
    const bodegas = new Set(items.map((i) => i.warehouseId)).size;
    return { totalProductos, valorInventario, bajoStock, bodegas };
  }, [items]);

  // Filtered
  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchBodega = bodegaFilter === "TODAS" ? true : i.warehouseId === bodegaFilter;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        i.product.name.toLowerCase().includes(q) ||
        i.warehouse.name.toLowerCase().includes(q);
      return matchBodega && matchSearch;
    });
  }, [items, bodegaFilter, search]);

  const stockStatus = (item: InventoryItem) => {
    const avail = item.quantity - item.reserved;
    if (item.quantity <= 0) return { label: "Agotado", cn: "bg-rojo/20 text-rojo" };
    if (item.quantity <= item.minStock * 0.5)
      return { label: "Crítico", cn: "bg-orange-500/20 text-orange-400" };
    if (item.quantity <= item.minStock)
      return { label: "Bajo", cn: "bg-amarillo/20 text-amarillo" };
    return { label: "OK", cn: "bg-verde-claro/15 text-verde-claro" };
  };

  const handleSave = async () => {
    if (!form.productId || !form.warehouseId || form.quantity <= 0) {
      alert("Seleccione producto, bodega y una cantidad válida");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/inventario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        unitCost: Number(form.unitCost),
      }),
    });
    setSaving(false);
    if (res.ok) {
      await reload();
      setShowForm(false);
      setForm(emptyMovement);
    } else {
      const err = await res.text();
      alert("Error al registrar movimiento: " + err);
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
          <h1 className="font-playfair text-3xl text-crema mb-1">Inventario Multibodega</h1>
          <p className="text-sm text-crema/50">Control de stock por bodega</p>
        </div>
        <button
          onClick={() => {
            setForm(emptyMovement);
            setShowForm(true);
          }}
          className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro transition-colors font-josefin"
        >
          + Movimiento de Inventario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Productos" value={String(stats.totalProductos)} icon="📦" />
        <StatCard label="Valor Inventario" value={formatCOP(stats.valorInventario)} icon="💰" mono />
        <StatCard label="Productos Bajo Stock" value={String(stats.bajoStock)} icon="⚠️" danger={stats.bajoStock > 0} />
        <StatCard label="Bodegas" value={String(stats.bodegas)} icon="🏭" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <select
          value={bodegaFilter}
          onChange={(e) => setBodegaFilter(e.target.value)}
          className={`${inputCn} md:max-w-xs`}
        >
          <option value="TODAS" className="bg-cafe-oscuro">Todas las bodegas</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id} className="bg-cafe-oscuro">
              {w.name} ({w.code})
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto o bodega..."
          className={`${inputCn} md:max-w-sm`}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-crema/10">
              {["Producto", "Bodega", "Cantidad", "Reservado", "Disponible", "Costo Unit.", "Valor Total", "Estado"].map(
                (h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-normal ${
                      ["Cantidad", "Reservado", "Disponible", "Costo Unit.", "Valor Total"].includes(h)
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const st = stockStatus(item);
              const disponible = item.quantity - item.reserved;
              return (
                <tr
                  key={item.id}
                  className="border-b border-crema/[0.05] last:border-0 hover:bg-crema/[0.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium text-crema">{item.product.name}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-amarillo/10 text-amarillo">
                      {item.warehouse.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-crema font-bebas text-base">{item.quantity}</td>
                  <td className="px-5 py-3 text-right text-sm text-crema/50 font-bebas text-base">{item.reserved}</td>
                  <td className="px-5 py-3 text-right text-sm text-crema/80 font-bebas text-base">{disponible}</td>
                  <td className="px-5 py-3 text-right text-sm text-crema/70">{formatCOP(item.unitCost)}</td>
                  <td className="px-5 py-3 text-right font-bebas text-lg text-amarillo">
                    {formatCOP(item.totalCost)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider ${st.cn}`}>
                      {st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-crema/30 text-sm">
                  No hay ítems de inventario que coincidan.
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
              <h3 className="font-playfair text-xl text-crema">Movimiento de Inventario</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-crema/40 hover:text-crema cursor-pointer text-xl border-none bg-transparent"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCn}>Producto *</label>
                <select
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className={inputCn}
                >
                  <option value="" className="bg-cafe-oscuro">Seleccionar producto...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-cafe-oscuro">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCn}>Bodega *</label>
                <select
                  value={form.warehouseId}
                  onChange={(e) => setForm({ ...form, warehouseId: e.target.value })}
                  className={inputCn}
                >
                  <option value="" className="bg-cafe-oscuro">Seleccionar...</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id} className="bg-cafe-oscuro">
                      {w.name} ({w.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCn}>Tipo de Movimiento *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={inputCn}
                >
                  <option value="ENTRADA" className="bg-cafe-oscuro">Entrada</option>
                  <option value="SALIDA" className="bg-cafe-oscuro">Salida</option>
                </select>
              </div>
              <div>
                <label className={labelCn}>Cantidad *</label>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className={inputCn}
                />
              </div>
              <div>
                <label className={labelCn}>Costo Unitario (COP)</label>
                <input
                  type="number"
                  min={0}
                  value={form.unitCost}
                  onChange={(e) => setForm({ ...form, unitCost: Number(e.target.value) })}
                  placeholder="En pesos"
                  className={inputCn}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCn}>Motivo / Referencia</label>
                <input
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Ej: Compra, ajuste, merma..."
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
                {saving ? "Registrando..." : "Registrar Movimiento"}
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
      <div className={`${mono ? "font-bebas" : "font-playfair"} text-2xl ${danger ? "text-amarillo" : "text-crema"}`}>
        {value}
      </div>
    </div>
  );
}
