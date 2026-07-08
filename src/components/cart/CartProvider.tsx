"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { CartDrawer } from "./CartDrawer";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  weight: string;
  image: string | null;
  quantity: number;
  minQuantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

const STORAGE_KEY = "cafe-la-elda-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveCart(items);
    }
  }, [items, mounted]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const requestedQty = newItem.quantity ?? 1;
      setItems((prev) => {
        const existing = prev.find((item) => item.id === newItem.id);
        if (existing) {
          // Si ya existe, sumamos cantidades (respeta minQuantity del item)
          const newQty = existing.quantity + requestedQty;
          return prev.map((item) =>
            item.id === newItem.id
              ? {
                  ...item,
                  quantity: newQty,
                  // Preservar minQuantity si el nuevo item lo trae
                  minQuantity: newItem.minQuantity ?? existing.minQuantity,
                }
              : item
          );
        }
        // Separar quantity del resto antes de crear el item
        const { quantity: _omit, ...rest } = newItem;
        return [...prev, { ...rest, quantity: requestedQty }];
      });
      setCartOpen(true);
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const min = item.minQuantity ?? 1;
      // Si baja del mínimo o llega a 0, se elimina el item completo
      if (quantity < min) {
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}
