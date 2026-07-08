import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    num: "01",
    title: "Selección del Café",
    desc: "Elegimos los mejores granos de café La Elda, tostados al punto perfecto para resaltar su aroma y sabor.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Premium%20roasted%20coffee%20beans%20selection%20on%20rustic%20wooden%20surface%2C%20dark%20roasted%20Colombian%20coffee%20beans%20in%20burlap%20sack%2C%20warm%20natural%20light%2C%20artisanal%20process%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "02",
    title: "Chocolate Artesanal",
    desc: "Preparamos el chocolate artesanal colombiano fundiéndolo a temperatura exacta para lograr una cobertura sedosa.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Artisanal%20Colombian%20chocolate%20melting%20in%20double%20boiler%2C%20rich%20dark%20chocolate%20being%20melted%2C%20smooth%20glossy%20chocolate%2C%20rustic%20kitchen%2C%20warm%20light%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "03",
    title: "Cobertura de Café",
    desc: "Cubrimos cada grano de café tostado con el chocolate artesanal, logrando el equilibrio perfecto entre lo amargo y lo dulce.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Coffee%20beans%20being%20coated%20with%20melted%20chocolate%2C%20artisanal%20chocolate%20covered%20coffee%20beans%2C%20drizzling%20chocolate%20over%20roasted%20coffee%20beans%2C%20rustic%20surface%2C%20warm%20light%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "04",
    title: "Enfriado",
    desc: "Dejamos reposar el Chocoffee hasta que el chocolate se endurece, creando una capa crujiente e irresistible.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Chocolate%20covered%20coffee%20beans%20cooling%20on%20parchment%20paper%2C%20glossy%20dark%20chocolate%20coating%20hardening%2C%20artisanal%20confection%2C%20rustic%20wooden%20table%2C%20natural%20light%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "05",
    title: "Empaque",
    desc: "Empacamos con cuidado para preservar el crunch y la frescura de cada grano de Chocoffee La Elda.",
    image: "/images/proceso-chocoffee-empaque.png",
  },
];

export function ProcesoChocoffeeSection() {
  return (
    <section id="proceso-chocoffee" className="py-24 px-[5%] bg-verde">
      <SectionHeader
        label="Donde el Café se Vuelve Dulce"
        title="Proceso de nuestro"
        titleAccent="Chocoffee"
        subtitle="La mezcla perfecta entre nuestro café tostado y el chocolate artesanal colombiano. Un manjar irresistible creado con pasión."
        centered
        dark
        accentColor="amarillo"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-16">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex flex-col rounded-lg overflow-hidden bg-cafe-oscuro/[0.4] border border-amarillo/15 transition-all duration-300 hover:-translate-y-2 hover:border-amarillo/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute top-3 left-3 w-11 h-11 rounded-full flex items-center justify-center bg-cafe-oscuro/90 border-[2px] border-amarillo font-bebas text-amarillo text-2xl">
                {step.num}
              </span>
            </div>
            <div className="flex flex-col flex-1 p-5">
              <h4 className="font-playfair text-lg text-crema mb-2">{step.title}</h4>
              <p className="font-cormorant italic text-sm text-crema/65 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
