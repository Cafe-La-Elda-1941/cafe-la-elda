"use client";

import { useState, useRef } from "react";

interface VideoEmbedProps {
  /** URL completa del embed de Instagram o YouTube */
  src: string;
  /** Tipo de plataforma */
  platform: "instagram" | "youtube";
  /** Título descriptivo para accesibilidad */
  title: string;
  /** Clase adicional para el contenedor */
  className?: string;
}

/**
 * Componente profesional para embeber videos de Instagram o YouTube.
 *
 * Características:
 * - Bloquea redirecciones no deseadas de Instagram (sandbox sin allow-top-navigation)
 * - Click para cargar el video (mejora performance y evita cargas innecesarias)
 * - Una vez cargado, el video se reproduce sin redirigir a Instagram
 * - Recuadro con aspect ratio consistente y profesional
 */
export function VideoEmbed({
  src,
  platform,
  title,
  className = "",
}: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sandbox: permite scripts y mismo origen para que el video funcione,
  // pero NO permite top-navigation (evita redirección a instagram.com)
  const sandboxAttrs = platform === "instagram"
    ? "allow-scripts allow-same-origin allow-popups"
    : undefined; // YouTube no necesita sandbox restrictivo

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      {/* Marco decorativo profesional */}
      <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl bg-black ring-1 ring-amarillo/20">

        {/* Placeholder con botón de play mientras carga */}
        {!loaded && (
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-cafe-oscuro via-cafe-medio to-cafe-oscuro transition-all hover:from-cafe-medio hover:to-cafe-oscuro group cursor-pointer"
            aria-label={`Reproducir video: ${title}`}
          >
            {/* Icono play */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amarillo/30 blur-xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amarillo-oscuro to-amarillo flex items-center justify-center shadow-2xl shadow-amarillo/40 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-cafe-oscuro ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Texto */}
            <div className="text-center px-4">
              <p className="text-amarillo text-[11px] tracking-[2px] uppercase font-josefin font-bold">
                ▶ Ver Video
              </p>
              <p className="text-crema/40 text-[9px] tracking-[1px] font-josefin mt-1">
                {platform === "instagram" ? "Instagram" : "YouTube"}
              </p>
            </div>
          </button>
        )}

        {/* iframe cargado con sandbox que bloquea redirección */}
        {loaded && (
          <iframe
            src={src}
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
            loading="lazy"
            scrolling="no"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            sandbox={sandboxAttrs}
            title={title}
          />
        )}

        {/* Indicador de plataforma (esquina superior) */}
        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cafe-oscuro/80 backdrop-blur-sm text-[8px] tracking-[1px] uppercase font-josefin text-crema/60">
            {platform === "instagram" ? "📷 IG" : "▶ YT"}
          </span>
        </div>
      </div>
    </div>
  );
}
