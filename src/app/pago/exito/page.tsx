import { ClearCart } from "./ClearCart";

export default function PagoExitoPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-cafe-oscuro text-center">
      <ClearCart />
      <div className="max-w-md">
        <div className="text-7xl mb-6">✅</div>
        <h1 className="font-playfair text-3xl text-amarillo mb-4">¡Pago exitoso!</h1>
        <p className="font-cormorant italic text-lg text-crema/70 mb-8">
          Gracias por tu compra en Café La Elda 1941. Hemos registrado tu pedido correctamente y
          nos pondremos en contacto para coordinar la entrega.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-4 rounded-lg no-underline font-josefin font-semibold tracking-wider text-sm uppercase text-cafe-oscuro bg-amarillo hover:bg-amarillo-oscuro transition-all"
        >
          Volver al inicio
        </a>
      </div>
    </main>
  );
}
