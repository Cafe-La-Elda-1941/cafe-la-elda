import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/terceros — Lista todos los terceros (clientes y proveedores)
export async function GET() {
  const terceros = await prisma.thirdParty.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(terceros);
}

// POST /api/admin/terceros — Crea un nuevo tercero
export async function POST(request: NextRequest) {
  const body = await request.json();

  const tercero = await prisma.thirdParty.create({
    data: {
      type: body.type || "CLIENTE", // CLIENTE | PROVEEDOR | EMPLEADO | AMBOS
      documentType: body.documentType || "CC", // CC | NIT | CE | PA
      documentNumber: String(body.documentNumber || ""),
      fullName: body.fullName || "CLIENTE EVENTUAL",
      firstName: body.firstName || null,
      lastName: body.lastName || null,
      businessName: body.businessName || null,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      city: body.city || null,
      taxRegime: body.taxRegime || null,
      active: body.active ?? true,
      balance: Number(body.balance ?? 0),
    },
  });

  return NextResponse.json(tercero, { status: 201 });
}
