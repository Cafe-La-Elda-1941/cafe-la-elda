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
  contabilidad: {
    totalFacturadoMes: number;
    totalFacturadoHoy: number;
    facturasMes: number;
    facturasPendientesPago: number;
    totalClientes: number;
    totalProveedores: number;
    valorInventario: number;
    productosBajoStock: number;
    totalEfectivoBancos: number;
    totalEmpleados: number;
    saldoPorCobrar: number;
    asientosContables: number;
    cuentasPUC: number;
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

function formatCOP(cents: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(cents / 100);
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-crema mb-1">Dashboard</h1>
        <p className="text-sm text-crema/50">Sistema Contable · Café La Elda 1941 · NIT 24694411-9</p>
      </div>

      {/* === MÉTRICAS CONTABLES PRINCIPALES === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Facturado Hoy"
          value={formatCOP(data.contabilidad.totalFacturadoHoy)}
          icon="🧾"
          accent="text-amarillo"
          sub={`${data.contabilidad.facturasMes} facturas este mes`}
          href="/admin/facturas"
        />
        <MetricCard
          label="Facturado del Mes"
          value={formatCOP(data.contabilidad.totalFacturadoMes)}
          icon="📈"
          accent="text-verde-claro"
          sub={`${data.contabilidad.facturasPendientesPago} pendientes de pago`}
          href="/admin/facturas"
        />
        <MetricCard
          label="Efectivo y Bancos"
          value={formatCOP(data.contabilidad.totalEfectivoBancos)}
          icon="🏦"
          accent="text-blue-400"
          sub="Saldo en cuentas"
          href="/admin/bancos"
        />
        <MetricCard
          label="Valor Inventario"
          value={formatCOP(data.contabilidad.valorInventario)}
          icon="📦"
          accent="text-cafe-claro"
          sub={`${data.contabilidad.productosBajoStock} productos bajo stock`}
          href="/admin/inventario"
        />
      </div>

      {/* === SEGUNDA FILA: TIENDA === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <MiniCard label="Productos" value={String(data.stats.totalProducts)} icon="☕" href="/admin/productos" />
        <MiniCard label="Pedidos" value={String(data.stats.totalOrders)} icon="📦" href="/admin/pedidos" highlight={data.stats.pendingOrders > 0 ? `${data.stats.pendingOrders} pendientes` : undefined} />
        <MiniCard label="Clientes" value={String(data.contabilidad.totalClientes)} icon="👥" href="/admin/terceros" />
        <MiniCard label="Empleados" value={String(data.contabilidad.totalEmpleados)} icon="💰" href="/admin/nomina" />
      </div>

      {/* === ACCESOS RÁPIDOS === */}
      <div className="mb-8">
        <h3 className="font-playfair text-sm text-crema/60 mb-3 uppercase tracking-wider">Accesos Rápidos</h3>
        <div className="flex flex-wrap gap-3">
          <QuickLink href="/admin/facturas" icon="🧾" label="Nueva Factura" />
          <QuickLink href="/admin/asientos" icon="📝" label="Asiento Contable" />
          <QuickLink href="/admin/inventario" icon="📦" label="Movimiento Inventario" />
          <QuickLink href="/admin/terceros" icon="👥" label="Nuevo Tercero" />
          <QuickLink href="/admin/reportes" icon="📊" label="Estados Financieros" />
          <QuickLink href="/admin/nomina" icon="💰" label="Liquidar Nómina" />
          <QuickLink href="/admin/configuracion" icon="⚙️" label="Configuración DIAN" />
        </div>
      </div>

      {/* === RESUMEN CONTABLE === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl bg-cafe-oscuro/50 border border-amarillo/10 p-5">
          <h4 className="font-playfair text-sm text-amarillo mb-3 uppercase tracking-wider">Resumen Contable</h4>
          <div className="space-y-2 text-sm">
            <Row label="Saldo por Cobrar" value={formatCOP(data.contabilidad.saldoPorCobrar)} />
            <Row label="Cuentas PUC Activas" value={String(data.contabilidad.cuentasPUC)} />
            <Row label="Asientos Contables" value={String(data.contabilidad.asientosContables)} />
            <Row label="Proveedores" value={String(data.contabilidad.totalProveedores)} />
          </div>
        </div>

        <div className="rounded-xl bg-cafe-oscuro/50 border border-amarillo/10 p-5">
          <h4 className="font-playfair text-sm text-amarillo mb-3 uppercase tracking-wider">Estado del Sistema</h4>
          <div className="space-y-2 text-sm">
            <StatusRow label="Facturación DIAN" status="Configurando" color="text-amarillo" />
            <StatusRow label="MATIAS API" status="Sin configurar" color="text-rojo" />
            <StatusRow label="Régimen Tributario" status="No responsable IVA" color="text-crema/50" />
            <StatusRow label="Base de Datos" status="Operativa" color="text-verde" />
          </div>
        </div>

        <div className="rounded-xl bg-cafe-oscuro/50 border border-amarillo/10 p-5">
          <h4 className="font-playfair text-sm text-amarillo mb-3 uppercase tracking-wider">Mensajes</h4>
          <div className="space-y-2 text-sm">
            <Row label="Sin Leer" value={String(data.stats.unreadMessages)} highlight={data.stats.unreadMessages > 0} />
            <Row label="Total Mensajes" value={String(data.stats.totalMessages)} />
            <Row label="Ingresos Pedidos" value={formatCOP(data.stats.totalRevenue)} />
          </div>
        </div>
      </div>

      {/* === ACTIVIDAD RECIENTE === */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pedidos */}
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
                        <span className="font-bebas text-amarillo text-lg">{formatCOP(order.total)}</span>
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

        {/* Mensajes */}
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

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

function MetricCard({ label, value, icon, accent, sub, href }: { label: string; value: string; icon: string; accent: string; sub?: string; href?: string }) {
  const content = (
    <div className="p-5 rounded-xl bg-cafe-oscuro/50 border border-amarillo/10 hover:border-amarillo/30 transition-all h-full">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`font-bebas text-3xl leading-none mb-1 ${accent}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-crema/40 mb-1">{label}</div>
      {sub && <div className="text-[10px] text-crema/30">{sub}</div>}
    </div>
  );
  return href ? <Link href={href} className="no-underline">{content}</Link> : content;
}

function MiniCard({ label, value, icon, href, highlight }: { label: string; value: string; icon: string; href: string; highlight?: string }) {
  return (
    <Link href={href} className="no-underline">
      <div className="p-4 rounded-xl bg-crema/[0.04] border border-crema/[0.08] hover:bg-crema/[0.06] transition-all">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <div className="font-bebas text-2xl text-crema leading-none">{value}</div>
            <div className="text-[10px] uppercase tracking-wider text-crema/40">{label}</div>
            {highlight && <div className="text-[10px] text-amarillo">{highlight}</div>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-crema/[0.04] border border-crema/[0.08] hover:bg-amarillo/10 hover:border-amarillo/30 transition-all no-uncate">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-crema/70 hover:text-amarillo font-josefin whitespace-nowrap">{label}</span>
    </Link>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-crema/40 text-xs">{label}</span>
      <span className={`font-josefin text-sm ${highlight ? "text-amarillo font-bold" : "text-crema"}`}>{value}</span>
    </div>
  );
}

function StatusRow({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-crema/40 text-xs">{label}</span>
      <span className={`font-josefin text-xs ${color}`}>{status}</span>
    </div>
  );
}
