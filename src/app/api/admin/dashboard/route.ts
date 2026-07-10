import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Fechas para rangos
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalProducts,
    totalOrders,
    totalMessages,
    unreadMessages,
    pendingOrders,
    recentOrders,
    recentMessages,
    // Contabilidad
    invoicesThisMonth,
    invoicesToday,
    totalClients,
    totalSuppliers,
    inventoryItems,
    bankAccounts,
    totalEmployees,
    journalEntryCount,
    accountCount,
  ] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { include: { product: true } } },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Facturación del mes
    prisma.invoice.findMany({
      where: { createdAt: { gte: startOfMonth }, status: { in: ["ACEPTADA", "ENVIADA", "BORRADOR"] } },
      select: { total: true, iva: true, status: true, paymentStatus: true },
    }),
    // Facturación de hoy
    prisma.invoice.findMany({
      where: { createdAt: { gte: startOfToday }, status: { in: ["ACEPTADA", "ENVIADA", "BORRADOR"] } },
      select: { total: true },
    }),
    prisma.thirdParty.count({ where: { type: "CLIENTE", active: true } }),
    prisma.thirdParty.count({ where: { type: "PROVEEDOR", active: true } }),
    prisma.inventoryItem.findMany({
      include: { product: { select: { name: true } } },
    }),
    prisma.bankAccount.findMany(),
    prisma.employee.count({ where: { active: true } }),
    prisma.journalEntry.count(),
    prisma.account.count({ where: { active: true } }),
  ]);

  // Calcular totales de pedidos
  const ordersWithTotal = await prisma.order.aggregate({
    _sum: { total: true },
  });

  // Calcular totales de facturación
  const totalFacturadoMes = invoicesThisMonth.reduce((sum, inv) => sum + inv.total, 0);
  const totalFacturadoHoy = invoicesToday.reduce((sum, inv) => sum + inv.total, 0);
  const facturasPendientesPago = invoicesThisMonth.filter((i) => i.paymentStatus === "PENDIENTE").length;

  // Calcular valor de inventario
  const valorInventario = inventoryItems.reduce((sum, item) => sum + (item.totalCost || 0), 0);
  const productosBajoStock = inventoryItems.filter((item) => item.quantity <= item.minStock).length;

  // Calcular saldo en bancos
  const totalEfectivoBancos = bankAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  // Saldo por cobrar (clientes)
  const clients = await prisma.thirdParty.findMany({
    where: { type: "CLIENTE" },
    select: { balance: true },
  });
  const saldoPorCobrar = clients.reduce((sum, c) => sum + Math.max(0, c.balance), 0);

  return NextResponse.json({
    stats: {
      totalProducts,
      totalOrders,
      totalMessages,
      unreadMessages,
      pendingOrders,
      totalRevenue: ordersWithTotal._sum.total ?? 0,
    },
    // Métricas contables
    contabilidad: {
      totalFacturadoMes,
      totalFacturadoHoy,
      facturasMes: invoicesThisMonth.length,
      facturasPendientesPago,
      totalClientes: totalClients,
      totalProveedores: totalSuppliers,
      valorInventario,
      productosBajoStock,
      totalEfectivoBancos,
      totalEmpleados: totalEmployees,
      saldoPorCobrar,
      asientosContables: journalEntryCount,
      cuentasPUC: accountCount,
    },
    recentOrders,
    recentMessages,
  });
}
