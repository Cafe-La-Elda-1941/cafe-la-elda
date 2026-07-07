"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string; customerName: string; customerPhone: string;
  customerEmail: string | null; city: string | null; notes: string | null;
  total: number; status: string; createdAt: string;
  items: Array<{ id: string; quantity: number; price: number; product: { name: string } }>;
}

function formatPrice(p: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const statuses = [
  { value: "PENDING", label: "Pendiente", cn: "bg-amarillo/20 text-amarillo" },
  { value: "CONFIRMED", label: "Confirmado", cn: "bg-verde-claro/20 text-verde-claro" },
  { value: "SHIPPED", label: "Enviado", cn: "bg-blue-400/20 text-blue-400" },
  { value: "DELIVERED", label: "Entregado", cn: "bg-verde/20 text-verde" },
  { value: "CANCELLED", label: "Cancelado", cn: "bg-rojo/20 text-rojo" },
];

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders").then((r) => r.json()).then(setOrders).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) { const u = await res.json(); setOrders((prev) => prev.map((o) => (o.id === id ? u : o))); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-crema/30">Cargando...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-crema mb-1">Pedidos</h1>
        <p className="text-sm text-crema/50">{orders.length} pedidos registrados</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 rounded-xl bg-crema/[0.04] border border-crema/[0.08]">
          <div className="text-5xl mb-4">📦</div>
          <p className="font-cormorant italic text-lg text-crema/50">No hay pedidos aún</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const st = statuses.find((s) => s.value === order.status);
            const open = expanded === order.id;
            return (
              <div key={order.id} className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-hidden">
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-crema/[0.02] transition-colors"
                  onClick={() => setExpanded(open ? null : order.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-crema">{order.customerName}</div>
                    <span className="text-xs text-crema/40">· {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider ${st?.cn}`}>{st?.label}</span>
                    <span className="font-bebas text-amarillo text-xl">{formatPrice(order.total)}</span>
                    <span className="text-crema/30 text-xs">{open ? "▲" : "▼"}</span>
                  </div>
                </div>
                {open && (
                  <div className="px-6 py-5 border-t border-crema/[0.08]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-[11px] uppercase tracking-wider text-crema/40 mb-3">Productos</h4>
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between py-2 border-b border-crema/[0.05] last:border-0">
                            <span className="text-sm text-crema">{item.product.name} × {item.quantity}</span>
                            <span className="text-sm text-amarillo">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-[11px] uppercase tracking-wider text-crema/40 mb-3">Info & Estado</h4>
                        <p className="text-sm text-crema/60 mb-1">Tel: {order.customerPhone}</p>
                        {order.customerEmail && <p className="text-sm text-crema/60 mb-1">Email: {order.customerEmail}</p>}
                        {order.city && <p className="text-sm text-crema/60 mb-1">Ciudad: {order.city}</p>}
                        {order.notes && <p className="text-sm text-crema/60 mb-3">Notas: {order.notes}</p>}

                        <div className="flex flex-wrap gap-2 mt-4">
                          {statuses.map((s) => (
                            <button
                              key={s.value}
                              onClick={() => updateStatus(order.id, s.value)}
                              disabled={order.status === s.value}
                              className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer border-none transition-all disabled:opacity-30 disabled:cursor-default ${s.cn}`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>

                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${order.customerName}, respecto a su pedido en Café La Elda...`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg no-underline text-sm font-medium bg-[#25D366] text-white"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
