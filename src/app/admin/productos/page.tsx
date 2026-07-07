"use client";

import { useEffect, useState } from "react";

interface Category { id: string; name: string; slug: string; }
interface Product {
  id: string; name: string; slug: string; description: string;
  price: number; weight: string; image: string | null;
  tag: string | null; tagStyle: string | null;
  categoryId: string; category: Category;
  featured: boolean; active: boolean;
}

const empty = { name: "", slug: "", description: "", price: 0, weight: "", image: "", tag: "", tagStyle: "", categoryId: "", featured: false, active: true };

function formatPrice(p: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p);
}

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([p, c]) => { setProducts(p); setCategories(c); setLoading(false); });
  }, []);

  const reload = async () => {
    const p = await fetch("/api/admin/products").then((r) => r.json());
    setProducts(p);
  };

  const handleSave = async () => {
    const url = editing ? `/api/admin/products/${editing}` : "/api/admin/products";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }),
    });
    if (res.ok) { await reload(); setShowForm(false); setEditing(null); setForm(empty); }
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, slug: p.slug, description: p.description, price: p.price, weight: p.weight, image: p.image || "", tag: p.tag || "", tagStyle: p.tagStyle || "", categoryId: p.categoryId, featured: p.featured, active: p.active });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desactivar este producto?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await reload();
  };

  const inputCn = "w-full bg-crema/[0.06] border border-crema/15 text-crema py-2.5 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors placeholder:text-crema/25";

  if (loading) return <div className="flex items-center justify-center h-64 text-crema/30">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-crema mb-1">Productos</h1>
          <p className="text-sm text-crema/50">{products.length} productos registrados</p>
        </div>
        <button
          onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }}
          className={`px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none font-josefin transition-all ${showForm ? "bg-crema/10 text-crema" : "bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro"}`}
        >
          {showForm ? "✕ Cancelar" : "+ Nuevo Producto"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-xl bg-crema/[0.04] border border-crema/10">
          <h3 className="font-playfair text-lg text-crema mb-5">{editing ? "Editar Producto" : "Nuevo Producto"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5">Nombre *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Café Premium 250g" className={inputCn} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generado" className={inputCn} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5">Precio (COP) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputCn} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5">Peso</label>
              <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="250 gramos" className={inputCn} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5">Categoría *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputCn}>
                <option value="" className="bg-cafe-oscuro">Seleccionar...</option>
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-cafe-oscuro">{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5">Etiqueta</label>
              <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Ej: Nuevo" className={inputCn} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5">Descripción *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Descripción..." className={`${inputCn} resize-y`} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5">URL de Imagen</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/images/mi-producto.jpg" className={inputCn} />
            </div>
            <div className="flex items-end gap-6 pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-crema/60 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-amarillo" /> Destacado
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-crema/60 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-verde" /> Activo
              </label>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button onClick={handleSave} className="px-8 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-verde text-crema font-josefin hover:bg-verde-claro transition-colors">
              {editing ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-crema/10">
              {["Producto", "Categoría", "Precio", "Peso", "Estado", "Acciones"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-crema/[0.05] last:border-0 hover:bg-crema/[0.02] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 bg-crema/[0.06] overflow-hidden">
                      {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : "☕"}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-crema">{p.name}</div>
                      <div className="text-xs text-crema/40">{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-amarillo/10 text-amarillo">{p.category.name}</span>
                </td>
                <td className="px-5 py-3 font-bebas text-amarillo text-lg">{formatPrice(p.price)}</td>
                <td className="px-5 py-3 text-sm text-crema/50">{p.weight}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.active ? "bg-verde-claro/15 text-verde-claro" : "bg-rojo/15 text-rojo"}`}>
                    {p.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer border-none bg-crema/[0.08] text-crema hover:bg-crema/15 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer border-none bg-rojo/15 text-rojo hover:bg-rojo/25 transition-colors">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
