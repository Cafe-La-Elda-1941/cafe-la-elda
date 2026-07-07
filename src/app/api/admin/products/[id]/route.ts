import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
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

  return NextResponse.json(product);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.product.update({
    where: { id },
    data: { active: false },
  });

  return NextResponse.json({ success: true });
}
