import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, phone, email, product, message } = body;

  if (!name || !message) {
    return NextResponse.json(
      { error: "Nombre y mensaje son requeridos" },
      { status: 400 }
    );
  }

  const contact = await prisma.contactMessage.create({
    data: {
      name: String(name).slice(0, 200),
      phone: phone ? String(phone).slice(0, 50) : null,
      email: email ? String(email).slice(0, 200) : null,
      product: product ? String(product).slice(0, 200) : null,
      message: String(message).slice(0, 2000),
    },
  });

  return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
}
