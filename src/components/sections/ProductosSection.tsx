"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCart } from "@/components/cart/CartProvider";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  weight: string;
  image: string | null;
  tag: string | null;
  tagStyle: string | null;
  category: { slug: string };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

const PLACEHOLDER_ICONS: Record<string, { icon: string; label?: string }> = {
  "cafe-familiar-500g": { icon: "☕", label: "500g" },
  "kaski-cereal-de-cafe": { icon: "🌾", label: "Kaski" },
  "arequipe-de-cafe": { icon: "🍮", label: "Arequipe" },
  "chocoffee": { icon: "🍫", label: "Chocoffee" },
  "pack-arequipe-x4": { icon: "🫙", label: "Pack x4" },
};

const filters = [
  { key: "todos", label: "Todos" },
  { key: "cafe", label: "☕ Café" },
  { key: "derivado", label: "🍫 Derivados" },
];

export function ProductosSection({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState("todos");
  const { addItem } = useCart();

  const filtered =
    activeFilter === "todos"
      ? products
      : products.filter((p) => p.category.slug === activeFilter);

  return (
    <section id="productos" className="py-24 px-[5%] bg-cafe-oscuro">
      <SectionHeader
        label="Nuestros Productos"
        title="La colección"
        titleAccent="La Elda"
        subtitle="Café en grano, molido y una deliciosa línea de derivados artesanales de café."
        centered
        dark
        accentColor="amarillo"
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mt-10 mb-8 justify-center">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-5 py-2 cursor-pointer rounded-sm text-[11px] tracking-[2px] uppercase transition-all duration-300 font-josefin border ${
              activeFilter === f.key
                ? "bg-amarillo text-cafe-oscuro border-amarillo"
                : "bg-transparent text-crema/60 border-crema/20 hover:border-crema/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => {
          const placeholder = PLACEHOLDER_ICONS[product.slug];
          return (
            <div
              key={product.id}
              className="rounded-lg overflow-hidden transition-all duration-300 cursor-pointer group bg-crema/[0.04] border border-crema/[0.08] hover:-translate-y-2 hover:bg-crema/[0.08] hover:border-amarillo/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              {/* Image — vitrina premium: crema + luz dorada + base café anclada */}
              <div className="h-[280px] relative overflow-hidden flex items-center justify-center">
                {/* Fondo crema cálido tipo papel artesanal */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#faf5ea] via-[#f3ead6] to-[#e8d9bd]" />

                {/* Luz dorada cayendo desde arriba (ventana de vitrina) */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,197,24,0.22)_0%,transparent_70%)] pointer-events-none" />

                {/* Base café anclada — superficie oscura en el tercio inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-gradient-to-b from-transparent via-[#3a2218]/35 to-[#2c1810]/90 pointer-events-none" />

                {/* Línea de horizonte sutil (el "mostrador") */}
                <div className="absolute bottom-[38%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a86a]/45 to-transparent pointer-events-none" />

                {/* Sombra elíptica de apoyo del producto */}
                <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[55%] h-3 rounded-[100%] bg-black/25 blur-md pointer-events-none" />

                {product.tag && (
                  <span className={`absolute top-4 left-4 z-10 py-1 px-2.5 text-[10px] tracking-[1px] uppercase rounded-sm text-white shadow-sm ${product.tagStyle === "nuevo" ? "bg-rojo" : "bg-verde"}`}>
                    {product.tag}
                  </span>
                )}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative z-[1] w-full h-full object-contain px-3 pt-3 pb-7 drop-shadow-[0_8px_18px_rgba(26,15,8,0.35)] transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="relative z-[1] flex flex-col items-center justify-center gap-2">
                    <span className="text-6xl drop-shadow-sm">{placeholder?.icon ?? "☕"}</span>
                    <span className="font-playfair text-cafe-oscuro italic text-lg">
                      {placeholder?.label ?? product.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-playfair text-xl text-crema mb-1.5">
                  {product.name}
                </h3>
                <p className="font-cormorant italic text-[15px] text-crema/55 mb-4 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-[11px] tracking-[1px] uppercase text-crema/40">
                      {product.weight}
                    </span>
                    <span className="block mt-1 font-bebas text-amarillo text-[22px]">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        weight: product.weight,
                        image: product.image,
                      })
                    }
                    className="px-4 py-2.5 rounded-sm cursor-pointer text-[11px] tracking-[1px] uppercase transition-all duration-300 border-none bg-amarillo text-cafe-oscuro font-josefin font-semibold hover:bg-amarillo-oscuro"
                  >
                    Agregar 🛒
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
