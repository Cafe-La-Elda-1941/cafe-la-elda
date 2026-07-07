"use client";

import { useEffect } from "react";

// Debe coincidir con STORAGE_KEY de CartProvider
const STORAGE_KEY = "cafe-la-elda-cart";

/**
 * Vacía el carrito automáticamente cuando el cliente llega a esta página
 * tras un pago exitoso. Limpia directamente el localStorage para que,
 * al volver a la tienda, el carrito aparezca vacío.
 */
export function ClearCart() {
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage no disponible: no crítico
    }
  }, []);

  return null;
}
