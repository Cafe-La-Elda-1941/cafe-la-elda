import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso del sitio web de Café La Elda 1941.",
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-cafe-oscuro pt-[70px] px-[5%] py-20">
      <div className="max-w-3xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="font-josefin text-[11px] uppercase tracking-[4px] text-amarillo/60 mb-3">Documento Legal</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-crema mb-4">
            Términos y <span className="text-amarillo italic">Condiciones</span>
          </h1>
          <div className="w-20 h-[2px] bg-amarillo mx-auto mb-4" />
          <p className="font-cormorant italic text-crema/50 text-lg">Última actualización: julio de 2025</p>
        </div>

        {/* Introducción */}
        <div className="rounded-lg bg-crema/[0.04] border border-crema/[0.08] p-8 mb-10">
          <p className="font-cormorant text-crema/70 text-lg leading-relaxed">
            Bienvenido a <span className="text-amarillo">Café La Elda 1941</span>. Al acceder y utilizar nuestro sitio web,
            aceptas en su totalidad los presentes términos y condiciones. Te recomendamos leerlos cuidadosamente antes de
            realizar cualquier compra.
          </p>
        </div>

        {/* Contenido */}
        <div className="space-y-10">
          {/* 1 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">01</span>
              Aceptación de los Términos
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              El acceso y uso de este sitio web implica la aceptación plena e incondicional de estos términos y condiciones.
              Si no estás de acuerdo con alguno de ellos, te pedimos que no utilices nuestro sitio ni nuestros servicios.
              Café La Elda 1941 se reserva el derecho de modificar estos términos en cualquier momento, siendo responsabilidad
              del usuario revisarlos periódicamente.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">02</span>
              Descripción del Servicio
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Café La Elda 1941 es una plataforma de comercio electrónico que ofrece productos derivados del café,
              incluyendo café en grano y molido, derivados artesanales, combos, colecciones y regalos corporativos.
              Nuestros productos son elaborados de forma artesanal en Dosquebradas, Risaralda, Colombia.
              Los pedidos se realizan a través del sitio web y pueden pagarse mediante Bold, transferencia bancaria
              o vía WhatsApp.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">03</span>
              Productos y Precios
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed mb-4">
              Todos los productos mostrados en el sitio están sujetos a disponibilidad de stock. Los precios publicados
              corresponden exclusivamente al valor de los productos y están expresados en pesos colombianos (COP).
            </p>
            <ul className="space-y-2 ml-4">
              {[
                "Los costos de envío y domicilio NO están incluidos y se calculan por separado según la ciudad de destino.",
                "Los precios pueden cambiar sin previo aviso. El precio vigente es el que aparece al momento de realizar la compra.",
                "Las imágenes de los productos son referenciales y pueden presentar ligeras variaciones respecto al producto final.",
                "Para regalos corporativos, los precios y cantidades mínimas se acuerdan según la personalización solicitada.",
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed flex gap-3">
                  <span className="text-amarillo mt-1">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">04</span>
              Proceso de Compra
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed mb-4">
              El proceso de compra consta de los siguientes pasos:
            </p>
            <ol className="space-y-3 ml-4">
              {[
                "Selecciona los productos y agrégaselos al carrito de compras.",
                "Revisa tu pedido y selecciona el método de pago (Bold, transferencia o WhatsApp).",
                "Si pagas con Bold, serás redirigido a una pasarela de pago segura.",
                "Si pagas por transferencia, realiza el depósito a la cuenta indicada y confirma por WhatsApp.",
                "Una vez confirmado el pago, procesamos y enviamos tu pedido.",
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed flex gap-3">
                  <span className="text-amarillo font-semibold shrink-0">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">05</span>
              Métodos de Pago
            </h2>
            <ul className="space-y-3 ml-4">
              {[
                { t: "Bold:", d: "Pasarela de pago en línea con tarjetas débito y crédito. El pago se procesa de forma segura e inmediata." },
                { t: "Transferencia Bancolombia:", d: "Cuenta de ahorros No. 91270334305 a nombre de Johana Ramírez Flórez. Debes enviar el comprobante por WhatsApp." },
                { t: "WhatsApp:", d: "Coordinas el pago y la entrega directamente con nuestro equipo por WhatsApp al +57 310 710 9852." },
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed">
                  <span className="text-amarillo font-semibold">{item.t}</span> {item.d}
                </li>
              ))}
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">06</span>
              Propiedad Intelectual
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Todos los contenidos de este sitio web, incluyendo pero no limitado a textos, imágenes, logotipos, diseños,
              videos, marcas y código fuente, son propiedad exclusiva de Café La Elda 1941 o de terceros que han autorizado
              su uso. Queda prohibida la reproducción, distribución o modificación total o parcial sin autorización expresa
              y por escrito.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">07</span>
              Limitación de Responsabilidad
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Café La Elda 1941 no se hace responsable por interrupciones del servicio por causas de fuerza mayor,
              fallas técnicas de terceros (pasarelas de pago, empresas de envío) o por el uso inadecuado del sitio.
              Tampoco respondemos por información falsa proporcionada por el usuario al momento de realizar su compra.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">08</span>
              Legislación Aplicable
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa o reclamación derivada
              del uso de este sitio será resuelta preferentemente de forma amistosa, y en su defecto, ante las autoridades
              competentes de Dosquebradas, Risaralda.
            </p>
          </section>
        </div>

        {/* Cierre */}
        <div className="mt-16 pt-8 border-t border-crema/[0.08] text-center">
          <p className="font-cormorant italic text-crema/40 text-lg">
            Para cualquier inquietud sobre estos términos, contáctanos por WhatsApp al
            <span className="text-amarillo"> +57 310 710 9852 </span>
            o al correo
            <span className="text-amarillo"> laeldacafe1941@gmail.com</span>
          </p>
        </div>
      </div>
    </main>
  );
}
