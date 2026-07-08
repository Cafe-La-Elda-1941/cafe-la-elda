import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoEmbed } from "@/components/ui/VideoEmbed";

const aliadoPrincipal = {
  nombre: "Ingenio Risaralda",
  iniciales: "IR",
  tipo: "Aliado Principal · Desarrollo Empresarial",
  desc: "Aliado invaluable para Café La Elda 1941. Gracias a las ferias y eventos apoyados por el Ingenio Risaralda y su fundación FUNDEAGRO, hemos conquistado un mercado espectacular, llevando el sabor de nuestro café a nuevos hogares. Su acompañamiento en el fortalecimiento de la educación y los apoyos de capital semilla han sido pilares fundamentales en nuestro crecimiento empresarial.",
  imagen: "/images/ingenio-risaralda.png",
  etiquetas: ["Ferias & Eventos", "FUNDEAGRO", "Educación", "Capital Semilla"],
};

const aliadoDestacado = {
  nombre: "Compromiso Rural",
  iniciales: "CR",
  tipo: "Aliado Destacado · Programa ASOCAÑA",
  desc: "Programa de la Asociación para cultivadores de caña ASOCAÑA, en alianza con Ingenio Risaralda. Gracias a este acompañamiento hemos recorrido gran parte del Valle del Cauca en ferias y eventos, llevando el sabor de Café La Elda 1941 a nuevos públicos y consolidando la visibilidad de nuestra marca en cada escenario.",
  imagen: "/images/compromiso-rural.png",
  etiquetas: ["Ferias & Eventos", "Alianza ASOCAÑA", "Valle del Cauca", "Visibilidad de Marca"],
};

export function AliadosSection() {
  return (
    <section id="aliados" className="py-24 px-[5%] bg-cafe-oscuro relative overflow-hidden">
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-amarillo/60 to-transparent" />

      <SectionHeader
        label="Red de confianza y desarrollo empresarial"
        title="Nuestros"
        titleAccent="aliados estratégicos"
        subtitle="El respaldo de instituciones que creyeron en el café colombiano desde el primer día."
        centered
        dark
        accentColor="amarillo"
      />

      {/* === Bloque narrativo de impacto === */}
      <div className="mt-14 max-w-4xl mx-auto text-center">
        {/* Cita destacada */}
        <blockquote className="relative px-6 md:px-12">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-playfair text-7xl text-amarillo/30 leading-none select-none">
            &ldquo;
          </span>
          <p className="font-cormorant italic text-[20px] md:text-[22px] text-crema/90 leading-relaxed">
            El crecimiento de <span className="text-amarillo not-italic font-josefin font-semibold">Café La Elda 1941</span> ha sido posible gracias a la confianza de empresas, instituciones y aliados que creyeron en nuestro trabajo desde el primer día.
          </p>
          {/* Separador decorativo */}
          <div className="flex items-center justify-center gap-3 mt-7">
            <span className="h-px w-14 bg-amarillo/30" />
            <span className="text-amarillo text-sm">✦</span>
            <span className="h-px w-14 bg-amarillo/30" />
          </div>
        </blockquote>

        {/* Párrafos de credibilidad */}
        <div className="mt-8 space-y-5 max-w-3xl mx-auto">
          <p className="font-josefin text-[15px] md:text-[16px] text-crema/65 leading-[1.9]">
            En <span className="text-crema font-semibold">Café La Elda 1941</span> valoramos profundamente a las organizaciones que nos han acompañado en nuestro proceso de <span className="text-amarillo">crecimiento, innovación y fortalecimiento empresarial</span>. Su respaldo ha sido determinante para consolidar un proyecto que hoy representa la calidad del café colombiano, el desarrollo rural y el compromiso con nuestros caficultores.
          </p>
          <p className="font-josefin text-[15px] md:text-[16px] text-crema/65 leading-[1.9]">
            A cada uno de nuestros aliados les expresamos nuestro <span className="text-amarillo">más sincero agradecimiento</span> por hacer parte de esta historia que continúa construyéndose con esfuerzo, transparencia y pasión por el café.
          </p>
        </div>
      </div>

      {/* === Aliado principal destacado: Ingenio Risaralda === */}
      <div className="mt-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-gradient-to-br from-cafe-oscuro/80 via-cafe-oscuro/60 to-verde/10 shadow-2xl shadow-amarillo/10">
          {/* Columna video Instagram */}
          <div className="md:col-span-2 relative bg-cafe-oscuro flex items-center justify-center p-4 md:p-6 min-h-[450px]">
            <VideoEmbed
              src="/videos/ingenio-risaralda.mp4"
              platform="local"
              title="Video de Ingenio Risaralda — Café La Elda 1941"
            />
            {/* Badge aliado principal (fijo siempre visible) */}
            <div className="absolute top-4 left-4 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Aliado Principal
                </span>
              </span>
            </div>
          </div>

          {/* Columna contenido */}
          <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              {aliadoPrincipal.tipo}
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl text-crema mb-5 leading-tight">
              {aliadoPrincipal.nombre}
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              {aliadoPrincipal.desc}
            </p>
            {/* Etiquetas de apoyo */}
            <div className="flex flex-wrap gap-2.5">
              {aliadoPrincipal.etiquetas.map((et) => (
                <span
                  key={et}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {et}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === Aliado destacado: Compromiso Rural === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden border-2 border-verde-claro/40 bg-gradient-to-br from-cafe-oscuro/80 via-cafe-oscuro/60 to-verde/10 shadow-2xl shadow-verde/10">
          {/* Columna contenido (izquierda en escritorio) */}
          <div className="md:col-span-3 md:order-1 order-2 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-verde-claro mb-3 font-josefin">
              {aliadoDestacado.tipo}
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl text-crema mb-5 leading-tight">
              {aliadoDestacado.nombre}
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              {aliadoDestacado.desc}
            </p>
            {/* Etiquetas de apoyo */}
            <div className="flex flex-wrap gap-2.5">
              {aliadoDestacado.etiquetas.map((et) => (
                <span
                  key={et}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {et}
                </span>
              ))}
            </div>
          </div>

          {/* Columna imagen (derecha en escritorio) */}
          <div className="md:col-span-2 md:order-2 order-1 relative bg-crema flex items-center justify-center p-10 min-h-[340px]">
            <div className="relative z-0 flex items-center justify-center w-full h-full">
              <img
                src={aliadoDestacado.imagen}
                alt={`Logo de ${aliadoDestacado.nombre}`}
                className="max-h-[300px] w-full max-w-[90%] object-contain drop-shadow-lg"
              />
            </div>
            {/* Badge aliado destacado (fijo siempre visible) */}
            <div className="absolute top-4 right-4 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-verde-claro/60 shadow-lg">
                <span className="text-verde-claro text-xs">✦</span>
                <span className="text-verde-claro text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Aliado Destacado
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* === Aliado institucional: Gobernación de Risaralda (con video) === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-gradient-to-br from-cafe-oscuro/80 via-cafe-oscuro/60 to-amarillo/5 shadow-2xl shadow-amarillo/10">
          {/* Columna video Instagram */}
          <div className="md:col-span-2 relative bg-cafe-oscuro flex items-center justify-center p-4 md:p-6 min-h-[450px]">
            <VideoEmbed
              src="/videos/gobernacion-risaralda.mp4"
              platform="local"
              title="Gobernación de Risaralda — Café La Elda 1941"
            />
            {/* Badge aliado institucional (fijo siempre visible) */}
            <div className="absolute top-4 left-4 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Aliado Institucional
                </span>
              </span>
            </div>
          </div>

          {/* Columna contenido */}
          <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Aliado Institucional · Apoyo Gubernamental
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl text-crema mb-5 leading-tight">
              Gobernación de Risaralda
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              Hemos recibido un valioso apoyo de la <span className="text-amarillo not-italic font-josefin font-semibold">Gobernación de Risaralda</span> por medio de sus secretarías. La <span className="text-amarillo">Secretaría de Desarrollo Agropecuario</span> y la <span className="text-amarillo">Secretaría de la Mujer</span> han sido fundamentales en nuestro crecimiento, y gracias a la marca región <span className="text-amarillo not-italic font-josefin font-semibold">Hecho en Risaralda</span> hemos fortalecido nuestra identidad como empresa cafetera del departamento.
            </p>
            {/* Etiquetas de apoyo */}
            <div className="flex flex-wrap gap-2.5">
              {["Desarrollo Agropecuario", "Secretaría de la Mujer", "Hecho en Risaralda", "Identidad Regional"].map((et) => (
                <span
                  key={et}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {et}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === Aliado institucional: Alcaldía de Dosquebradas (con video) === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-gradient-to-br from-cafe-oscuro/80 via-cafe-oscuro/60 to-verde/10 shadow-2xl shadow-amarillo/10">
          {/* Columna video Instagram */}
          <div className="md:col-span-2 relative bg-cafe-oscuro flex items-center justify-center p-4 md:p-6 min-h-[450px]">
            <VideoEmbed
              src="https://www.instagram.com/p/C9z74a9RQj_/embed"
              platform="instagram"
              title="Alcaldía de Dosquebradas — Café La Elda 1941"
            />
            {/* Badge comercialización local */}
            <div className="absolute top-4 left-4 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Comercialización Local
                </span>
              </span>
            </div>
          </div>

          {/* Columna contenido */}
          <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Comercialización Local · Presencia en el Territorio
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl text-crema mb-5 leading-tight">
              Alcaldía de Dosquebradas
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              Participamos en los <span className="text-amarillo">mercados campesinos</span> de la <span className="text-amarillo not-italic font-josefin font-semibold">Alcaldía de Dosquebradas</span> y en la <span className="text-amarillo">Tienda Campesina</span>, llevando directamente a la comunidad el sabor auténtico de Café La Elda 1941. Este espacio nos ha permitido conectar con nuestros clientes de manera cercana y llevar nuestros productos derivados del café a cada rincón del municipio que nos acoge.
            </p>
            {/* Etiquetas de apoyo */}
            <div className="flex flex-wrap gap-2.5">
              {["Mercados Campesinos", "Tienda Campesina", "Dosquebradas", "Eje Cafetero"].map((et) => (
                <span
                  key={et}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {et}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === Aliado institucional: SENA — Tecnoparque (con video de YouTube) === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-gradient-to-br from-cafe-oscuro/80 via-cafe-oscuro/60 to-verde/10 shadow-2xl shadow-amarillo/10">
          {/* Columna video YouTube */}
          <div className="md:col-span-2 relative bg-cafe-oscuro flex items-center justify-center p-4 md:p-6 min-h-[450px]">
            <VideoEmbed
              src="https://www.youtube.com/embed/McMeDwu94ss"
              platform="youtube"
              title="SENA Tecnoparque — Café La Elda 1941"
            />
            {/* Badge innovación y tecnología */}
            <div className="absolute top-4 left-4 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Innovación y Tecnología
                </span>
              </span>
            </div>
          </div>

          {/* Columna contenido */}
          <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Centro de Innovación · SENA Tecnoparque
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl text-crema mb-5 leading-tight">
              SENA — Tecnoparque
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              El <span className="text-amarillo not-italic font-josefin font-semibold">SENA Tecnoparque</span> ha sido un aliado fundamental en el desarrollo tecnológico e innovador de <span className="text-amarillo">Café La Elda 1941</span>. A través de su centro de innovación, hemos fortalecido nuestros procesos productivos, el prototipado de nuevos productos y la modernización de nuestras prácticas, impulsando el crecimiento empresarial con tecnología al servicio del café colombiano.
            </p>
            {/* Etiquetas de apoyo */}
            <div className="flex flex-wrap gap-2.5">
              {["Innovación", "Tecnología", "Prototipado", "Desarrollo Productivo"].map((et) => (
                <span
                  key={et}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {et}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === Aliado institucional: ASOCAÑA (con video de YouTube) === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-gradient-to-br from-cafe-oscuro/80 via-cafe-oscuro/60 to-verde/10 shadow-2xl shadow-amarillo/10">
          {/* Columna contenido (izquierda en escritorio) */}
          <div className="md:col-span-3 md:order-1 order-2 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Sector Agroindustrial · Asociación de Cultivadores de Caña
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl text-crema mb-5 leading-tight">
              ASOCAÑA
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              <span className="text-amarillo not-italic font-josefin font-semibold">ASOCAÑA</span>, la Asociación de Cultivadores de Caña de Azúcar, ha sido un pilar del sector agroindustrial que ha respaldado el crecimiento de <span className="text-amarillo">Café La Elda 1941</span>. Gracias a esta alianza hemos recorrido el Valle del Cauca y participado en ferias y eventos, llevando el sabor de nuestro café a nuevos públicos y consolidando la presencia de nuestra marca en el panorama agroindustrial colombiano.
            </p>
            {/* Etiquetas de apoyo */}
            <div className="flex flex-wrap gap-2.5">
              {["Sector Agroindustrial", "Ferias & Eventos", "Valle del Cauca", "Visibilidad de Marca"].map((et) => (
                <span
                  key={et}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {et}
                </span>
              ))}
            </div>
          </div>

          {/* Columna video YouTube (derecha en escritorio) */}
          <div className="md:col-span-2 md:order-2 order-1 relative bg-cafe-oscuro flex items-center justify-center p-4 md:p-6 min-h-[450px]">
            <VideoEmbed
              src="https://www.youtube.com/embed/NUTl-uxb9yw"
              platform="youtube"
              title="ASOCAÑA — Café La Elda 1941"
            />
            {/* Badge sector agroindustrial */}
            <div className="absolute top-4 right-4 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Sector Agroindustrial
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* === Aliado institucional: ASOCAFE Manatial (con video de Instagram) === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-gradient-to-br from-cafe-oscuro/80 via-cafe-oscuro/60 to-verde/10 shadow-2xl shadow-amarillo/10">
          {/* Columna video Instagram */}
          <div className="md:col-span-2 relative bg-cafe-oscuro flex items-center justify-center p-4 md:p-6 min-h-[450px]">
            <VideoEmbed
              src="https://www.instagram.com/p/DJuxpOuy6zs/embed"
              platform="instagram"
              title="ASOCAFE Manatial — Café La Elda 1941"
            />
            {/* Badge asociación cafetera */}
            <div className="absolute top-4 left-4 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Asociación Cafetera
                </span>
              </span>
            </div>
          </div>

          {/* Columna contenido */}
          <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Asociación Cafetera · Productores de la Región
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl text-crema mb-5 leading-tight">
              ASOCAFE Manatial
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              <span className="text-amarillo not-italic font-josefin font-semibold">ASOCAFE Manatial</span> es la asociación de productores cafeteros que articula esfuerzos en favor de las familias caficultoras de nuestra región. Juntos trabajamos por el <span className="text-amarillo">bienestar del cafetero</span>, el fortalecimiento del gremio y el desarrollo sostenible de nuestras comunidades cafeteras, llevando el orgullo de <span className="text-amarillo">Café La Elda 1941</span> a cada rincón del Eje Cafetero.
            </p>
            {/* Etiquetas de apoyo */}
            <div className="flex flex-wrap gap-2.5">
              {["Productores Cafeteros", "Bienestar Familiar", "Desarrollo Sostenible", "Eje Cafetero"].map((et) => (
                <span
                  key={et}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {et}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === Aliado destacado: Hecho en Risaralda (marca de región) === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-gradient-to-br from-cafe-oscuro/80 via-cafe-oscuro/60 to-amarillo/5 shadow-2xl shadow-amarillo/10">
          {/* Columna contenido (izquierda en escritorio) */}
          <div className="md:col-span-3 md:order-1 order-2 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Marca de Región · Sello de Origen
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl text-crema mb-5 leading-tight">
              Hecho en Risaralda
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              Gracias a la marca de región <span className="text-amarillo not-italic font-josefin font-semibold">Hecho en Risaralda</span> hemos participado en eventos <span className="text-amarillo">locales, regionales, nacionales e internacionales</span>, llevando lo mejor de nuestra tierra a cada rincón. Agradecemos profundamente a esta iniciativa por permitirnos llevar <span className="text-amarillo not-italic font-josefin font-semibold">el mejor sabor del mundo a todo el mundo</span>.
            </p>
            {/* Etiquetas de alcance */}
            <div className="flex flex-wrap gap-2.5">
              {["Eventos Locales", "Regionales", "Nacionales", "Internacionales"].map((et) => (
                <span
                  key={et}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {et}
                </span>
              ))}
            </div>
          </div>

          {/* Columna imagen (derecha en escritorio) */}
          <div className="md:col-span-2 md:order-2 order-1 relative bg-crema flex items-center justify-center p-6 min-h-[420px]">
            <div className="relative z-0 flex items-center justify-center w-full h-full">
              <img
                src="/images/hecho-en-risaralda.png"
                alt="Logo de Hecho en Risaralda"
                className="max-h-[360px] w-full max-w-[95%] object-contain drop-shadow-lg"
              />
            </div>
            {/* Badge marca de región (fijo siempre visible) */}
            <div className="absolute top-4 right-4 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Marca de Región
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* === Aliado institucional: Secretaría de Desarrollo Agropecuario (con video de Instagram) === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-gradient-to-br from-cafe-oscuro/80 via-cafe-oscuro/60 to-verde/10 shadow-2xl shadow-amarillo/10">
          {/* Columna video Instagram */}
          <div className="md:col-span-2 relative bg-cafe-oscuro flex items-center justify-center p-4 md:p-6 min-h-[450px]">
            <VideoEmbed
              src="https://www.instagram.com/p/DIUoo27A-IA/embed"
              platform="instagram"
              title="Secretaría de Desarrollo Agropecuario — Café La Elda 1941"
            />
            {/* Badge articulación departamental */}
            <div className="absolute top-4 left-4 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Articulación Departamental
                </span>
              </span>
            </div>
          </div>

          {/* Columna contenido */}
          <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Articulación Departamental · Gobernación de Risaralda
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl text-crema mb-2 leading-tight">
              Secretaría de Desarrollo Agropecuario
            </h3>
            <p className="font-cormorant italic text-[15px] text-amarillo/80 mb-5">
              A cargo del Dr. Juan Carlos Toro
            </p>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              La <span className="text-amarillo not-italic font-josefin font-semibold">Secretaría de Desarrollo Agropecuario de Risaralda</span>, bajo la dirección del <span className="text-amarillo">Dr. Juan Carlos Toro</span>, ha sido un aliado clave en el fortalecimiento del sector agropecuario y cafetero del departamento. Su acompañamiento ha impulsado el <span className="text-amarillo">desarrollo rural</span> y la promoción de nuestros productos, contribuyendo al crecimiento de <span className="text-amarillo">Café La Elda 1941</span> y de toda la cadena cafetera regional.
            </p>
            {/* Etiquetas de apoyo */}
            <div className="flex flex-wrap gap-2.5">
              {["Desarrollo Rural", "Sector Agropecuario", "Gobernación de Risaralda", "Caficultura"].map((et) => (
                <span
                  key={et}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {et}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Banner inferior con mensaje de respaldo */}
      <div className="mt-16 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full border border-amarillo/30 bg-cafe-oscuro/40">
          <span className="text-amarillo text-lg">✦</span>
          <p className="font-cormorant italic text-crema/70 text-[15px]">
            Respaldados por las instituciones que defienden el café colombiano de altura
          </p>
          <span className="text-amarillo text-lg">✦</span>
        </div>
      </div>
    </section>
  );
}
