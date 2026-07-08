"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCart } from "@/components/cart/CartProvider";

export const coleccion = [
  {
    numero: "01",
    nombre: "Tradición Cafetera",
    precio: 63000,
    precioAnterior: 67000,
    descripcion:
      "La esencia del Eje Cafetero reunida en una sola colección. Tres productos icónicos que representan generaciones de amor por el café.",
    contenido: ["Chocoffee 70g", "Café Premium 500g", "Galletas de Café 60g"],
    destacado: "Más vendido",
    imagen: "/images/combo-tradicion-cafetera.png",
  },
  {
    numero: "02",
    nombre: "Pausa Cafetera La Elda",
    precio: 61000,
    precioAnterior: 65000,
    descripcion:
      "El momento perfecto para disfrutar el auténtico sabor del café. Una pausa que reconecta con la tradición y el descanso merecido.",
    contenido: ["Café Premium 500g", "Galletas de Café 125g"],
    destacado: "5.0 ★★★★★",
    imagen: "/images/combo-pausa-cafetera.png",
    rating: 5,
    eslogan: "El momento perfecto para disfrutar el auténtico sabor del café",
  },
  {
    numero: "03",
    nombre: "Regalo Delicioso",
    precio: 66000,
    precioAnterior: 71000,
    descripcion:
      "El obsequio perfecto para quien ama el café. Delicias artesanales que enamoran desde el primer instante.",
    contenido: ["Café Premium 500g", "Galletas de Café 60g", "Arequipe Totumo 40g", "Chocoffee 70g"],
    destacado: "Para regalar",
    imagen: "/images/combo-regalo-delicioso.png",
  },
  {
    numero: "04",
    nombre: "Experiencia La Elda",
    precio: 94000,
    precioAnterior: 103000,
    descripcion:
      "Una experiencia completa para los amantes del café. El equilibrio perfecto entre el café premium, el placer de nuestras galletas artesanales y la elegancia del vino de café.",
    contenido: ["Café Premium 500g", "Galletas de Café 125g", "Vino de Café 750ml"],
    destacado: "Premium",
    imagen: "/images/combo-experiencia-la-elda.png",
  },
  {
    numero: "05",
    nombre: "Placer Cafetero",
    precio: 52000,
    precioAnterior: 58000,
    descripcion:
      "Déjate envolver por una experiencia que despierta cada sentido. El toque sofisticado de nuestro vino de café, con el crujiente placer de nuestras galletas artesanales, te transporta a un momento de puro deleite. ¿Te atreves a vivirlo?",
    contenido: ["Vino de Café 750ml", "Galletas de Café 125g"],
    destacado: "Irresistible",
    imagen: "/images/combo-placer-cafetero.png",
    eslogan: "Un abrazo de sabor que no querrás soltar",
  },
  {
    numero: "06",
    nombre: "Tesoro Cafetero",
    precio: 35000,
    precioAnterior: 39000,
    descripcion:
      "¡No dejes pasar esta joya del Eje Cafetero! Tres tesoros en un solo combo que conquistarán tu paladar. El regalo ideal para compartir con quienes más amas. ¡Llévalo hoy y vive la experiencia La Elda en cada bocado!",
    contenido: ["Café Premium 250g", "Arequipe de Café Totumo 40g", "Galletas de Café 60g"],
    destacado: "¡Imperdible!",
    imagen: "/images/combo-tesoro-cafetero.png",
    eslogan: "Sabor que enamora, precio que sorprende",
  },
  {
    numero: "07",
    nombre: "Explosión de Sabor",
    precio: 55000,
    precioAnterior: 61000,
    descripcion:
      "¡Cuatro razones para enamorarte del café en un solo combo! El equilibrio perfecto entre lo dulce, lo crujiente y lo intenso. Una experiencia que despertará tus sentidos y te hará repetir. ¡No esperes más, tu paladar te lo está pidiendo! Adquiere ahora este tesoro cafetero y regálate el placer de lo extraordinario.",
    contenido: ["Café Premium 250g", "Galletas de Café 125g", "Arequipe de Café Totumo 40g", "Chocoffee 70g"],
    destacado: "¡Los Quiero Ya!",
    imagen: "/images/combo-explosion-sabor.png",
    eslogan: "Cuatro tesoros, una sola pasión: el café que enamora",
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function CombosSection() {
  const { addItem } = useCart();

  return (
    <section id="combos" className="py-24 px-[5%] bg-cafe-oscuro relative overflow-hidden">
      {/* Texturas decorativas de fondo */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, #d4a857 0%, transparent 50%), radial-gradient(circle at 80% 80%, #d4a857 0%, transparent 50%)",
      }} />

      <div className="relative">
        <SectionHeader
          label="Colección exclusiva"
          title="La Colección"
          titleAccent="La Elda"
          subtitle="Cinco ediciones exclusivas que combinan lo mejor de nuestra tierra. Cada una, una historia de sabor, tradición y artesanía cafetera."
          centered
          dark
          accentColor="amarillo"
        />

        <div className="mt-20 max-w-7xl mx-auto space-y-20">
          {coleccion.map((combo, idx) => {
            const ahorro = combo.precioAnterior - combo.precio;
            const invertir = idx % 2 === 1;
            const tieneImagen = Boolean(combo.imagen);

            return (
              <div
                key={combo.numero}
                className="group relative"
              >
                {/* Línea separadora superior */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-amarillo/40 to-transparent" />

                {/* Grid principal */}
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${invertir ? "lg:[direction:rtl]" : ""}`}>

                  {/* Imagen / Panel visual */}
                  <div className="lg:col-span-5 lg:[direction:ltr]">
                    {tieneImagen ? (
                      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-crema/10 to-amarillo/[0.03] border border-amarillo/20 p-8 min-h-[380px] flex items-center justify-center">
                        {/* Número grande de fondo */}
                        <span className="absolute top-4 left-6 font-playfair text-[120px] leading-none text-amarillo/[0.06] select-none pointer-events-none">
                          {combo.numero}
                        </span>
                        <img
                          src={combo.imagen}
                          alt={`Colección ${combo.nombre}`}
                          className="relative w-full h-full max-h-[320px] object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {/* Sello destacado */}
                        <div className="absolute bottom-5 right-5">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amarillo text-cafe-oscuro shadow-lg shadow-amarillo/20">
                            <span className="text-[10px] tracking-[2px] uppercase font-josefin font-bold">
                              {combo.destacado}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-cafe-medio/40 to-cafe-oscuro border border-amarillo/15 p-10 min-h-[380px] flex items-center justify-center">
                        {/* Número grande de fondo */}
                        <span className="absolute top-4 left-6 font-playfair text-[160px] leading-none text-amarillo/[0.07] select-none pointer-events-none">
                          {combo.numero}
                        </span>
                        {/* Monograma decorativo */}
                        <div className="relative text-center">
                          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-amarillo/30 mb-4">
                            <span className="font-playfair text-3xl text-amarillo/60">LE</span>
                          </div>
                          <div className="text-[10px] tracking-[3px] uppercase text-amarillo/40 font-josefin">
                            Café La Elda · 1941
                          </div>
                        </div>
                        {/* Sello destacado */}
                        <div className="absolute bottom-5 right-5">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amarillo/15 border border-amarillo/40 backdrop-blur-sm">
                            <span className="text-[10px] tracking-[2px] uppercase font-josefin font-bold text-amarillo">
                              {combo.destacado}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="lg:col-span-7 lg:[direction:ltr]">
                    <div className="space-y-6">
                      {/* Número + etiqueta */}
                      <div className="flex items-center gap-4">
                        <span className="font-playfair text-sm text-amarillo tracking-[3px]">
                          N° {combo.numero}
                        </span>
                        <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-amarillo/50 to-transparent" />
                        <span className="text-[10px] tracking-[3px] uppercase text-crema/40 font-josefin">
                          Edición Colección La Elda
                        </span>
                      </div>

                      {/* Título */}
                      <div>
                        <h3 className="font-playfair text-3xl lg:text-5xl text-crema leading-[1.1] mb-3">
                          {combo.nombre}
                        </h3>
                        {/* Rating de estrellas (si existe) */}
                        {combo.rating && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-amarillo text-base tracking-[1px]">
                              {"★".repeat(combo.rating)}
                            </span>
                            <span className="text-[10px] tracking-[2px] uppercase text-amarillo/70 font-josefin font-semibold">
                              {combo.rating}.0 · Calificación premium
                            </span>
                          </div>
                        )}
                        {/* Eslogan destacado (si existe) */}
                        {combo.eslogan && (
                          <p className="font-cormorant italic text-lg lg:text-xl text-amarillo/80 leading-[1.6] max-w-xl mb-2 border-l-2 border-amarillo/40 pl-4">
                            “{combo.eslogan}”
                          </p>
                        )}
                        <p className="font-cormorant italic text-lg lg:text-xl text-crema/60 leading-[1.7] max-w-xl">
                          {combo.descripcion}
                        </p>
                      </div>

                      {/* Lista de contenido */}
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        {combo.contenido.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-crema/[0.04] border border-amarillo/15 text-crema/80 text-[13px] font-josefin transition-colors duration-200 group-hover:border-amarillo/30"
                          >
                            <span className="w-1 h-1 rounded-full bg-amarillo/70" />
                            {item}
                          </span>
                        ))}
                      </div>

                      {/* Precios */}
                      <div className="flex flex-wrap items-end gap-6 pt-4 border-t border-amarillo/10">
                        <div>
                          <div className="text-[10px] tracking-[2px] uppercase text-crema/40 font-josefin mb-1">
                            Precio Colección
                          </div>
                          <div className="flex items-baseline gap-3">
                            <span className="font-playfair text-3xl lg:text-4xl text-amarillo">
                              {formatPrice(combo.precio)}
                            </span>
                            <span className="text-crema/30 text-base line-through font-josefin">
                              {formatPrice(combo.precioAnterior)}
                            </span>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-verde/15 border border-verde-claro/30">
                          <span className="text-verde-claro text-[11px] tracking-[1.5px] uppercase font-josefin font-semibold">
                            Ahorro {formatPrice(ahorro)}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            addItem({
                              id: `combo-${combo.numero}`,
                              name: `Colección ${combo.nombre}`,
                              price: combo.precio,
                              weight: combo.contenido.join(", "),
                              image: combo.imagen || null,
                            })
                          }
                          className="group/btn relative ml-auto overflow-hidden px-7 py-3.5 rounded-full bg-amarillo text-cafe-oscuro font-josefin font-bold text-[12px] tracking-[2px] uppercase transition-all duration-300 hover:shadow-xl hover:shadow-amarillo/25 hover:scale-[1.03] active:scale-[0.98]"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            Adquirir Colección
                            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner inferior elegante */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-amarillo/20 bg-gradient-to-r from-cafe-medio/30 via-cafe-oscuro to-cafe-medio/30 p-8 lg:p-10 text-center overflow-hidden">
            {/* Decoración esquinas */}
            <span className="absolute top-0 left-0 w-16 h-16 border-t border-l border-amarillo/30 rounded-tl-2xl" />
            <span className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-amarillo/30 rounded-br-2xl" />

            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-12 bg-amarillo/40" />
                <span className="text-amarillo text-lg">✦</span>
                <span className="h-px w-12 bg-amarillo/40" />
              </div>
              <p className="font-cormorant italic text-crema/75 text-lg lg:text-xl leading-relaxed mb-2">
                Cada colección es una invitación a descubrir el alma de Café La Elda 1941
              </p>
              <p className="font-josefin text-[11px] tracking-[3px] uppercase text-crema/40 mb-6">
                Envíos en Dosquebradas y todo el Eje Cafetero
              </p>

              {/* Disclaimer profesional */}
              <div className="mt-6 pt-6 border-t border-amarillo/10">
                <div className="flex items-start justify-center gap-3 max-w-2xl mx-auto">
                  <span className="text-amarillo/50 text-sm shrink-0 mt-0.5">ℹ️</span>
                  <p className="font-josefin text-[12px] tracking-wide text-crema/45 leading-relaxed text-left">
                    <span className="text-crema/60 font-semibold">Aviso Importante: </span>
                    Los precios publicados corresponden exclusivamente al valor de los productos. 
                    Los costos de envío y domicilio no están incluidos y se calculan por separado 
                    según la ciudad de destino. Para más información sobre tarifas de entrega, 
                    contáctanos directamente por WhatsApp o vía correo electrónico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
