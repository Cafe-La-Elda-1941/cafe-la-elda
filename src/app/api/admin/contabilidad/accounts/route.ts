import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/contabilidad/accounts
 * Lista todas las cuentas del PUC con jerarquía (padre/hijos).
 * Query params opcionales:
 *   - type: ACTIVO | PASIVO | PATRIMONIO | INGRESO | GASTO | COSTO
 *   - hierarchy: "true" (default) devuelve árbol; "false" devuelve lista plana
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;
  const wantsHierarchy = (searchParams.get("hierarchy") ?? "true") !== "false";
  const onlyLeaf = searchParams.get("leaf") === "true";

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (onlyLeaf) where.code = { gte: "000000" }; // Se filtra por longitud abajo

  const accounts = await prisma.account.findMany({
    where,
    orderBy: [{ code: "asc" }],
    include: {
      parent: { select: { code: true, name: true } },
    },
  });

  // Acumular saldos de hijos hacia los padres (cuentas no hoja)
  // Se construye un mapa por id para acceso rápido.
  const byId = new Map(accounts.map((a) => [a.id, { ...a, children: [] }]));

  // Calcular saldo de cada cuenta como la suma de sus hojas descendientes
  // usando la jerarquía parentId. Estrategia recursiva (top-down por longitud de código).
  // Ordenamos por longitud de código descendente para propagar de hojas a raíces.
  const sortedByLenDesc = [...byId.values()].sort(
    (a, b) => b.code.length - a.code.length
  );

  // Mapa auxiliar: code -> saldo agregado (sumando hojas)
  const aggregated = new Map<string, number>();

  for (const acc of sortedByLenDesc) {
    const isLeaf = acc.code.length >= 6;
    if (isLeaf) {
      aggregated.set(acc.code, acc.balance);
    } else {
      // Sumar el saldo de todas las cuentas cuyo código empieza con este código
      let sum = 0;
      for (const other of byId.values()) {
        if (other.id === acc.id) continue;
        if (
          other.code.startsWith(acc.code) &&
          other.code.length > acc.code.length
        ) {
          sum += other.balance;
        }
      }
      aggregated.set(acc.code, sum);
    }
  }

  // Vista plana con saldo agregado
  const flat = [...byId.values()].map((a) => ({
    id: a.id,
    code: a.code,
    name: a.name,
    type: a.type,
    class: a.class,
    group: a.group,
    subaccount: a.subaccount,
    nature: a.nature,
    niifMapping: a.niifMapping,
    parentId: a.parentId,
    parent: a.parent,
    isCash: a.isCash,
    isPaymentMethod: a.isPaymentMethod,
    active: a.active,
    balance: a.balance,
    aggregatedBalance: aggregated.get(a.code) ?? 0,
    isLeaf: a.code.length >= 6,
    level: a.code.length >= 6 ? 3 : a.code.length === 4 ? 2 : a.code.length === 2 ? 1 : 0,
  }));

  if (!wantsHierarchy) {
    return NextResponse.json({
      total: flat.length,
      accounts: flat,
    });
  }

  // Construir árbol jerárquico usando parentId
  const rootNodes: any[] = [];
  const nodeMap = new Map<string, any>();

  flat.forEach((a) => {
    nodeMap.set(a.id, { ...a, children: [] });
  });

  flat.forEach((a) => {
    const node = nodeMap.get(a.id)!;
    if (a.parentId && nodeMap.has(a.parentId)) {
      nodeMap.get(a.parentId)!.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  // Resumen por tipo para encabezados/estadísticas
  const summary: Record<string, { count: number; balance: number }> = {};
  for (const a of flat) {
    if (!summary[a.type]) summary[a.type] = { count: 0, balance: 0 };
    summary[a.type].count += 1;
    // Para el resumen usamos el saldo agregado de cuentas padre principales
  }
  // Sumar balances agregados solo de cuentas de nivel 1 (clase) para el resumen
  for (const a of flat) {
    if (a.level === 0) {
      if (!summary[a.type]) summary[a.type] = { count: 0, balance: 0 };
      summary[a.type].balance += a.aggregatedBalance;
    }
  }

  return NextResponse.json({
    total: flat.length,
    summary,
    tree: rootNodes,
    flat,
  });
}
