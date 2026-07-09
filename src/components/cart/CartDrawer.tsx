"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, total, cartOpen, setCartOpen } = useCart();
  const [paying, setPaying] = useState<null | "bold" | "bancolombia">(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!cartOpen) return null;

  const handleCheckout = () => {
    const lines = items.map((i) => `• ${i.name} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`).join("\n");
    const msg = `Hola! Quiero hacer un pedido:\n\n${lines}\n\nTotal: ${formatPrice(total)}`;
    window.open(`https://wa.me/3107109852?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleGatewayCheckout = async (gateway: "bold" | "bancolombia") => {
    setPayError(null);
    setPaying(gateway);
    try {
      const res = await fetch(`/api/checkout/${gateway}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setPayError(data.error || "No se pudo generar el link de pago.");
        setPaying(null);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setPayError("Error de conexión. Intenta nuevamente.");
      setPaying(null);
    }
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText("91270334305");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback si el portapapeles no está disponible
    }
  };

  const handleTransferConfirm = () => {
    const lines = items.map((i) => `• ${i.name} x${i.quantity}`).join("\n");
    const msg = `Hola! Ya realicé la transferencia por mi pedido:\n\n${lines}\n\nTotal: ${formatPrice(total)}\nBanco: Bancolombia\nCuenta de ahorros: 91270334305\nA nombre de: Johana Ramírez Flórez\n\nAdjunto el comprobante. ¡Gracias!`;
    window.open(`https://wa.me/3107109852?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

      <div className="fixed top-0 right-0 h-full w-full max-w-md z-[201] flex flex-col bg-cafe-oscuro shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-b-amarillo">
          <h2 className="font-playfair text-xl text-crema">Tu Carrito</h2>
          <button onClick={() => setCartOpen(false)} className="text-2xl bg-transparent border-none cursor-pointer text-crema/60 hover:text-crema transition-colors">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 dark-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center">
              <div className="relative w-full max-w-[220px] mb-5">
                <img
                  src="/images/carrito-vacio.png"
                  alt="Tu carrito está vacío"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>
              <p className="font-cormorant italic text-lg text-crema/60">Tu carrito está vacío</p>
              <p className="font-cormorant text-sm text-crema/40 mt-1">¡Agrega nuestros productos y disfruta el mejor café!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-crema/[0.04] border border-crema/[0.08]">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 text-3xl bg-crema/[0.06] overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      "☕"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-playfair text-sm text-crema mb-0.5 truncate">{item.name}</h4>
                    <p className="text-xs text-crema/50 mb-2">{item.weight}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Si tiene mínimo corporativo, resta de 10 en 10 y se bloquea al llegar al mínimo */}
                        {item.minQuantity ? (
                          <>
                            <button
                              onClick={() => {
                                if (item.quantity <= item.minQuantity!) {
                                  removeItem(item.id);
                                } else {
                                  updateQuantity(item.id, item.quantity - 10);
                                }
                              }}
                              className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer text-sm bg-transparent border border-crema/20 text-crema hover:border-crema/40 transition-colors"
                              title={item.quantity <= item.minQuantity! ? "Quitar del carrito" : "Restar 10 unidades"}
                            >
                              −
                            </button>
                            <span className="text-sm w-8 text-center text-crema">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 10)}
                              className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer text-sm bg-transparent border border-crema/20 text-crema hover:border-crema/40 transition-colors"
                              title="Sumar 10 unidades"
                            >
                              +
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer text-sm bg-transparent border border-crema/20 text-crema hover:border-crema/40 transition-colors"
                            >
                              −
                            </button>
                            <span className="text-sm w-6 text-center text-crema">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer text-sm bg-transparent border border-crema/20 text-crema hover:border-crema/40 transition-colors"
                            >
                              +
                            </button>
                          </>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-amarillo">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                    {item.minQuantity && (
                      <p className="mt-1.5 text-[10px] text-amarillo/60 tracking-wide">
                        ★ Mínimo {item.minQuantity} unidades · − quita de 10 en 10
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-transparent border-none cursor-pointer self-start text-sm text-crema/30 hover:text-rojo transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-crema/10">
            <div className="flex justify-between items-center mb-4">
              <span className="uppercase tracking-[2px] text-xs text-crema/50">Total</span>
              <span className="font-bebas text-amarillo text-3xl">{formatPrice(total)}</span>
            </div>

            {payError && (
              <p className="mb-3 text-xs text-rojo bg-rojo/10 border border-rojo/30 rounded-md px-3 py-2">
                {payError}
              </p>
            )}

            <button
              onClick={() => handleGatewayCheckout("bold")}
              disabled={paying !== null}
              className="w-full py-4 rounded-lg cursor-pointer uppercase tracking-[2px] text-[13px] font-semibold transition-all duration-300 border-none mb-2 font-josefin bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {paying === "bold" ? "Generando link de pago..." : "💳 Pagar con Bold"}
            </button>
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-lg cursor-pointer uppercase tracking-[2px] text-[13px] font-semibold transition-all duration-300 border-none mb-2 font-josefin bg-[#25D366] text-white hover:bg-[#1fb558]"
            >
              💬 Pedir por WhatsApp
            </button>
            <button
              onClick={() => setShowTransfer((v) => !v)}
              className="w-full py-4 rounded-lg cursor-pointer uppercase tracking-[2px] text-[13px] font-semibold transition-all duration-300 mb-2 font-josefin bg-transparent text-crema border-2 border-crema/20 hover:border-amarillo hover:text-amarillo"
            >
              🏦 Pagar por transferencia
            </button>

            {showTransfer && (
              <div className="rounded-lg bg-crema/[0.06] border border-amarillo/25 p-4 mb-2">
                <p className="font-cormorant italic text-crema/70 text-sm mb-3 leading-relaxed">
                  Transfiere el total <span className="text-amarillo not-italic font-semibold">{formatPrice(total)}</span> a la siguiente cuenta y luego confirma por WhatsApp:
                </p>
                <dl className="flex flex-col gap-1.5 text-sm mb-3">
                  <div className="flex justify-between gap-2">
                    <dt className="text-crema/50 uppercase tracking-wider text-[10px]">Banco</dt>
                    <dd className="font-josefin text-crema text-right">Bancolombia</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-crema/50 uppercase tracking-wider text-[10px]">Tipo</dt>
                    <dd className="font-josefin text-crema text-right">Cuenta de Ahorros</dd>
                  </div>
                  <div className="flex justify-between gap-2 items-center">
                    <dt className="text-crema/50 uppercase tracking-wider text-[10px]">Número</dt>
                    <dd className="font-josefin text-amarillo text-base font-semibold">91270334305</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-crema/50 uppercase tracking-wider text-[10px]">Titular</dt>
                    <dd className="font-josefin text-crema text-right">Johana Ramírez Flórez</dd>
                  </div>
                </dl>
                <button
                  onClick={handleCopyAccount}
                  className="w-full py-2.5 mb-2 rounded-md cursor-pointer uppercase tracking-wider text-[11px] font-semibold transition-all bg-transparent border border-crema/20 text-crema hover:border-amarillo hover:text-amarillo"
                >
                  {copied ? "✓ Copiado" : "📋 Copiar número de cuenta"}
                </button>
                <button
                  onClick={handleTransferConfirm}
                  className="w-full py-2.5 rounded-md cursor-pointer uppercase tracking-wider text-[11px] font-semibold transition-all border-none bg-[#25D366] text-white hover:bg-[#1fb558]"
                >
                  Ya transferí — Confirmar por WhatsApp ✓
                </button>
              </div>
            )}
            <button
              onClick={clearCart}
              className="w-full py-2 bg-transparent cursor-pointer text-xs uppercase tracking-wider text-crema/40 border border-crema/10 rounded-lg hover:border-crema/20 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
