/**
 * Utilidades de formato para el sistema contable
 * Todos los valores monetarios se almacenan en centavos de COP
 */

/** Formatea centavos a formato de moneda colombiana */
export function formatCOP(cents: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Formatea centavos sin símbolo de moneda */
export function formatNumber(cents: number): string {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Convierte un valor en pesos (ej: 15000) a centavos (1500000) */
export function toCents(pesos: number): number {
  return Math.round(pesos * 100);
}

/** Convierte centavos a pesos */
export function toPesos(cents: number): number {
  return cents / 100;
}

/** Formatea fecha ISO a formato colombiano */
export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Formatea fecha y hora */
export function formatDateTime(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Devuelve la fecha actual en formato ISO para DIAN (YYYY-MM-DD) */
export function dianDate(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

/** Devuelve la hora actual en formato DIAN (HH:MM:SS) */
export function dianTime(date: Date = new Date()): string {
  return date.toTimeString().split(" ")[0];
}

/** Formatea un número con ceros a la izquierda */
export function pad(num: number, length: number): string {
  return String(num).padStart(length, "0");
}

/** Calcula el dígito de verificación del NIT (algoritmo Dian) */
export function calcularDigitoVerificacion(nit: string): number {
  const primes = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const cleanNit = nit.replace(/\D/g, "");
  let sum = 0;
  const reversed = cleanNit.split("").reverse().join("");
  for (let i = 0; i < reversed.length && i < primes.length; i++) {
    sum += parseInt(reversed[i]) * primes[i];
  }
  const residue = sum % 11;
  return residue === 0 || residue === 1 ? residue : 11 - residue;
}

/** Etiquetas legibles para tipos de documento DIAN */
export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  CC: "Cédula de Ciudadanía",
  CE: "Cédula de Extranjería",
  NIT: "NIT",
  PA: "Pasaporte",
  TI: "Tarjeta de Identidad",
  RC: "Registro Civil",
};

/** Etiquetas para estados de factura */
export const INVOICE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  BORRADOR: { label: "Borrador", color: "bg-gray-500/20 text-gray-400" },
  ENVIADA: { label: "Enviada DIAN", color: "bg-blue-500/20 text-blue-400" },
  ACEPTADA: { label: "Aceptada", color: "bg-green-500/20 text-green-400" },
  RECHAZADA: { label: "Rechazada", color: "bg-red-500/20 text-red-400" },
  ANULADA: { label: "Anulada", color: "bg-red-700/20 text-red-500" },
};

/** Etiquetas para métodos de pago */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIA: "Transferencia",
  ONLINE: "Online",
  NEQUI: "Nequi",
};
