import { prisma } from "@/lib/prisma";

/**
 * Precios oficiales de los combos (código estático).
 * Clave = id que usa el carrito (combo-${numero}).
 * Estos valores son la única fuente de verdad en el servidor.
 */
export const COMBO_PRICES: Record<string, number> = {
  "combo-01": 63000, // Tradición Cafetera
  "combo-02": 61000, // Pausa Cafetera La Elda
  "combo-03": 66000, // Regalo Delicioso
  "combo-04": 94000, // Experiencia La Elda
  "combo-05": 52000, // Placer Cafetero
  "combo-06": 35000, // Tesoro Cafetero
  "combo-07": 55000, // Explosión de Sabor
};

/**
 * Precios oficiales de los paquetes corporativos (código estático).
 * Clave = id que usa el carrito (corp-${p.id}).
 */
export const CORP_PRICES: Record<string, number> = {
  "corp-esencial": 23000,
  "corp-clasico": 30000,
  "corp-premium": 37000,
  "corp-selecto": 75000,
  "corp-exclusivo": 105000,
};

export interface IncomingLine {
  id: string;
  name?: string;
  price?: number; // precio que envía el cliente (NO confiable)
  weight?: string;
  quantity: number;
}

export interface VerifiedLine extends IncomingLine {
  unitPrice: number; // precio oficial verificado en servidor
  lineTotal: number;
}

/**
 * Valida un carrito entrante contra las fuentes de verdad del servidor:
 *  - Productos de base de datos (por id)
 *  - Combos estáticos (por id combo-XX)
 *  - Corporativos estáticos (por id corp-XXX)
 *
 * Devuelve las líneas verificadas con el precio oficial y el total seguro.
 * Lanza Error si alguna línea no se puede verificar o la cantidad es inválida.
 */
export async function verifyCart(
  items: IncomingLine[]
): Promise<{ lines: VerifiedLine[]; total: number }> {
  // 1. Separar ids de productos de BD vs estáticos
  const staticIds = new Set<string>([
    ...Object.keys(COMBO_PRICES),
    ...Object.keys(CORP_PRICES),
  ]);

  const dbIds = items
    .filter((it) => !staticIds.has(it.id))
    .map((it) => it.id);

  // 2. Consultar precios reales en la base de datos
  const dbPriceMap = new Map<string, number>();
  if (dbIds.length > 0) {
    const products = await prisma.product.findMany({
      where: { id: { in: dbIds }, active: true },
      select: { id: true, price: true },
    });
    for (const p of products) {
      dbPriceMap.set(p.id, p.price);
    }
  }

  const lines: VerifiedLine[] = [];
  let total = 0;

  for (const item of items) {
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      throw new Error(`Cantidad inválida para el producto ${item.id}.`);
    }

    let unitPrice: number | undefined;

    if (COMBO_PRICES[item.id] !== undefined) {
      unitPrice = COMBO_PRICES[item.id];
    } else if (CORP_PRICES[item.id] !== undefined) {
      unitPrice = CORP_PRICES[item.id];
    } else {
      unitPrice = dbPriceMap.get(item.id);
    }

    if (unitPrice === undefined) {
      // Producto no encontrado o inactivo: se rechaza toda la orden
      throw new Error(
        `No se pudo verificar el precio de un producto del carrito (${item.id}). ` +
          "Es posible que haya cambiado o ya no esté disponible. Actualiza la página e intenta de nuevo."
      );
    }

    const lineTotal = unitPrice * qty;
    total += lineTotal;
    lines.push({ ...item, unitPrice, lineTotal });
  }

  return { lines, total };
}
