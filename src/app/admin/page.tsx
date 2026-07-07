"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalMessages: number;
    unreadMessages: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
    items: Array<{ quantity: number; product: { name: string } }>;
  }>;
  recentMessages: Array<{
    id: string;
    name: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

const STATUS_MAP: Record<string, { label: string; cn: string }> = {
  PENDING: { label: "Pendiente", cn: "bg-amarillo/20 text-amarillo" },
  CONFIRMED: { label: "Confirmado", cn: "bg-verde-claro/20 text-verde-claro" },
  SHIPPED: { label: "Enviado", cn: "bg-blue-400/20 text-blue-400" },
  DELIVERED: { label: "Entregado", cn: "bg-verde/20 text-verde" },
  CANCELLED: { label: "Cancelado", cn: "bg-rojo/20 text-rojo" },
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-crema/30 text-xl">Cargando...</div>;
  }

  if (!data) return null;

  const stats = [
    { label: "Productos Activos", value: String(data.stats.totalProducts), icon: "☕", accent: "text-verde" },
    { label: "Pedidos Totales", value: String(data.stats.totalOrders), icon: "📦", accent: "text-amarillo" },
    { label: "Pedidos Pendientes", value: String(data.stats.pendingOrders), icon: "⏳", accent: "text-amarillo-oscuro" },
    { label: "Mensajes Sin Leer", value: String(data.stats.unreadMessages), icon: "✉️", accent: "text-rojo" },
    { label: "Ingresos Totales", value: formatPrice(data.stats.totalRevenue), icon: "💰", accent: "text-verde-claro" },
    { label: "Mensajes Totales", value: String(data.stats.totalMessages), icon: "💬", accent: "text-cafe-claro" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-crema mb-1">Dashboard</h1>
        <p className="text-sm text-crema/50">Panel de administración · Café La Elda 1941</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-xl bg-crema/[0.04] border border-crema/[0.08]">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`font-bebas text-4xl leading-none mb-1 ${s.accent}`}>{s.value}</div>
            <div className="text-[11px] uppercase tracking-wider text-crema/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Orders */}
        <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-crema/[0.08]">
            <h3 className="font-playfair text-lg text-crema">Pedidos Recientes</h3>
            <Link href="/admin/pedidos" className="text-[11px] uppercase tracking-wider text-amarillo no-underline hover:text-amarillo-oscuro transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="p-4">
            {data.recentOrders.length === 0 ? (
              <p className="text-center py-10 text-sm text-crema/40">No hay pedidos aún</p>
            ) : (
              <div className="flex flex-col">
                {data.recentOrders.map((order) => {
                  const st = STATUS_MAP[order.status];
                  return (
                    <div key={order.id} className="flex items-center justify-between py-3 px-2 border-b border-crema/[0.05] last:border-0">
                      <div>
                        <div className="text-sm font-medium text-crema">{order.customerName}</div>
                        <div className="text-xs text-crema/40">{formatDate(order.createdAt)} · {order.items.length} productos</div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="font-bebas text-amarillo text-lg">{formatPrice(order.total)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${st?.cn}`}>
                          {st?.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-crema/[0.08]">
            <h3 className="font-playfair text-lg text-crema">Mensajes Recientes</h3>
            <Link href="/admin/mensajes" className="text-[11px] uppercase tracking-wider text-amarillo no-underline hover:text-amarillo-oscuro transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="p-4">
            {data.recentMessages.length === 0 ? (
              <p className="text-center py-10 text-sm text-crema/40">No hay mensajes aún</p>
            ) : (
              <div className="flex flex-col">
                {data.recentMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 py-3 px-2 border-b border-crema/[0.05] last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${msg.read ? "bg-crema/20" : "bg-rojo"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-crema truncate">{msg.name}</span>
                        <span className="text-[10px] text-crema/30 shrink-0">{formatDate(msg.createdAt)}</span>
                      </div>
                      <p className="text-xs text-crema/50 truncate mt-0.5">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
