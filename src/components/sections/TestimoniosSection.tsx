import { SectionHeader } from "@/components/ui/SectionHeader";

const testimonios = [
  {
    text: "El mejor café que he tomado en mi vida. El arequipe de café es simplemente extraordinario. Una tradición que se nota en cada sorbo.",
    name: "María Fernanda G.",
    loc: "Pereira, Risaralda",
    initial: "M",
    producto: "Arequipe de Café",
  },
  {
    text: "Compro el café La Elda desde hace años. La calidad es incomparable, el Chocoffee me lo recomendaron y ahora no puedo vivir sin él.",
    name: "Carlos Andrés M.",
    loc: "Medellín, Antioquia",
    initial: "C",
    producto: "Chocoffee",
  },
  {
    text: "Las Panderositas de café son una maravilla. Las pido cada mes como regalo. Producto colombiano de altísima calidad, se nota el amor en cada detalle.",
    name: "Laura Jiménez P.",
    loc: "Bogotá, D.C.",
    initial: "L",
    producto: "Panderositas",
  },
  {
    text: "El vino de café con uva isabelina es una joya escondida del Eje Cafetero. Cuerpo sedoso, aroma envolvente. Lo serví en una cena y todos preguntaron dónde lo conseguí.",
    name: "Andrés Felipe R.",
    loc: "Cali, Valle del Cauca",
    initial: "A",
    producto: "Vino de Café 750ml",
  },
  {
    text: "Llevo más de dos años consumiendo el café Familiar 500g. El sabor agroecológico se siente, es un café limpio, dulce y con una acidez perfecta. Mi cliente favorito del Eje Cafetero.",
    name: "Diana Carolina V.",
    loc: "Armenia, Quindío",
    initial: "D",
    producto: "Café Familiar 500g",
  },
  {
    text: "El Totumo de Arequipe es el regalo perfecto. Lo llevé a España para mi familia y fue un éxito. Sabor auténtico colombiano, artesanal y con historia en cada totumo.",
    name: "Johan Stiven Q.",
    loc: "Madrid, España",
    initial: "J",
    producto: "Totumo de Arequipe",
  },
];

export function TestimoniosSection() {
  return (
    <section id="testimonios" className="py-24 px-[5%] bg-crema-oscuro">
      <SectionHeader
        label="Lo que dicen de nosotros"
        title="Voces de"
        titleAccent="nuestra familia"
        subtitle="Clientes de Colombia y del mundo que han vivido la experiencia Café La Elda 1941."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-7xl mx-auto">
        {testimonios.map((t) => (
          <div
            key={t.name}
            className="p-8 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(44,24,16,0.14)] bg-blanco shadow-[0_4px_30px_rgba(44,24,16,0.08)] border-b-[3px] border-b-verde flex flex-col"
          >
            {/* Estrellas y comilla decorativa */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-amarillo text-lg">★★★★★</div>
              <span className="font-playfair text-5xl text-verde/15 leading-none select-none">&ldquo;</span>
            </div>

            {/* Texto del testimonio */}
            <p className="font-cormorant italic text-lg text-cafe-medio leading-[1.7] mb-6 flex-grow">
              {t.text}
            </p>

            {/* Etiqueta del producto mencionado */}
            <div className="mb-5">
              <span className="inline-block text-[10px] tracking-[2px] uppercase text-verde-claro bg-verde/10 px-3 py-1.5 rounded-full font-josefin">
                {t.producto}
              </span>
            </div>

            {/* Información del cliente */}
            <div className="flex items-center gap-3 pt-5 border-t border-cafe-oscuro/10">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-verde font-playfair text-lg text-crema font-bold shrink-0">
                {t.initial}
              </div>
              <div className="min-w-0">
                <div className="font-josefin font-semibold text-sm text-cafe-oscuro">{t.name}</div>
                <div className="text-xs tracking-wider text-cafe-oscuro/50">{t.loc}</div>
              </div>
              <div className="ml-auto text-amarillo text-base" title="Cliente verificado">
                ✓
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner inferior con estadísticas */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <div className="text-center">
            <div className="font-playfair text-3xl font-bold text-verde">★ 5.0</div>
            <div className="text-[11px] tracking-[2px] uppercase text-cafe-medio/60 mt-1 font-josefin">Calificación promedio</div>
          </div>
          <div className="w-px h-12 bg-cafe-oscuro/10" />
          <div className="text-center">
            <div className="font-playfair text-3xl font-bold text-verde">+500</div>
            <div className="text-[11px] tracking-[2px] uppercase text-cafe-medio/60 mt-1 font-josefin">Clientes felices</div>
          </div>
          <div className="w-px h-12 bg-cafe-oscuro/10" />
          <div className="text-center">
            <div className="font-playfair text-3xl font-bold text-verde">3</div>
            <div className="text-[11px] tracking-[2px] uppercase text-cafe-medio/60 mt-1 font-josefin">Países alcanzados</div>
          </div>
        </div>
      </div>
    </section>
  );
}
