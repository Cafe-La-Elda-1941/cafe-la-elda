import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/nomina — Empleados + última liquidación
export async function GET() {
  const [employees, lastPayroll] = await Promise.all([
    prisma.employee.findMany({
      include: { thirdParty: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.payroll.findFirst({
      orderBy: { payDate: "desc" },
    }),
  ]);

  return NextResponse.json({ employees, lastPayroll });
}

// POST /api/admin/nomina — Crea un empleado (genera el tercero asociado)
// Soporta action=LIQUIDAR para generar la nómina del periodo
export async function POST(request: NextRequest) {
  const body = await request.json();

  // ── Acción: Liquidar nómina del periodo ──
  if (body.action === "LIQUIDAR") {
    return liquidarNomina();
  }

  // ── Acción: Crear nuevo empleado ──
  const documentType = String(body.documentType || "CC");
  const documentNumber = String(body.documentNumber || "");

  if (!body.fullName || !documentNumber || !body.position) {
    return NextResponse.json(
      { error: "Nombre, documento y cargo son obligatorios" },
      { status: 400 }
    );
  }

  const salary = Math.round(Number(body.baseSalary) * 100); // pesos -> centavos

  const result = await prisma.$transaction(async (tx) => {
    // 1. Crear el tercero asociado (tipo EMPLEADO)
    const thirdParty = await tx.thirdParty.create({
      data: {
        type: "EMPLEADO",
        documentType,
        documentNumber,
        fullName: String(body.fullName),
        email: body.email || null,
        phone: body.phone || null,
      },
    });

    // 2. Crear el empleado vinculado
    const employee = await tx.employee.create({
      data: {
        thirdPartyId: thirdParty.id,
        position: String(body.position),
        salary,
        payFrequency: body.payFrequency || "QUINCENAL",
        eps: String(body.eps || ""),
        pensionFund: String(body.afp || ""), // AFP = fondo de pensiones
        arl: String(body.arl || ""),
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        active: true,
      },
      include: { thirdParty: true },
    });

    return employee;
  });

  return NextResponse.json(result, { status: 201 });
}

/**
 * Genera los registros de nómina para todos los empleados activos del mes actual.
 * Calcula devengados, deducciones y aportes patronales según la legislación colombiana.
 */
async function liquidarNomina() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const period = `${year}-${String(month + 1).padStart(2, "0")}-MENSUAL`;

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const payDate = new Date(year, month + 1, 0);

  const employees = await prisma.employee.findMany({
    where: { active: true },
  });

  if (employees.length === 0) {
    return NextResponse.json({ error: "No hay empleados activos para liquidar" }, { status: 400 });
  }

  // Constantes legales (Colombia)
  const SALARIO_MINIMO = 1423500 * 100; // SMLMV 2024 en centavos
  const AUX_TRANSPORTE = 200000 * 100;

  const created = await prisma.$transaction(
    employees.map((emp) => {
      const baseSalary = emp.salary;
      const recibeAux = baseSalary <= SALARIO_MINIMO * 2;
      const auxTransport = recibeAux ? AUX_TRANSPORTE : 0;

      const totalEarned = baseSalary + auxTransport;
      const baseDeduction = recibeAux ? baseSalary : totalEarned;

      const healthDeduction = Math.round(baseDeduction * 0.04); // 4% salud empleado
      const pensionDeduction = Math.round(baseDeduction * 0.04); // 4% pensión empleado
      const totalDeductions = healthDeduction + pensionDeduction;
      const netPay = totalEarned - totalDeductions;

      // Aportes patronales
      const employerHealth = Math.round(baseSalary * 0.085); // 8.5%
      const employerPension = Math.round(baseSalary * 0.12); // 12%
      const arl = Math.round(baseSalary * 0.00522); // ARL nivel I
      const caja = Math.round(baseSalary * 0.04); // 4%
      const icbf = Math.round(baseSalary * 0.03); // 3%
      const sena = Math.round(baseSalary * 0.02); // 2%
      const totalEmployer =
        employerHealth + employerPension + arl + caja + icbf + sena;

      return prisma.payroll.create({
        data: {
          employeeId: emp.id,
          period,
          startDate,
          endDate,
          payDate,
          baseSalary,
          auxiliaryTransport: auxTransport,
          totalEarned,
          healthDeduction,
          pensionDeduction,
          totalDeductions,
          netPay,
          employerHealth,
          employerPension,
          arl,
          caja,
          icbf,
          sena,
          totalEmployer,
          status: "BORRADOR",
        },
      });
    })
  );

  return NextResponse.json(
    { liquidados: created.length, period, totalNetPay: created.reduce((s, p) => s + p.netPay, 0) },
    { status: 201 }
  );
}
