"use client";

import { useState, type FormEvent } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCart } from "@/components/cart/CartProvider";
import { coleccion } from "@/components/sections/CombosSection";
import { paquetes } from "@/components/sections/RegalosCorporativosSection";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  weight: string;
}

type Pestaña = "productos" | "combos" | "corporativos";

const infoItems = [
  {
    icon: "📍",
    title: "Ubicación",
    lines: ["Dosquebradas, Risaralda, Colombia", "Eje Cafetero · Colombia"],
  },
  {
    icon: "📞",
    title: "WhatsApp",
    links: [
      { label: "+57 310 710 9852", href: "https://wa.me/3107109852" },
    ],
  },
  {
    icon: "✉️",
    title: "Correo Electrónico",
    links: [{ label: "laeldacafe1941@gmail.com", href: "mailto:laeldacafe1941@gmail.com" }],
  },
  {
    icon: "🕐",
    title: "Horario de Atención",
    lines: ["Lunes a Sábado: 8am – 6pm", "Domingos: 9am – 1pm"],
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/laeldacafe1941", Icon: FacebookIcon },
  { name: "Instagram", href: "https://instagram.com/cafelaelda1941", Icon: InstagramIcon },
  { name: "TikTok", href: "https://tiktok.com/@laelda1941", Icon: TikTokIcon },
  { name: "YouTube", href: "https://youtube.com/@LaElda1941", Icon: YouTubeIcon },
  { name: "WhatsApp", href: "https://wa.me/3107109852", Icon: WhatsAppIcon },
];

export function ContactoSection({ products }: { products: Product[] }) {
  const { addItem, updateQuantity, itemCount, total, setCartOpen } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [pestañaActiva, setPestañaActiva] = useState<Pestaña>("productos");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const setQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      const updated = { ...prev };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  // Función especial para paquetes corporativos con mínimo obligatorio
  const setQtyCorp = (id: string, delta: number, minimo: number) => {
    setQuantities((prev) => {
      const actual = prev[id] ?? 0;
      let next: number;
      if (actual === 0 && delta > 0) {
        // Primer clic "+" → salta al mínimo obligatorio
        next = minimo;
      } else if (actual === minimo && delta < 0) {
        // Estánd en el mínimo y se presiona "−" → quita el item
        next = 0;
      } else if (actual > minimo && delta < 0) {
        // Resta de 10 en 10 sin bajar del mínimo
        next = Math.max(minimo, actual - 10);
      } else if (actual >= minimo && delta > 0) {
        // Suma de 10 en 10
        next = actual + 10;
      } else {
        next = actual;
      }
      const updated = { ...prev };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  const selectedCount = Object.values(quantities).reduce((s, n) => s + n, 0);

  const handleAddToCart = () => {
    // Productos individuales
    products.forEach((p) => {
      const qty = quantities[p.id] ?? 0;
      for (let i = 0; i < qty; i++) {
        addItem({ id: p.id, name: p.name, price: p.price, weight: p.weight, image: null });
      }
    });
    // Combos
    coleccion.forEach((c) => {
      const qty = quantities[`combo-${c.numero}`] ?? 0;
      for (let i = 0; i < qty; i++) {
        addItem({
          id: `combo-${c.numero}`,
          name: `Combo: ${c.nombre}`,
          price: c.precio,
          weight: c.contenido.join(", "),
          image: c.imagen,
        });
      }
    });
    // Paquetes corporativos — se agregan en bloque con su mínimo
    paquetes.forEach((p) => {
      const qty = quantities[`corp-${p.id}`] ?? 0;
      if (qty >= p.cantidadMinima) {
        addItem({
          id: `corp-${p.id}`,
          name: `Paquete Corporativo: ${p.nombre}`,
          price: p.precioUnidad,
          weight: `Nivel ${p.nivel} · Mín. ${p.cantidadMinima} un.`,
          image: p.imagen,
          minQuantity: p.cantidadMinima,
        });
        // Ajustar la cantidad total al valor seleccionado
        updateQuantity(`corp-${p.id}`, qty);
      }
    });
    setQuantities({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        const text = `Hola! Soy ${form.name || "un cliente"}.\n\nTeléfono: ${form.phone}\nMensaje: ${form.message}`;
        window.open(`https://wa.me/3107109852?text=${encodeURIComponent(text)}`, "_blank");
        setForm({ name: "", phone: "", email: "", message: "" });
      }
    } catch {
      alert("Error al enviar. Intenta por WhatsApp directamente.");
    } finally {
      setSending(false);
    }
  };

  const inputCn = "w-full bg-crema/[0.06] border border-crema/[0.12] text-crema py-3.5 px-4 font-josefin text-sm rounded-sm outline-none transition-colors focus:border-amarillo placeholder:text-crema/30";

  return (
    <section id="contacto" className="py-24 px-[5%] bg-cafe-oscuro">
      <SectionHeader
        label="Contáctenos"
        title="Haga su pedido"
        titleAccent="hoy mismo"
        subtitle="Arme su pedido eligiendo los productos y las cantidades, agréguelos al carrito y finalice la compra por WhatsApp."
        centered
        dark
        accentColor="amarillo"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">
        {/* Info */}
        <div className="flex flex-col gap-7">
          {infoItems.map((item) => (
            <div key={item.title} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-[22px] bg-amarillo/10 border border-amarillo/30">
                {item.icon}
              </div>
              <div>
                <h4 className="font-playfair text-crema text-base mb-1">{item.title}</h4>
                {item.lines?.map((line) => (
                  <p key={line} className="font-cormorant italic text-crema/60 text-[17px]">{line}</p>
                ))}
                {item.links?.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-cormorant italic text-crema/60 text-[17px] no-underline hover:text-amarillo transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <a
            href="https://wa.me/3107109852?text=Hola!%20Me%20interesa%20conocer%20los%20productos%20de%20Café%20La%20Elda%201941"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-fit px-6 py-3.5 rounded-lg no-underline font-josefin font-semibold tracking-wider text-sm text-white bg-[#25D366] hover:-translate-y-0.5 transition-all mt-2"
          >
            💬 Chatear por WhatsApp
          </a>

          <div className="mt-4">
            <h4 className="font-playfair text-crema text-base mb-3">Síguenos en redes</h4>
            <div className="flex gap-2.5 flex-wrap">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  title={name}
                  className="w-11 h-11 flex items-center justify-center rounded-full no-underline bg-amarillo/10 border border-amarillo/30 text-amarillo hover:bg-amarillo hover:text-cafe-oscuro hover:-translate-y-0.5 transition-all"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Selector de productos + carrito */}
        <div className="flex flex-col gap-5">
          <div className="rounded-lg bg-crema/[0.04] border border-crema/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-playfair text-crema text-lg">Seleccione su pedido</h4>
              <button
                onClick={() => setCartOpen(true)}
                className="text-[11px] tracking-[1px] uppercase text-amarillo no-underline hover:text-amarillo-oscuro transition-colors bg-transparent border-none cursor-pointer"
              >
                🛒 Ver carrito ({itemCount})
              </button>
            </div>

            {/* Pestañas de categorías */}
            <div className="flex gap-1.5 mb-4 flex-wrap">
              <button
                onClick={() => setPestañaActiva("productos")}
                className={`px-3.5 py-1.5 rounded-sm text-[10px] tracking-[1px] uppercase transition-all duration-300 font-josefin border cursor-pointer ${
                  pestañaActiva === "productos"
                    ? "bg-amarillo text-cafe-oscuro border-amarillo font-semibold"
                    : "bg-transparent text-crema/50 border-crema/15 hover:border-amarillo/40 hover:text-amarillo"
                }`}
              >
                ☕ Productos
              </button>
              <button
                onClick={() => setPestañaActiva("combos")}
                className={`px-3.5 py-1.5 rounded-sm text-[10px] tracking-[1px] uppercase transition-all duration-300 font-josefin border cursor-pointer ${
                  pestañaActiva === "combos"
                    ? "bg-amarillo text-cafe-oscuro border-amarillo font-semibold"
                    : "bg-transparent text-crema/50 border-crema/15 hover:border-amarillo/40 hover:text-amarillo"
                }`}
              >
                🎁 Combos
              </button>
              <button
                onClick={() => setPestañaActiva("corporativos")}
                className={`px-3.5 py-1.5 rounded-sm text-[10px] tracking-[1px] uppercase transition-all duration-300 font-josefin border cursor-pointer ${
                  pestañaActiva === "corporativos"
                    ? "bg-amarillo text-cafe-oscuro border-amarillo font-semibold"
                    : "bg-transparent text-crema/50 border-crema/15 hover:border-amarillo/40 hover:text-amarillo"
                }`}
              >
                💼 Corporativos
              </button>
            </div>

            <div className="flex flex-col divide-y divide-crema/[0.06] max-h-[320px] overflow-y-auto pr-1">
              {/* Productos individuales */}
              {pestañaActiva === "productos" &&
                products.map((p) => {
                  const qty = quantities[p.id] ?? 0;
                  return (
                    <div key={p.id} className="flex items-center justify-between py-3 gap-3">
                      <div className="min-w-0">
                        <p className="font-josefin text-crema text-sm truncate">{p.name}</p>
                        <p className="font-cormorant italic text-crema/45 text-xs">{p.weight} · {formatPrice(p.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setQty(p.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-sm border border-crema/20 text-crema bg-transparent cursor-pointer hover:border-amarillo hover:text-amarillo transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-josefin text-crema text-sm">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(p.id, 1)}
                          className="w-7 h-7 rounded-sm border border-crema/20 text-crema bg-transparent cursor-pointer hover:border-amarillo hover:text-amarillo transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}

              {/* Combos */}
              {pestañaActiva === "combos" &&
                coleccion.map((c) => {
                  const itemId = `combo-${c.numero}`;
                  const qty = quantities[itemId] ?? 0;
                  return (
                    <div key={itemId} className="flex items-center justify-between py-3 gap-3">
                      <div className="min-w-0">
                        <p className="font-josefin text-crema text-sm truncate">
                          {c.numero} · {c.nombre}
                        </p>
                        <p className="font-cormorant italic text-crema/45 text-xs truncate">
                          {c.contenido.join(", ")} · {formatPrice(c.precio)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setQty(itemId, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-sm border border-crema/20 text-crema bg-transparent cursor-pointer hover:border-amarillo hover:text-amarillo transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-josefin text-crema text-sm">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(itemId, 1)}
                          className="w-7 h-7 rounded-sm border border-crema/20 text-crema bg-transparent cursor-pointer hover:border-amarillo hover:text-amarillo transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}

              {/* Paquetes Corporativos */}
              {pestañaActiva === "corporativos" &&
                paquetes.map((p) => {
                  const itemId = `corp-${p.id}`;
                  const qty = quantities[itemId] ?? 0;
                  const minimo = p.cantidadMinima;
                  return (
                    <div key={itemId} className="flex items-center justify-between py-3 gap-3">
                      <div className="min-w-0">
                        <p className="font-josefin text-crema text-sm truncate">
                          {p.numero} · {p.nombre} <span className="text-amarillo/60">({p.nivel})</span>
                        </p>
                        <p className="font-cormorant italic text-crema/45 text-xs">
                          {formatPrice(p.precioUnidad)} / un. ·{" "}
                          <span className={qty === 0 ? "text-cafe-claro" : "text-amarillo/70"}>
                            {qty === 0 ? `Mín. ${minimo} un.` : `${qty} unidades seleccionadas`}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setQtyCorp(itemId, -1, minimo)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-sm border border-crema/20 text-crema bg-transparent cursor-pointer hover:border-amarillo hover:text-amarillo transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-josefin text-crema text-sm">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQtyCorp(itemId, 1, minimo)}
                          className={`w-7 h-7 rounded-sm border cursor-pointer transition-colors ${
                            qty === 0
                              ? "border-amarillo/50 text-amarillo bg-amarillo/10 hover:bg-amarillo/20"
                              : "border-crema/20 text-crema bg-transparent hover:border-amarillo hover:text-amarillo"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={selectedCount === 0}
              className="w-full mt-5 py-3.5 rounded-sm cursor-pointer uppercase tracking-[2px] text-[12px] font-semibold transition-all duration-300 border-none font-josefin bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {selectedCount > 0
                ? `Agregar ${selectedCount} al carrito 🛒`
                : "Elija cantidades para agregar"}
            </button>

            {itemCount > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-sm bg-amarillo/10 border border-amarillo/25 px-4 py-3">
                <span className="font-cormorant italic text-crema/70 text-sm">
                  {itemCount} {itemCount === 1 ? "producto" : "productos"} en el carrito
                </span>
                <span className="font-bebas text-amarillo text-lg">{formatPrice(total)}</span>
              </div>
            )}
          </div>

          {/* Datos del cliente */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[2px] text-crema/50 mb-2">Nombre</label>
                <input type="text" placeholder="Tu nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCn} />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[2px] text-crema/50 mb-2">Teléfono</label>
                <input type="tel" placeholder="+57 300 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCn} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[2px] text-crema/50 mb-2">Correo Electrónico</label>
              <input type="email" placeholder="tu@correo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCn} />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[2px] text-crema/50 mb-2">Mensaje</label>
              <textarea
                placeholder="Ciudad de envío, observaciones o cualquier consulta..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={3}
                className={`${inputCn} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`py-4 rounded-sm cursor-pointer uppercase tracking-[2px] text-[13px] font-semibold transition-all duration-300 border-none mt-2 font-josefin ${
                sent ? "bg-verde text-crema" : "bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro"
              } ${sending ? "opacity-70" : ""}`}
            >
              {sent ? "✓ Mensaje Enviado" : sending ? "Enviando..." : "Enviar mensaje vía WhatsApp →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
