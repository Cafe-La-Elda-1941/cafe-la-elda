import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [
    totalProducts,
    totalOrders,
    totalMessages,
    unreadMessages,
    pendingOrders,
    recentOrders,
    recentMessages,
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
  ]);

  const ordersWithTotal = await prisma.order.aggregate({
    _sum: { total: true },
  });

  return NextResponse.json({
    stats: {
      totalProducts,
      totalOrders,
      totalMessages,
      unreadMessages,
      pendingOrders,
      totalRevenue: ordersWithTotal._sum.total ?? 0,
    },
    recentOrders,
    recentMessages,
  });
}
