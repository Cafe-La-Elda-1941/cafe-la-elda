import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f0a06] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amarillo font-playfair text-[12px] font-black text-verde border-2 border-verde mb-6">
          la<br />Elda
        </div>

        {/* Número 404 */}
        <h1 className="font-playfair text-[120px] leading-none text-amarillo/20 font-black mb-2">
          404
        </h1>

        <h2 className="font-playfair text-crema text-2xl font-bold mb-3">
          Esta página no existe
        </h2>

        <p className="text-crema/50 font-josefin text-sm mb-8">
          Puede que la página haya sido movida o que el enlace sea incorrecto.
          Pero no te preocupes, nuestro café sigue aquí.
        </p>

        <Link
          href="/"
          className="inline-block bg-amarillo text-verde font-josefin font-bold text-sm uppercase tracking-wider px-8 py-3 rounded-lg hover:bg-amarillo/90 transition-colors no-underline"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
