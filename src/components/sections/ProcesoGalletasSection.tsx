import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    num: "01",
    title: "Selección de Ingredientes",
    desc: "Elegimos la mejor harina, mantequilla fresca y nuestro café La Elda molido para darle ese sabor único.",
    image: "/images/proceso-galletas-01-ingredientes.jpg",
  },
  {
    num: "02",
    title: "Mezcla y Amasado",
    desc: "Mezclamos a mano los ingredientes con amor, integrando el café molido para lograr una masa suave y aromática.",
    image: "/images/proceso-galletas-02-amasado.jpg",
  },
  {
    num: "03",
    title: "Corte Artesanal",
    desc: "Damos forma a cada panderosita a mano, una a una, con el tamaño perfecto para acompañar tu taza de café.",
    image: "/images/proceso-galletas-03-corte.jpg",
  },
  {
    num: "04",
    title: "Horneado",
    desc: "Horneamos a temperatura precisa hasta dorarlas perfectamente, logrando ese crunch irresistible.",
    image: "/images/proceso-galletas-04-horneado.jpg",
  },
  {
    num: "05",
    title: "Empaque",
    desc: "Empacamos cuidando cada detalle para que lleguen frescas y crujientes, listas para disfrutar.",
    image: "/images/proceso-galletas-05-empaque.jpg",
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
