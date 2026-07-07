import { SectionHeader } from "@/components/ui/SectionHeader";

export function HistoriaSection() {
  return (
    <section id="historia" className="py-24 px-[5%] bg-crema-oscuro">
      <SectionHeader
        label="Nuestra Historia"
        title="Una familia, un café,"
        titleAccent="una tradición"
        subtitle="Desde las verdes montañas del Eje Cafetero, llevamos décadas honrando el arte del café colombiano."
        centered
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mt-16">
        <div>
          <p className="font-cormorant text-[19px] text-cafe-medio leading-[1.8] mb-5">
            En <strong className="text-verde">1941</strong>, en el corazón del departamento
            de Risaralda, nació Café La Elda de manos de una familia caficultora comprometida con la
            calidad y el respeto por la tierra.
          </p>
          <p className="font-cormorant text-[19px] text-cafe-medio leading-[1.8] mb-5">
            Cultivado en las faldas de la cordillera, nuestro café crece bajo la sombra de árboles
            nativos, con un proceso{" "}
            <strong className="text-verde">100% agroecológico</strong>, sin agroquímicos,
            respetando la biodiversidad y el medio ambiente.
          </p>

          <div className="my-8 py-5 px-6 border-l-4 border-l-amarillo bg-amarillo/[0.06]">
            <blockquote className="font-playfair text-[22px] italic text-cafe-oscuro leading-[1.6]">
              &ldquo;El café es nuestra herencia, nuestra identidad y nuestro compromiso con Colombia
              y el mundo.&rdquo;
            </blockquote>
          </div>

          <p className="font-cormorant text-[19px] text-cafe-medio leading-[1.8]">
            Hoy, Café La Elda es sinónimo de{" "}
            <strong className="text-verde">sabor auténtico</strong>, calidad artesanal y
            tradición familiar que se transmite de generación en generación, con el sello de{" "}
            <em>Hecho en Risaralda</em> y certificación CARDER.
          </p>
        </div>

        <div className="relative h-[400px] lg:h-[520px]">
          <div className="absolute top-0 right-0 w-3/4 h-[380px] rounded overflow-hidden shadow-[0_20px_60px_rgba(44,24,16,0.3)]">
            <img
              src="/images/cultivadores-cafe.png"
              alt="Cultivadores de café La Elda"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-5 left-5 py-2 px-4 rounded-sm uppercase tracking-[2px] text-[11px] bg-verde text-crema">
              Finca Buenos Aires · Dosquebradas · Risaralda
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-[55%] h-[240px] rounded overflow-hidden shadow-[0_20px_60px_rgba(44,24,16,0.3)] border-4 border-crema-oscuro">
            <img
              src="/images/tradicion-cafetera.png"
              alt="Tradición cafetera colombiana"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
