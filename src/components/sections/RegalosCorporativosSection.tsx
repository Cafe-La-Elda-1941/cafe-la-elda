"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCart } from "@/components/cart/CartProvider";

interface PaqueteCorporativo {
  id: string;
  numero: string;
  nombre: string;
  nivel: string;
  descripcion: string;
  contenido: string[];
  precioUnidad: number;
  cantidadMinima: number;
  imagen: string;
  color: string;
  destacado?: boolean;
}

export const paquetes: PaqueteCorporativo[] = [
  {
    id: "esencial",
    numero: "01",
    nombre: "Esencial",
    nivel: "Bronce",
    descripcion:
      "El primer gran paso para conquistar a tu equipo. Una explosión de sabores artesanales que demuestra aprecio y buen gusto. ¡La forma más elegante de decir 'gracias' con cuatro delicias que enamoran!",
    contenido: ["Chocoffee 70g", "Galletas de Café 60g", "Arequipe Totumo 40g", "Kaski 30g"],
    precioUnidad: 23000,
    cantidadMinima: 100,
    imagen: "/images/corp-esencial.png",
    color: "bronce",
  },
  {
    id: "clasico",
    numero: "02",
    nombre: "Clásico",
    nivel: "Bronce",
    descripcion:
      "Tradición y sabor en cada entrega. El equilibrio perfecto entre el aroma de nuestro café, lo crujiente de nuestras galletas y el dulzor del totumo. ¡Un regalo que nunca falla y siempre enamora!",
    contenido: ["Café Premium 250g", "Galletas de Café 60g", "Arequipe Totumo 40g"],
    precioUnidad: 30000,
    cantidadMinima: 100,
    imagen: "/images/corp-clasico.png",
    color: "bronce",
  },
  {
    id: "premium",
    numero: "03",
    nombre: "Premium",
    nivel: "Plata",
    descripcion:
      "El primer gran paso hacia la excelencia. Tres tesoros cafeteros en una presentación impecable que demuestra aprecio y buen gusto. ¡La combinación perfecta de café, galletas y chocolate para conquistar a tu equipo!",
    contenido: ["Café Premium 250g", "Galletas de Café 60g", "Chocoffee"],
    precioUnidad: 37000,
    cantidadMinima: 100,
    imagen: "/images/corp-premium.png",
    color: "plata",
  },
  {
    id: "selecto",
    numero: "04",
    nombre: "Selecto",
    nivel: "Oro",
    descripcion:
      "Elegancia, distinción y sofisticación en cada detalle. La combinación de nuestro café premium con el exquisito vino de café creará una experiencia inolvidable. ¡El regalo que elevará la imagen de tu empresa al siguiente nivel!",
    contenido: ["Café Premium 500g", "Vino de Café 750ml", "Galletas de Café 125g"],
    precioUnidad: 75000,
    cantidadMinima: 100,
    imagen: "/images/corp-selecto.png",
    color: "oro",
    destacado: true,
  },
  {
    id: "exclusivo",
    numero: "05",
    nombre: "Exclusivo",
    nivel: "Diamante",
    descripcion:
      "La máxima expresión del lujo cafetero. Seis piezas de colección que cuentan la historia de Café La Elda 1941 en cada bocado. No es solo un regalo, es una declaración de excelencia. ¡Reserva tu pedido hoy y deja una huella imborrable en tus clientes y aliados estratégicos! Pedidos exclusivos desde 50 unidades.",
    contenido: [
      "Café Premium 500g",
      "Vino de Café 750ml",
      "Chocoffee 120g",
      "Galletas de Café 125g",
      "Kaski 80g",
      "Arequipe Totumo 130g",
    ],
    precioUnidad: 105000,
    cantidadMinima: 50,
    imagen: "/images/corp-exclusivo.png",
    color: "diamante",
  },
];

const BENEFICIOS = [
  {
    icon: "🎁",
    titulo: "Personalización Total",
    descripcion: "Agregamos el logo de tu empresa, mensaje personalizado y empaque especial en cada combo.",
  },
  {
    icon: "📦",
    titulo: "Entrega Masiva",
    descripcion: "Coordinamos la entrega en múltiples sedes, ciudades o direcciones individuales.",
  },
  {
    icon: "💼",
    titulo: "Facturación Empresarial",
    descripcion: "Emitimos factura electrónica corporativa con todos los soportes tributarios.",
  },
  {
    icon: "🎯",
    titulo: "Calidad Garantizada",
    descripcion: "Cada paquete se produce con estándares de excelencia uniformes.",
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function RegalosCorporativosSection() {
  const { addItem, items: cartItems } = useCart();
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState<number>(100);
  const [error, setError] = useState<string>("");
  const [mostrarCotizacion, setMostrarCotizacion] = useState<boolean>(false);
  const [agregadoCarrito, setAgregadoCarrito] = useState<boolean>(false);

  const paqueteActual = paquetes.find((p) => p.id === paqueteSeleccionado);

  // IDs de paquetes corporativos que ya están en el carrito
  const enCarrito = new Set(cartItems.map((i) => i.id));

  function handleSelectPaquete(id: string) {
    const paq = paquetes.find((p) => p.id === id);
    setPaqueteSeleccionado(id);
    setCantidad(paq?.cantidadMinima || 100);
    setError("");
    setMostrarCotizacion(true);
  }

  // Agrega directo con la cantidad mínima, sin abrir el panel
  function handleQuickAdd(paq: PaqueteCorporativo) {
    addItem({
      id: `corp-${paq.id}`,
      name: `Paquete Corporativo ${paq.nombre}`,
      price: paq.precioUnidad,
      weight: `Nivel ${paq.nivel} · ${paq.contenido.join(", ")}`,
      image: paq.imagen,
      minQuantity: paq.cantidadMinima,
      quantity: paq.cantidadMinima,
    });
  }

  function handleCantidad(cambio: number) {
    const minimo = paqueteActual?.cantidadMinima || 100;
    const nuevaCantidad = cantidad + cambio;
    if (nuevaCantidad < minimo) {
      setError(`⚠️ La cantidad mínima para este paquete es de ${minimo} unidades.`);
      setCantidad(minimo);
    } else {
      setError("");
      setCantidad(nuevaCantidad);
    }
  }

  function handleInputCantidad(valor: string) {
    const num = parseInt(valor) || 0;
    const minimo = paqueteActual?.cantidadMinima || 100;
    if (num < minimo && num !== 0) {
      setError(`⚠️ La cantidad mínima para este paquete es de ${minimo} unidades.`);
      setCantidad(num);
    } else if (num === 0) {
      setError("");
      setCantidad(0);
    } else {
      setError("");
      setCantidad(num);
    }
  }

  function handleAgregarCarrito() {
    if (!paqueteActual) return;
    const minimo = paqueteActual.cantidadMinima;
    if (cantidad < minimo) {
      setError(`⚠️ La cantidad mínima para este paquete es de ${minimo} unidades.`);
      setCantidad(minimo);
      return;
    }
    addItem({
      id: `corp-${paqueteActual.id}`,
      name: `Paquete Corporativo ${paqueteActual.nombre}`,
      price: paqueteActual.precioUnidad,
      weight: `${paqueteActual.contenido.join(", ")} · Nivel ${paqueteActual.nivel}`,
      image: paqueteActual.imagen,
      minQuantity: minimo,
      quantity: cantidad,
    });
    setAgregadoCarrito(true);
    setTimeout(() => setAgregadoCarrito(false), 3000);
  }

  const total = paqueteActual ? paqueteActual.precioUnidad * cantidad : 0;
  const descuento = cantidad >= 150 ? 0.05 : 0;
  const totalConDescuento = total * (1 - descuento);
  const ahorro = total - totalConDescuento;

  return (
    <section
      id="regalos-corporativos"
      className="py-24 px-[5%] relative overflow-hidden bg-cafe-oscuro"
    >
      {/* Fondo con textura premium */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, #f5c518 0%, transparent 40%), radial-gradient(circle at 80% 90%, #6b3a2a 0%, transparent 40%), radial-gradient(circle at 50% 50%, #f5c518 0%, transparent 60%)",
        }}
      />
      {/* Patrón de líneas elegantes */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 35px, #f5c518 35px, #f5c518 36px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header premium */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-amarillo/60" />
            <span className="px-4 py-1.5 rounded-full border border-amarillo/30 bg-amarillo/5">
              <span className="font-josefin text-[11px] tracking-[4px] uppercase text-amarillo font-bold">
                ✦ Línea Premium Empresarial ✦
              </span>
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-amarillo/60" />
          </div>
          <h2 className="font-playfair text-4xl lg:text-5xl text-crema mb-3">
            Regalos <em className="italic text-amarillo">Corporativos</em>
          </h2>
          <p className="font-cormorant italic text-crema/60 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Sorprende a tu equipo, clientes y aliados comerciales con la esencia del café colombiano.
            Paquetes exclusivos con la identidad de tu empresa.
          </p>
        </div>

        {/* Banner destacado premium */}
        <div className="mt-10 mb-16 max-w-3xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-r from-cafe-medio/20 via-cafe-oscuro to-cafe-medio/20 border border-amarillo/15 p-7 text-center overflow-hidden">
            <span className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amarillo/20 rounded-tl-2xl" />
            <span className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amarillo/20 rounded-br-2xl" />
            <span className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-amarillo/10 rounded-tr-2xl" />
            <span className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-amarillo/10 rounded-bl-2xl" />
            <div className="relative">
              <p className="font-cormorant italic text-amarillo/90 text-lg lg:text-xl leading-relaxed">
                &ldquo;El detalle que tu empresa merece. Calidad premium, presentación elegante y un
                sabor que conquista desde el primer instante.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Paquetes — Tarjetas premium oscuras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-16">
          {paquetes.map((paq) => {
            const isSelected = paqueteSeleccionado === paq.id;
            const yaEnCarrito = enCarrito.has(`corp-${paq.id}`);

            return (
              <div
                key={paq.id}
                className={`relative rounded-2xl overflow-hidden transition-all duration-500 group ${
                  isSelected
                    ? "ring-2 ring-amarillo shadow-2xl shadow-amarillo/20 scale-[1.02]"
                    : yaEnCarrito
                    ? "ring-1 ring-verde-claro/50 shadow-xl shadow-verde/10"
                    : paq.destacado
                    ? "ring-1 ring-amarillo/40 shadow-xl shadow-black/40"
                    : "ring-1 ring-amarillo/10 shadow-lg shadow-black/30"
                } bg-gradient-to-br from-cafe-medio/25 via-cafe-oscuro to-cafe-medio/15 hover:ring-amarillo/40 hover:shadow-2xl hover:shadow-amarillo/10`}
              >
                {/* Brillo superior al hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-amarillo/5 to-transparent pointer-events-none" />

                {/* Banda de nivel */}
                <div
                  className={`relative px-5 py-2 text-center ${
                    paq.color === "diamante"
                      ? "bg-gradient-to-r from-cafe-claro/30 via-amarillo/80 to-cafe-claro/30"
                      : paq.color === "oro"
                      ? "bg-gradient-to-r from-amarillo-oscuro/60 via-amarillo to-amarillo-oscuro/60"
                      : paq.color === "plata"
                      ? "bg-gradient-to-r from-cafe-claro/40 to-cafe-medio/60"
                      : "bg-gradient-to-r from-cafe-medio/50 to-cafe-oscuro/80"
                  }`}
                >
                  <span
                    className={`font-josefin text-[11px] tracking-[4px] uppercase font-bold ${
                      paq.color === "oro" || paq.color === "diamante" ? "text-cafe-oscuro" : "text-crema"
                    }`}
                  >
                    ✦ Nivel {paq.nivel} ✦
                  </span>
                </div>

                {/* Badge destacado */}
                {paq.destacado && !yaEnCarrito && (
                  <div className="absolute top-12 right-4 z-10">
                    <div className="px-3 py-1 rounded-full bg-amarillo text-cafe-oscuro text-[9px] tracking-[2px] uppercase font-josefin font-bold shadow-lg shadow-amarillo/30">
                      ★ Más Pedido
                    </div>
                  </div>
                )}

                {/* Badge ya en carrito */}
                {yaEnCarrito && (
                  <div className="absolute top-12 right-4 z-10">
                    <div className="px-3 py-1 rounded-full bg-verde-claro text-cafe-oscuro text-[9px] tracking-[2px] uppercase font-josefin font-bold shadow-lg shadow-verde/30 flex items-center gap-1">
                      ✓ En el Carrito
                    </div>
                  </div>
                )}

                {/* Badge exclusivo */}
                {paq.id === "exclusivo" && (
                  <div className="absolute top-12 right-4 z-10 flex flex-col items-end gap-1.5">
                    <div className="px-3 py-1 rounded-full bg-amarillo/20 border border-amarillo/40 text-amarillo text-[9px] tracking-[2px] uppercase font-josefin font-bold shadow-lg">
                      💎 Edición Limitada
                    </div>
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amarillo-oscuro to-amarillo text-cafe-oscuro text-[9px] tracking-[1.5px] uppercase font-josefin font-bold shadow-lg shadow-amarillo/30">
                      ✦ Desde 50 Unidades
                    </div>
                  </div>
                )}

                {/* Número de paquete */}
                <div className="absolute top-12 left-5 z-10">
                  <span className="font-bebas text-6xl text-amarillo/10 leading-none">
                    {paq.numero}
                  </span>
                </div>

                {/* Imagen */}
                <div className="relative pt-6 pb-4 px-6">
                  <div
                    className={`relative flex items-center justify-center ${
                      paq.id === "esencial" || paq.id === "clasico"
                        ? "h-60"
                        : "h-44"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-radial from-amarillo/5 to-transparent rounded-full blur-2xl" />
                    <img
                      src={paq.imagen}
                      alt={paq.nombre}
                      className="relative max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 pt-2">
                  <h3 className="font-playfair text-xl text-crema font-bold mb-2">
                    Paquete {paq.nombre}
                  </h3>
                  <p className="font-cormorant italic text-crema/50 text-sm leading-relaxed mb-4 min-h-[80px]">
                    {paq.descripcion}
                  </p>

                  {/* Contenido del paquete */}
                  <div className="space-y-1.5 mb-5 border-t border-amarillo/10 pt-4">
                    {paq.contenido.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-[12px] text-crema/70 font-josefin"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amarillo/60 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Precio */}
                  <div className="border-t border-amarillo/10 pt-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] tracking-[2px] uppercase text-crema/40 font-josefin block mb-0.5">
                          Precio por unidad
                        </span>
                        <span className="font-playfair text-2xl text-amarillo font-bold">
                          {formatPrice(paq.precioUnidad)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] tracking-[2px] uppercase text-crema/40 font-josefin block mb-0.5">
                          Mínimo
                        </span>
                        <span
                          className={`font-bebas text-xl ${
                            paq.id === "exclusivo"
                              ? "text-amarillo"
                              : "text-crema/80"
                          }`}
                        >
                          {paq.cantidadMinima} un.
                        </span>
                        {paq.id === "exclusivo" && (
                          <span className="block text-[8px] tracking-[2px] uppercase text-amarillo/60 font-josefin font-bold mt-0.5">
                            ★ Pedidos reducidos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-5 flex flex-col gap-2">
                    {/* Botón principal — Agregar directo */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(paq);
                      }}
                      className={`w-full py-3 rounded-full font-josefin font-bold text-[12px] tracking-[3px] uppercase transition-all duration-300 border-none cursor-pointer ${
                        yaEnCarrito
                          ? "bg-verde-claro/20 text-verde-claro border border-verde-claro/40"
                          : "bg-gradient-to-r from-amarillo-oscuro to-amarillo text-cafe-oscuro hover:shadow-lg hover:shadow-amarillo/30"
                      }`}
                    >
                      {yaEnCarrito
                        ? `✓ Agregar ${paq.cantidadMinima} más`
                        : `🛒 Agregar ${paq.cantidadMinima} un.`}
                    </button>

                    {/* Botón secundario — Personalizar cantidad */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPaquete(paq.id);
                      }}
                      className={`w-full py-2.5 rounded-full font-josefin font-bold text-[11px] tracking-[2px] uppercase transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-amarillo/20 text-amarillo border border-amarillo/50"
                          : "bg-transparent text-crema/50 border border-crema/15 hover:text-amarillo hover:border-amarillo/30"
                      }`}
                    >
                      {isSelected ? "✓ Personalizando..." : "⚙ Personalizar Cantidad"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Beneficios — Cards oscuras elegantes */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="h-px w-12 bg-amarillo/40" />
              <span className="text-amarillo text-sm">✦</span>
              <span className="h-px w-12 bg-amarillo/40" />
            </div>
            <h3 className="font-playfair text-2xl lg:text-3xl text-crema">
              ¿Por qué elegir nuestros{" "}
              <em className="italic text-amarillo">regalos corporativos?</em>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFICIOS.map((ben) => (
              <div
                key={ben.titulo}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-cafe-medio/15 to-cafe-oscuro border border-amarillo/10 hover:border-amarillo/25 transition-colors duration-300"
              >
                <div className="text-3xl mb-3">{ben.icon}</div>
                <h4 className="font-josefin font-bold text-amarillo text-sm mb-2 tracking-wide">
                  {ben.titulo}
                </h4>
                <p className="text-[12px] text-crema/55 leading-relaxed">{ben.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selector de cantidad y cotización — Panel premium */}
        {mostrarCotizacion && paqueteActual && (
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/50 relative">
            {/* Borde dorado decorativo */}
            <div className="absolute inset-0 rounded-3xl p-px bg-gradient-to-br from-amarillo/40 via-cafe-medio/30 to-amarillo/40 pointer-events-none z-10" />

            <div className="relative bg-gradient-to-br from-cafe-oscuro via-cafe-medio/15 to-cafe-oscuro p-8 lg:p-12">
              {/* Header de cotización */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="h-px w-16 bg-gradient-to-r from-transparent to-amarillo/50" />
                  <div className="px-4 py-1.5 rounded-full border border-amarillo/30 bg-amarillo/5">
                    <span className="text-amarillo text-[10px] tracking-[4px] uppercase font-josefin font-bold">
                      📋 Cotización en Vivo
                    </span>
                  </div>
                  <span className="h-px w-16 bg-gradient-to-l from-transparent to-amarillo/50" />
                </div>
                <h3 className="font-playfair text-2xl lg:text-3xl text-crema mb-1">
                  Paquete {paqueteActual.nombre}
                </h3>
                <p className="text-amarillo/60 text-sm font-josefin tracking-wide">
                  Nivel {paqueteActual.nivel} · {formatPrice(paqueteActual.precioUnidad)} por unidad
                </p>
              </div>

              {/* Selector de cantidad */}
              <div className="max-w-md mx-auto mb-6">
                <label className="block text-center font-josefin text-[11px] tracking-[3px] uppercase text-crema/50 mb-4">
                  Selecciona la cantidad
                </label>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleCantidad(-10)}
                    className="w-12 h-12 rounded-full bg-amarillo/10 border border-amarillo/25 text-amarillo text-xl font-bold hover:bg-amarillo/20 hover:border-amarillo/50 transition-all flex items-center justify-center"
                  >
                    −
                  </button>

                  <div className="relative">
                    <input
                      type="number"
                      value={cantidad || ""}
                      onChange={(e) => handleInputCantidad(e.target.value)}
                      min={paqueteActual.cantidadMinima}
                      step={10}
                      className="w-36 h-16 text-center font-bebas text-3xl text-amarillo bg-amarillo/5 border-2 border-amarillo/30 rounded-xl outline-none focus:border-amarillo focus:bg-amarillo/10 transition-all"
                      style={{ MozAppearance: "textfield" }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-crema/40 font-josefin whitespace-nowrap">
                      Mínimo {paqueteActual.cantidadMinima} unidades
                    </span>
                  </div>

                  <button
                    onClick={() => handleCantidad(10)}
                    className="w-12 h-12 rounded-full bg-amarillo/10 border border-amarillo/25 text-amarillo text-xl font-bold hover:bg-amarillo/20 hover:border-amarillo/50 transition-all flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Atajos de cantidad */}
                <div className="flex justify-center gap-2 mt-10 mb-4">
                  {[paqueteActual.cantidadMinima, 150, 200, 300].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setCantidad(num);
                        setError("");
                      }}
                      className={`px-4 py-1.5 rounded-lg text-[11px] font-josefin font-bold tracking-wide transition-all ${
                        cantidad === num
                          ? "bg-amarillo text-cafe-oscuro shadow-lg shadow-amarillo/20"
                          : "bg-amarillo/8 text-crema/50 border border-amarillo/15 hover:bg-amarillo/15 hover:text-amarillo"
                      }`}
                    >
                      {num} un.
                    </button>
                  ))}
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="mt-3 px-4 py-2 rounded-lg bg-rojo/15 border border-rojo/30 text-center">
                    <p className="text-rojo text-[12px] font-josefin">{error}</p>
                  </div>
                )}
              </div>

              {/* Resumen de cotización */}
              {cantidad >= paqueteActual.cantidadMinima && (
                <div className="max-w-lg mx-auto border-t border-amarillo/15 pt-6">
                  {descuento > 0 && (
                    <div className="flex justify-center mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-verde/15 border border-verde-claro/30">
                        <span className="text-verde-claro text-[11px] tracking-[1.5px] uppercase font-josefin font-semibold">
                          🎉 ¡Descuento del 5% por 150+ unidades!
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 font-josefin">
                    <div className="flex justify-between text-crema/50 text-sm">
                      <span>Subtotal ({cantidad} unidades)</span>
                      <span>{formatPrice(total)}</span>
                    </div>

                    {ahorro > 0 && (
                      <div className="flex justify-between text-verde-claro text-sm">
                        <span>Descuento por volumen (5%)</span>
                        <span>−{formatPrice(ahorro)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-end pt-3 border-t border-amarillo/15">
                      <span className="text-crema font-bold text-lg">Total Estimado</span>
                      <div className="text-right">
                        <div className="font-bebas text-4xl text-amarillo leading-none drop-shadow-lg">
                          {formatPrice(totalConDescuento)}
                        </div>
                        <div className="text-[10px] text-crema/40 mt-1">
                          Equivale a {formatPrice(totalConDescuento / cantidad)} por unidad
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nota y botón */}
                  <div className="mt-6 text-center">
                    <p className="text-[11px] text-crema/40 mb-4 font-josefin leading-relaxed max-w-md mx-auto">
                      ℹ️ Los precios no incluyen envío ni personalización de empaque. Las cantidades
                      se pueden ajustar en el carrito sin bajar del mínimo de {paqueteActual.cantidadMinima} unidades.
                    </p>

                    {/* Confirmación visual tras agregar */}
                    {agregadoCarrito && (
                      <div className="mb-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-verde/15 border border-verde-claro/40">
                        <span className="text-verde-claro text-[12px] tracking-[2px] uppercase font-josefin font-bold">
                          ✓ ¡{cantidad} unidades agregadas al carrito!
                        </span>
                      </div>
                    )}

                    {/* Botón principal — Agregar al Carrito */}
                    <button
                      onClick={handleAgregarCarrito}
                      className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-amarillo-oscuro to-amarillo text-cafe-oscuro font-josefin font-bold text-[13px] tracking-[3px] uppercase transition-all duration-300 hover:shadow-2xl hover:shadow-amarillo/40 hover:scale-[1.03] active:scale-[0.98] border-none cursor-pointer"
                    >
                      🛒 Agregar al Carrito
                      <span className="text-base">→</span>
                    </button>

                    {/* Opción secundaria — Personalización por WhatsApp */}
                    <div className="mt-5">
                      <a
                        href={`https://wa.me/3107109852?text=${encodeURIComponent(
                          `Hola, me interesa el Paquete ${paqueteActual.nombre} (Nivel ${paqueteActual.nivel}) para regalos corporativos. Quiero ${cantidad} unidades con personalización de logo/empaque. ¿Me pueden dar más información?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] tracking-[2px] uppercase text-crema/40 font-josefin hover:text-amarillo transition-colors border-b border-crema/10 hover:border-amarillo/30 pb-0.5"
                      >
                        💼 ¿Personalización con logo de tu empresa? Cotiza aquí
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Banner inferior premium */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-r from-cafe-medio/20 via-cafe-oscuro to-cafe-medio/20 border border-amarillo/15 p-8 text-center overflow-hidden">
            <span className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amarillo/20 rounded-tl-2xl" />
            <span className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amarillo/20 rounded-br-2xl" />

            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-12 bg-amarillo/40" />
                <span className="text-amarillo text-lg">✦</span>
                <span className="h-px w-12 bg-amarillo/40" />
              </div>
              <p className="font-cormorant italic text-crema/70 text-lg lg:text-xl leading-relaxed mb-2">
                Cada regalo corporativo es una oportunidad para fortalecer lazos y construir
                relaciones duraderas
              </p>
              <p className="font-josefin text-[11px] tracking-[3px] uppercase text-amarillo/50">
                Pedidos exclusivos desde 50 unidades · Personalización disponible
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer premium — Términos y condiciones */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="relative rounded-xl border border-amarillo/15 bg-cafe-oscuro/60 px-6 py-5 overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                <div className="w-9 h-9 rounded-full bg-amarillo/10 border border-amarillo/25 flex items-center justify-center">
                  <span className="text-amarillo text-base">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-josefin text-[11px] tracking-[3px] uppercase text-amarillo/70 font-bold mb-2">
                  Aviso Importante · Términos del Servicio
                </p>
                <p className="font-josefin text-[12px] leading-relaxed text-crema/50">
                  <span className="text-amarillo/80 font-semibold">Envíos y Logística: </span>
                  Los precios publicados corresponden exclusivamente al valor de los productos.
                  Los costos de envío, domicilio y logística de entrega{" "}
                  <span className="text-amarillo/80 font-semibold">
                    corren por cuenta de la empresa contratante del servicio
                  </span>{" "}
                  y no están incluidos en las tarifas mostradas. Para entregas en múltiples sedes,
                  ciudades o direcciones específicas, se generará una cotización de flete por separado
                  según el destino y volumen del pedido. Para más información, contáctanos directamente
                  por WhatsApp o vía correo electrónico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
