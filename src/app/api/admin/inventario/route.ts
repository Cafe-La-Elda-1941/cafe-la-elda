import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/inventario — Items de inventario + bodegas + productos (para selects)
export async function GET() {
  const [items, warehouses, products] = await Promise.all([
    prisma.inventoryItem.findMany({
      include: { product: true, warehouse: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.warehouse.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({ items, warehouses, products });
}

// POST /api/admin/inventario — Registra un movimiento de inventario (ENTRADA/SALIDA)
export async function POST(request: NextRequest) {
  const body = await request.json();

  const productId = String(body.productId);
  const warehouseId = String(body.warehouseId);
  const type = String(body.type || "ENTRADA"); // ENTRADA | SALIDA
  const qty = Number(body.quantity) || 0;
  const unitCost = Number(body.unitCost) || 0;
  const reason = String(body.reason || "");

  if (!productId || !warehouseId || qty <= 0) {
    return NextResponse.json(
      { error: "Producto, bodega y cantidad (>0) son obligatorios" },
      { status: 400 }
    );
  }

  // Transacción: actualizar item + registrar movimiento
  const result = await prisma.$transaction(async (tx) => {
    // Buscar item existente (unique productId+warehouseId)
    const item = await tx.inventoryItem.findUnique({
      where: {
        productId_warehouseId: { productId, warehouseId },
      },
    });

    const delta = type === "SALIDA" ? -qty : qty;
    const previousQty = item?.quantity ?? 0;
    const newQty = Math.max(0, previousQty + delta);
    const newTotalCost = newQty * unitCost;

    const updated = item
      ? await tx.inventoryItem.update({
          where: { id: item.id },
          data: {
            quantity: newQty,
            unitCost,
            totalCost: newTotalCost,
          },
          include: { product: true, warehouse: true },
        })
      : await tx.inventoryItem.create({
          data: {
            productId,
            warehouseId,
            quantity: newQty,
            unitCost,
            totalCost: newTotalCost,
            minStock: 5,
          },
          include: { product: true, warehouse: true },
        });

    await tx.stockMovement.create({
      data: {
        productId,
        warehouseId,
        type,
        quantity: delta,
        unitCost,
        balanceQuantity: newQty,
        balanceCost: newTotalCost,
        notes: reason || null,
      },
    });

    return updated;
  });

  return NextResponse.json(result, { status: 201 });
}
