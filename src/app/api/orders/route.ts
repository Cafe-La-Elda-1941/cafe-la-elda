import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { customerName, customerPhone, customerEmail, city, notes, items } = body;

  if (!customerName || !customerPhone || !items || items.length === 0) {
    return NextResponse.json(
      { error: "Nombre, teléfono y al menos un producto son requeridos" },
      { status: 400 }
    );
  }

  const total = (items as OrderItemInput[]).reduce(
    (sum: number, item: OrderItemInput) => sum + item.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      customerName: String(customerName).slice(0, 200),
      customerPhone: String(customerPhone).slice(0, 50),
      customerEmail: customerEmail ? String(customerEmail).slice(0, 200) : null,
      city: city ? String(city).slice(0, 100) : null,
      notes: notes ? String(notes).slice(0, 2000) : null,
      total,
      items: {
        create: (items as OrderItemInput[]).map((item: OrderItemInput) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json({ success: true, order }, { status: 201 });
}
