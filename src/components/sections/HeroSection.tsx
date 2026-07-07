import { HeroCarousel } from "@/components/ui/HeroCarousel";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="min-h-screen relative flex items-center overflow-hidden pt-[70px] bg-cafe-oscuro"
    >
      <HeroCarousel interval={6000} />

      <div className="absolute top-[100px] left-6 sm:left-10 flex flex-col items-center gap-3 z-20 pointer-events-none select-none">
        <span className="font-josefin text-crema/50 text-[9px] tracking-[4px] uppercase [writing-mode:vertical-rl] rotate-180">
          Risaralda · Colombia
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-amarillo/70 to-transparent" />
      </div>

      <div className="absolute top-[110px] right-6 sm:right-10 flex flex-col items-end gap-2 z-20 pointer-events-none select-none">
        <span className="font-playfair italic text-crema/70 text-sm tracking-wide">
          La Elda
        </span>
        <span className="font-bebas text-amarillo text-2xl tracking-[3px] leading-none">
          1941
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-amarillo/60 to-transparent mt-1" />
      </div>
    </section>
  );
}
