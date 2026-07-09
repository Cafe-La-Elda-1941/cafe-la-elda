"use client";

import { useState, useRef } from "react";

interface VideoEmbedProps {
  /** URL completa del embed de Instagram, YouTube o ruta local del video */
  src: string;
  /** Tipo de plataforma */
  platform: "instagram" | "youtube" | "local";
  /** Título descriptivo para accesibilidad */
  title: string;
  /** Clase adicional para el contenedor */
  className?: string;
  /** Ancho máximo del video (default: 380px). Ej: "500px", "100%" */
  maxWidth?: string;
}

/**
 * Componente profesional para embeber videos.
 *
 * Soporta:
 * - Instagram embed (con sandbox que bloquea redirecciones)
 * - YouTube embed
 * - Video local (HTML5 <video> con controles nativos)
 *
 * Características:
 * - Click para cargar/reproducir (mejora performance)
 * - Recuadro con aspect ratio consistente y profesional
 * - Sin redirecciones no deseadas
 */
export function VideoEmbed({
  src,
  platform,
  title,
  className = "",
  maxWidth = "380px",
}: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sandbox: permite scripts y mismo origen para que el video funcione,
  // pero NO permite top-navigation (evita redirección a instagram.com)
  const sandboxAttrs = platform === "instagram"
    ? "allow-scripts allow-same-origin allow-popups"
    : undefined;

  // Etiqueta de plataforma para mostrar
  const platformLabel =
    platform === "instagram" ? "Instagram" :
    platform === "youtube" ? "YouTube" :
    "Café La Elda 1941";

  const platformIcon =
    platform === "instagram" ? "📷 IG" :
    platform === "youtube" ? "▶ YT" :
    "★ CL";

  function handlePlayClick() {
    setLoaded(true);
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      {/* Marco decorativo profesional */}
      <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden shadow-2xl bg-black ring-1 ring-amarillo/20" style={{ maxWidth }}>

        {/* === Video local HTML5 — autoPlay para que funcione con un click === */}
        {platform === "local" && loaded && (
          <video
            ref={videoRef}
            src={src}
            className="absolute inset-0 w-full h-full object-cover"
            controls
            controlsList="nodownload noremoteplayback"
            autoPlay
            playsInline
            preload="auto"
            aria-label={title}
          >
            <p className="text-crema/60 text-sm p-4 text-center">
              Tu navegador no soporta la reproducción de video.
            </p>
          </video>
        )}

        {/* Placeholder con botón de play mientras carga */}
        {!loaded && (
          <button
            onClick={handlePlayClick}
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
                {platformLabel}
              </p>
            </div>
          </button>
        )}

        {/* === iframe para Instagram o YouTube === */}
        {platform !== "local" && loaded && (
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
            {platformIcon}
          </span>
        </div>
      </div>
    </div>
  );
}
