import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/configuracion — Configuración de empresa + cuentas contables
export async function GET() {
  const [settings, accounts] = await Promise.all([
    prisma.companySettings.findFirst(),
    prisma.account.findMany({
      where: { active: true },
      orderBy: { code: "asc" },
    }),
  ]);

  return NextResponse.json({ settings, accounts });
}

// PUT /api/admin/configuracion — Crea o actualiza la configuración de empresa
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const existing = await prisma.companySettings.findFirst();

  // Datos a guardar (mapeo snake_case del schema)
  const data = {
    legalName: body.legalName || existing?.legalName || "",
    documentType: body.documentType || existing?.documentType || "CC",
    documentNumber: body.documentNumber || existing?.documentNumber || "",
    address: body.address || existing?.address || "",
    city: body.city || existing?.city || "Dosquebradas",
    department: body.department || existing?.department || "Risaralda",
    phone: body.phone || existing?.phone || "",
    email: body.email || existing?.email || "",
    // DIAN
    taxRegime: body.taxRegime || existing?.taxRegime || "NO_RESPONSABLE",
    dianEnvironment: body.dianEnvironment || existing?.dianEnvironment || "PRODUCCION",
    resolutionNumber: body.resolutionNumber ?? existing?.resolutionNumber ?? null,
    resolutionDate: body.resolutionDate ? new Date(body.resolutionDate) : existing?.resolutionDate ?? null,
    resolutionPrefix: body.resolutionPrefix ?? existing?.resolutionPrefix ?? null,
    resolutionRangeStart: body.resolutionRangeStart !== undefined && body.resolutionRangeStart !== "" ? Number(body.resolutionRangeStart) : existing?.resolutionRangeStart ?? null,
    resolutionRangeEnd: body.resolutionRangeEnd !== undefined && body.resolutionRangeEnd !== "" ? Number(body.resolutionRangeEnd) : existing?.resolutionRangeEnd ?? null,
    // MATIAS API
    matiasApiBaseUrl: body.matiasApiBaseUrl || existing?.matiasApiBaseUrl || "https://matias-api.com/api/v1",
    matiasApiToken: body.matiasApiToken ?? existing?.matiasApiToken ?? null,
  };

  let saved;
  if (existing) {
    saved = await prisma.companySettings.update({
      where: { id: existing.id },
      data,
    });
  } else {
    saved = await prisma.companySettings.create({
      data: data as any,
    });
  }

  return NextResponse.json(saved);
}
