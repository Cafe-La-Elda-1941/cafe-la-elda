import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    num: "01",
    title: "Selección de Ingredientes",
    desc: "Elegimos la mejor harina, mantequilla fresca y nuestro café La Elda molido para darle ese sabor único.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Artisanal%20cookie%20ingredients%20on%20rustic%20wooden%20table%2C%20flour%2C%20butter%2C%20ground%20coffee%20in%20bowl%2C%20sugar%2C%20eggs%2C%20warm%20natural%20light%2C%20Colombian%20farm%20kitchen%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "02",
    title: "Mezcla y Amasado",
    desc: "Mezclamos a mano los ingredientes con amor, integrando el café molido para lograr una masa suave y aromática.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hands%20kneading%20coffee%20cookie%20dough%20on%20wooden%20table%2C%20brown%20coffee%20speckled%20dough%2C%20flour%20dusted%20surface%2C%20artisanal%20bakery%20process%2C%20warm%20light%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "03",
    title: "Corte Artesanal",
    desc: "Damos forma a cada panderosita a mano, una a una, con el tamaño perfecto para acompañar tu taza de café.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Small%20round%20coffee%20cookies%20being%20cut%20and%20shaped%20by%20hand%20on%20wooden%20board%2C%20artisanal%20cookie%20making%2C%20coffee%20flavored%20cookies%2C%20rustic%20kitchen%2C%20warm%20light%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "04",
    title: "Horneado",
    desc: "Horneamos a temperatura precisa hasta dorarlas perfectamente, logrando ese crunch irresistible.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Freshly%20baked%20coffee%20cookies%20in%20rustic%20oven%2C%20golden%20brown%20round%20cookies%20baking%2C%20warm%20oven%20light%2C%20artisanal%20bakery%2C%20steam%20rising%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
  {
    num: "05",
    title: "Empaque",
    desc: "Empacamos cuidando cada detalle para que lleguen frescas y crujientes, listas para disfrutar.",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Artisanal%20coffee%20cookies%20packaged%20in%20kraft%20paper%20bags%20with%20rustic%20label%2C%20Colombian%20artisanal%20product%20packaging%2C%20wooden%20table%2C%20warm%20light%2C%20realistic%20photograph%2C%20high%20detail&image_size=landscape_4_3",
  },
];

export function ProcesoGalletasSection() {
  return (
    <section id="proceso-galletas" className="py-24 px-[5%] bg-cafe-oscuro">
      <SectionHeader
        label="El Arte de Nuestras Galletas"
        title="Proceso de nuestras"
        titleAccent="Panderositas"
        subtitle="Deliciosas galletas artesanales de café, hechas a mano con ingredientes naturales y el toque inconfundible de Café La Elda."
        centered
        dark
        accentColor="amarillo"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-16">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex flex-col rounded-lg overflow-hidden bg-verde/[0.3] border border-amarillo/15 transition-all duration-300 hover:-translate-y-2 hover:border-amarillo/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
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
