import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: body.description,
      price: Number(body.price),
      weight: body.weight,
      image: body.image || null,
      tag: body.tag || null,
      tagStyle: body.tagStyle || null,
      categoryId: body.categoryId,
      featured: body.featured ?? false,
      active: body.active ?? true,
    },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
