import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(category && category !== "todos"
        ? { category: { slug: category } }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(products);
}
