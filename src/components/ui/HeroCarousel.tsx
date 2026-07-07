"use client";

import { useCallback, useEffect, useState } from "react";

interface SlideConfig {
  src: string;
  alt: string;
  position: string;
  kenburns: string;
  fit?: "cover" | "contain";
  background?: string;
}

interface HeroCarouselProps {
  interval?: number;
}

const slides: SlideConfig[] = [
  {
    src: "/images/slide1.png",
    alt: "Cultivo de café La Elda en Risaralda",
    position: "center center",
    kenburns: "kenburns-center",
  },
  {
    src: "/images/slide2.png",
    alt: "La familia cafetera de Café La Elda",
    position: "center center",
    kenburns: "kenburns-center",
    fit: "contain",
    background:
      "radial-gradient(ellipse at center, #3a2418 0%, #2c1810 70%, #1a0f08 100%)",
  },
  {
    src: "/images/slide3.jpeg",
    alt: "Taza de café recién preparado",
    position: "center 40%",
    kenburns: "kenburns-3",
  },
  {
    src: "/images/slide4.jpg",
    alt: "Finca cafetera La Elda",
    position: "center 35%",
    kenburns: "kenburns-4",
  },
];

export function HeroCarousel({ interval = 6000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const goTo = (index: number) => setCurrent(index);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(goNext, interval);
    return () => clearInterval(timer);
  }, [isPaused, interval, goNext]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, i) => {
        const isActive = i === current;
        const fit = slide.fit ?? "cover";
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              background: slide.background ?? "transparent",
            }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full will-change-transform mx-auto"
              style={{
                objectFit: fit,
                objectPosition: slide.position,
                animation: isActive
                  ? `${slide.kenburns} ${interval + 2000}ms ease-out both`
                  : "none",
              }}
            />
          </div>
        );
      })}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(26,15,8,0.45) 100%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          background:
            "linear-gradient(180deg, rgba(44,24,16,0.18) 0%, transparent 30%, transparent 70%, rgba(26,15,8,0.35) 100%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none bg-gradient-to-t from-cafe-oscuro/70 to-transparent" />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
            className="group relative h-[3px] w-14 sm:w-16 overflow-hidden rounded-full bg-crema/25 transition-all duration-300 cursor-pointer border-none"
          >
            <span
              className="absolute inset-0 origin-left bg-amarillo"
              style={{
                animation:
                  i === current && !isPaused
                    ? `progressFill ${interval}ms linear forwards`
                    : "none",
                transform: i < current ? "scaleX(1)" : "scaleX(0)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
