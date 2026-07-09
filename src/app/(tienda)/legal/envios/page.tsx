import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Envíos y Devoluciones",
  description: "Política de envíos, entregas, cambios y devoluciones de Café La Elda 1941.",
};

export default function EnviosPage() {
  return (
    <main className="min-h-screen bg-cafe-oscuro pt-[70px] px-[5%] py-20">
      <div className="max-w-3xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="font-josefin text-[11px] uppercase tracking-[4px] text-amarillo/60 mb-3">Documento Legal</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-crema mb-4">
            Envíos y <span className="text-amarillo italic">Devoluciones</span>
          </h1>
          <div className="w-20 h-[2px] bg-amarillo mx-auto mb-4" />
          <p className="font-cormorant italic text-crema/50 text-lg">Última actualización: julio de 2025</p>
        </div>

        {/* Introducción */}
        <div className="rounded-lg bg-crema/[0.04] border border-crema/[0.08] p-8 mb-10">
          <p className="font-cormorant text-crema/70 text-lg leading-relaxed">
            En <span className="text-amarillo">Café La Elda 1941</span> queremos que disfrutes tus productos desde el primer
            momento. A continuación te explicamos cómo gestionamos los envíos, las entregas y los procesos de devolución
            y cambio, para que tu experiencia de compra sea siempre excelente.
          </p>
        </div>

        <div className="space-y-10">
          {/* 1 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">01</span>
              Cobertura de Envíos
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed mb-4">
              Realizamos envíos a todo el territorio nacional:
            </p>
            <ul className="space-y-2 ml-4">
              {[
                { t: "Envíos nacionales:", d: "Cobertura en todas las ciudades y municipios de Colombia a través de empresas de mensajería certificada." },
                { t: "Entrega local (Dosquebradas, Pereira y alrededores):", d: "Coordinamos entrega directa o punto de recogida." },
                { t: "Regalos corporativos:", d: "Entregas múltiples a diferentes direcciones dentro de una misma ciudad (sujeto a acuerdo previo)." },
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed flex gap-3">
                  <span className="text-amarillo mt-1">◆</span>
                  <span><span className="text-amarillo font-semibold">{item.t}</span> {item.d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">02</span>
              Tiempos de Entrega
            </h2>
            <div className="overflow-hidden rounded-lg border border-crema/[0.08]">
              <table className="w-full text-left">
                <thead className="bg-crema/[0.06]">
                  <tr>
                    <th className="font-josefin text-amarillo text-sm uppercase tracking-wider px-6 py-4">Destino</th>
                    <th className="font-josefin text-amarillo text-sm uppercase tracking-wider px-6 py-4">Tiempo Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-crema/[0.06]">
                  <tr>
                    <td className="font-cormorant text-crema/60 text-lg px-6 py-4">Dosquebradas / Pereira</td>
                    <td className="font-cormorant text-crema/60 text-lg px-6 py-4">1 a 2 días hábiles</td>
                  </tr>
                  <tr>
                    <td className="font-cormorant text-crema/60 text-lg px-6 py-4">Ciudades principales</td>
                    <td className="font-cormorant text-crema/60 text-lg px-6 py-4">2 a 4 días hábiles</td>
                  </tr>
                  <tr>
                    <td className="font-cormorant text-crema/60 text-lg px-6 py-4">Municipios y zonas alejadas</td>
                    <td className="font-cormorant text-crema/60 text-lg px-6 py-4">4 a 7 días hábiles</td>
                  </tr>
                  <tr>
                    <td className="font-cormorant text-crema/60 text-lg px-6 py-4">Regalos corporativos</td>
                    <td className="font-cormorant text-crema/60 text-lg px-6 py-4">5 a 10 días hábiles (según cantidad)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-cormorant italic text-crema/40 text-base mt-3">
              * Los tiempos comienzan a contar a partir de la confirmación del pago. No incluyen fines de semana ni días festivos.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">03</span>
              Costos de Envío
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Los costos de envío se calculan según la ciudad de destino y el peso del paquete. Este valor se te informará
              al momento de coordinar tu pedido por WhatsApp, antes de confirmar la compra. Para envíos locales en
              Dosquebradas y Pereira, aplican tarifas especiales. Los regalos corporativos pueden incluir envío gratuito
              según el volumen del pedido.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">04</span>
              Seguimiento del Pedido
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Una vez que despachamos tu pedido, te enviamos por WhatsApp el número de guía de la empresa de mensajería
              para que puedas rastrear tu envío en tiempo real. Si tienes alguna pregunta sobre el estado de tu pedido,
              no dudes en contactarnos.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">05</span>
              Devoluciones y Cambios
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed mb-4">
              Tu satisfacción es nuestra prioridad. Aceptamos cambios y devoluciones bajo las siguientes condiciones:
            </p>
            <div className="space-y-4 ml-4">
              <div className="rounded-lg bg-crema/[0.03] p-5 border-l-2 border-amarillo">
                <p className="font-josefin text-amarillo text-sm uppercase tracking-wider mb-2">Producto defectuoso o dañado</p>
                <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
                  Si recibes un producto en mal estado, debes contactarnos dentro de las <span className="text-amarillo">72 horas</span> siguientes
                  a la recepción, enviando una foto del producto y el empaque por WhatsApp. Te enviaremos un reemplazo sin costo o reembolsaremos tu dinero.
                </p>
              </div>
              <div className="rounded-lg bg-crema/[0.03] p-5 border-l-2 border-amarillo">
                <p className="font-josefin text-amarillo text-sm uppercase tracking-wider mb-2">Producto equivocado</p>
                <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
                  Si recibiste un producto distinto al que pediste, contáctanos dentro de los <span className="text-amarillo">5 días hábiles</span>.
                  Coordinaremos el cambio a nuestra cuenta sin costo adicional para ti.
                </p>
              </div>
              <div className="rounded-lg bg-crema/[0.03] p-5 border-l-2 border-amarillo">
                <p className="font-josefin text-amarillo text-sm uppercase tracking-wider mb-2">Producto en buen estado</p>
                <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
                  Por tratarse de productos alimentarios, <span className="text-amarillo">no aceptamos devoluciones por cambio de opinión</span> si
                  el producto está en perfecto estado y su empaque original sellado no ha sido abierto.
                </p>
              </div>
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">06</span>
              Requisitos para una Devolución
            </h2>
            <ul className="space-y-2 ml-4">
              {[
                "El producto debe estar en su empaque original.",
                "Incluir la factura o comprobante de compra.",
                "Reportar el inconveniente dentro del plazo establecido.",
                "Enviar evidencia fotográfica del producto dañado o incorrecto.",
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed flex gap-3">
                  <span className="text-amarillo mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">07</span>
              Reembolsos
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed">
              Los reembolsos se procesan una vez que recibimos y revisamos el producto devuelto. El reembolso se realizará
              por el mismo medio de pago utilizado en la compra (Bold, transferencia o coordinación por WhatsApp) en un
              plazo máximo de <span className="text-amarillo">10 días hábiles</span>.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-playfair text-2xl text-crema mb-4 flex items-center gap-3">
              <span className="text-amarillo font-bebas text-3xl">08</span>
              Productos No Retornables
            </h2>
            <p className="font-cormorant text-crema/60 text-lg leading-relaxed mb-4">
              Por normativa sanitaria y de inocuidad alimentaria, los siguientes productos no son retornables:
            </p>
            <ul className="space-y-2 ml-4">
              {[
                "Productos alimentarios con empaque abierto o roto.",
                "Café molido o en grano con sello de seguridad violado.",
                "Productos personalizados o de pedidos corporativos.",
                "Productos en promoción o liquidación.",
              ].map((item, i) => (
                <li key={i} className="font-cormorant text-crema/60 text-lg leading-relaxed flex gap-3">
                  <span className="text-rojo mt-1">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Cierre */}
        <div className="mt-16 pt-8 border-t border-crema/[0.08] text-center">
          <p className="font-cormorant italic text-crema/40 text-lg">
            Para solicitar un cambio, devolución o reembolso, contáctanos por WhatsApp al
            <span className="text-amarillo"> +57 310 710 9852 </span>
            o al correo
            <span className="text-amarillo"> laeldacafe1941@gmail.com</span>
          </p>
        </div>
      </div>
    </main>
  );
}
