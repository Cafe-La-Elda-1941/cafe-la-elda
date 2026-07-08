import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    num: "01",
    title: "Cultivo",
    desc: "Semillas seleccionadas, cultivadas en suelos volcánicos del Eje Cafetero sin agroquímicos.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Coffee%20plant%20cultivation%20in%20Colombian%20Andes%20mountains%2C%20green%20coffee%20plants%20with%20red%20ripe%20cherries%20on%20volcanic%20soil%2C%20lush%20coffee%20farm%2C%20natural%20daylight%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "02",
    title: "Cosecha",
    desc: "Recolección manual en el punto exacto de madurez para garantizar el mejor sabor.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Coffee%20cherry%20hand%20harvesting%2C%20Colombian%20coffee%20picker%20collecting%20red%20ripe%20coffee%20cherries%20by%20hand%20into%20a%20basket%2C%20traditional%20coffee%20farm%2C%20warm%20natural%20light%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "03",
    title: "Secado",
    desc: "Secado natural al sol en marquesinas durante el tiempo necesario para el perfil ideal.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Coffee%20beans%20drying%20naturally%20under%20the%20sun%20on%20raised%20beds%20at%20a%20Colombian%20coffee%20farm%2C%20golden%20sunlight%2C%20rural%20marquesina%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "04",
    title: "Tostión",
    desc: "Tostión artesanal controlada que resalta los aromas florales y el cuerpo achocolatado.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Artisan%20coffee%20roasting%2C%20freshly%20roasted%20coffee%20beans%20pouring%20from%20an%20industrial%20drum%20roaster%2C%20warm%20glowing%20light%2C%20steam%20and%20aroma%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "05",
    title: "Empaque",
    desc: "Empacado al vacío preservando frescura, aroma y sabor hasta llegar a tu hogar.",
    image: "/images/proceso-cafe-05-empaque.jpg",
  },
];

export function ProcesoSection() {
  return (
    <section id="proceso" className="py-24 px-[5%] bg-verde">
      <SectionHeader
        label="Del Campo a Tu Taza"
        title="Nuestro proceso"
        titleAccent="artesanal"
        subtitle="Cada grano de café La Elda pasa por un cuidadoso proceso que garantiza la máxima calidad y sabor en tu taza."
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
            <div className="relative aspect-[4/3] overflow-hidden bg-cafe-oscuro">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
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
