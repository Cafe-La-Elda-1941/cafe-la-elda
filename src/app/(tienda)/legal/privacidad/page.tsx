import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de tratamiento y protección de datos personales de Café La Elda 1941.",
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-cafe-oscuro pt-[70px] px-[5%] py-20">
      <div className="max-w-3xl mx-auto">
        {/* Botón volver */}
        <Link href="/#productos" className="inline-flex items-center gap-2 text-amarillo no-underline font-josefin text-sm tracking-wider mb-12 hover:gap-3 transition-all">
          ← Volver a la tienda
        </Link>

        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="font-josefin text-[11px] uppercase tracking-[4px] text-amarillo/60 mb-3">Documento Legal</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-crema mb-4">
            Política de <span className="text-amarillo italic">Privacidad</span>
          </h1>
          <div className="w-20 h-[2px] bg-amarillo mx-auto mb-4" />
          <p className="font-cormorant italic text-crema/50 text-lg">Última actualización: julio de 2025</p>
        </div>

        {/* Introducción */}
        <div className="rounded-lg bg-crema/[0.04] border border-crema/[0.08] p-8 mb-10">
          <p className="font-cormorant text-crema/70 text-lg leading-relaxed">
            En <span className="text-amarillo">Café La Elda 1941</span> valoramos y respetamos tu privacidad. Esta política
            describe cómo recopilamos, usamos, almacenamos y protegemos tus datos personales, en cumplimiento de la
            <span className="text-amarillo"> Ley 1581 de 2012</span> (Ley de Protección de Datos Personales) de la República
            de Colombia y sus decretos reglamentarios.
          </p>
        </div>

        <div className="space-y-10">
          {/* 1 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">01</span>
              Datos que Recopilamos
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed mb-4">
              Recopilamos únicamente la información necesaria para procesar tus pedidos:
            </p>
            <ul className="space-y-2 ml-4">
              {[
                "Nombre completo del comprador.",
                "Número de teléfono (para coordinar entrega por WhatsApp).",
                "Correo electrónico (para enviar confirmación del pedido).",
                "Dirección de envío (ciudad, barrio, calle, número, detalles).",
                "Datos de la transacción (método de pago, productos, valor).",
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed flex gap-3">
                  <span className="text-amarillo mt-1">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">02</span>
              Uso de la Información
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed mb-4">
              Tus datos personales se utilizan exclusivamente para:
            </p>
            <ul className="space-y-2 ml-4">
              {[
                "Procesar y gestionar tus pedidos.",
                "Coordinar la entrega de los productos.",
                "Enviar confirmaciones de compra y seguimiento del envío.",
                "Brindar atención al cliente y resolver inquietudes.",
                "Informarte sobre promociones y nuevos productos (solo si autorizas).",
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed flex gap-3">
                  <span className="text-amarillo mt-1">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">03</span>
              Protección de Datos
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Café La Elda 1941 implementa medidas técnicas, administrativas y físicas para proteger tus datos personales
              contra accesos no autorizados, pérdidas o usos indebidos. La información de pago a través de Bold se procesa
              en una pasarela segura encriptada; nosotros NO almacenamos los datos de tu tarjeta. Los datos de transferencia
              bancaria se manejan con confidencialidad y solo se conservan mientras sea necesario para fines contables y legales.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">04</span>
              Compartir Información
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed mb-4">
              No vendemos ni alquilamos tus datos personales. Solo compartimos la información necesaria con:
            </p>
            <ul className="space-y-2 ml-4">
              {[
                "Empresas de envío y mensajería para la entrega de tu pedido.",
                "Bold (pasarela de pago) exclusivamente para procesar la transacción.",
                "Autoridades competentes cuando sea requerido por ley.",
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed flex gap-3">
                  <span className="text-amarillo mt-1">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">05</span>
              Cookies y Tecnologías Similares
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Nuestro sitio web puede utilizar cookies para mejorar tu experiencia de navegación y recordar los productos
              en tu carrito de compras. Las cookies no contienen información personal identificable. Puedes configurar tu
              navegador para rechazar cookies, aunque algunas funciones del sitio podrían no funcionar correctamente.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">06</span>
              Tus Derechos como Titular de Datos
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed mb-4">
              Conforme a la Ley 1581 de 2012, tienes derecho a:
            </p>
            <ul className="space-y-2 ml-4">
              {[
                "Conocer, actualizar y rectificar tus datos personales.",
                "Solicitar prueba de la autorización otorgada para el tratamiento de tus datos.",
                "Solicitar la supresión de tus datos cuando consideres que el tratamiento no respeta los principios y deberes.",
                "Revocar la autorización del tratamiento de tus datos en cualquier momento.",
                "Presentar quejas ante la Superintendencia de Industria y Comercio.",
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed flex gap-3">
                  <span className="text-amarillo mt-1">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">07</span>
              Autorización
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Al realizar una compra en nuestro sitio web o al proporcionar tus datos a través del formulario de contacto o
              WhatsApp, autorizas de manera consciente, libre, previa y expresa a Café La Elda 1941 para el tratamiento de
              tus datos personales conforme a esta política.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">08</span>
              Menores de Edad
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Nuestros productos y servicios no están dirigidos a menores de edad. No recopilamos deliberadamente datos
              personales de menores de 18 años. Si eres padre o tutor y crees que un menor nos ha proporcionado datos,
              contáctanos para eliminarlos de inmediato.
            </p>
          </section>
        </div>

        {/* Cierre */}
        <div className="mt-16 pt-8 border-t border-crema/[0.08] text-center">
          <p className="font-cormorant italic text-crema/40 text-lg">
            Para ejercer tus derechos sobre datos personales o cualquier consulta de privacidad, contáctanos por WhatsApp al
            <span className="text-amarillo"> +57 310 710 9852 </span>
            o al correo
            <span className="text-amarillo"> laeldacafe1941@gmail.com</span>
          </p>
        </div>

        {/* Botón volver abajo */}
        <div className="text-center mt-16">
          <Link href="/#productos" className="inline-block no-underline font-josefin text-sm uppercase tracking-[3px] px-8 py-4 rounded-sm bg-verde border border-verde-claro text-crema hover:bg-verde-claro transition-colors">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
