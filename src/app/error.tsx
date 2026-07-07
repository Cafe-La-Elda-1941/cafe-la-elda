"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0f0a06] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amarillo font-playfair text-[12px] font-black text-verde border-2 border-verde mb-6">
          la<br />Elda
        </div>

        <h1 className="font-playfair text-crema text-3xl font-bold mb-3">
          ¡Ups! Algo salió mal
        </h1>

        <p className="text-crema/50 font-josefin text-sm mb-8">
          Hubo un error inesperado. Puedes intentar nuevamente o volver al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-amarillo text-verde font-josefin font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-amarillo/90 transition-colors cursor-pointer"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="border border-amarillo/30 text-crema font-josefin font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-amarillo/10 transition-colors no-underline"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
