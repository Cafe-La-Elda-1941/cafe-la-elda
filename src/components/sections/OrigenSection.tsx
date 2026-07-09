import { SectionHeader } from "@/components/ui/SectionHeader";

const features = [
  { icon: "🌿", title: "Agroecológico", desc: "Sin agroquímicos. Café natural, respetuoso del medio ambiente y certificado por CARDER." },
  { icon: "🏔️", title: "Alta Montaña", desc: "Cultivado entre 1.400 y 1.800 msnm en suelos volcánicos. La altura y el microclima dan a cada grano una acidez brillante y un cuerpo inigualable." },
  { icon: "👨‍👩‍👧", title: "Familia Cafetera", desc: "Más de 4 años de tradición familiar transmitiendo el amor por el café de generación en generación." },
  { icon: "🏅", title: "Hecho en Risaralda", desc: "Con el sello oficial del departamento de Risaralda, con la esencia del Eje Cafetero." },
];

const gallery = [
  { src: "/images/proceso-secado.png", alt: "Proceso de secado", caption: "Secado natural al sol · Finca La Elda", span: true },
  { src: "/images/tradicion-cafetera-galeria.png", alt: "Tradición cafetera", caption: "Tradición del Eje Cafetero", spanRow: true },
];

export function OrigenSection() {
  return (
    <section id="origen" className="py-24 px-[5%] bg-crema">
      <SectionHeader
        label="Origen & Territorio"
        title="Café del corazón"
        titleAccent="de Risaralda"
        subtitle="Nuestras fincas están ubicadas en el Eje Cafetero, patrimonio de la humanidad, donde el microclima perfecto da vida al mejor café del mundo."
        centered
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center my-16">
        <div>
          <p className="font-cormorant italic text-xl text-cafe-medio leading-[1.8] mb-5">
            &ldquo;Nuestro café nace en alturas entre 1.400 y 1.800 msnm, con temperaturas frescas,
            lluvias regulares y suelos volcánicos ricos en minerales que le dan una acidez brillante y
            un cuerpo inigualable.&rdquo;
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
            {features.map((f) =>
              f.title === "Familia Cafetera" ? (
                <div key={f.title} className="p-7 rounded-lg bg-cafe-oscuro text-crema border-t-[3px] border-t-amarillo flex flex-col">
                  <h4 className="font-playfair text-lg mb-2">{f.title}</h4>
                  <p className="font-cormorant italic text-[15px] text-crema/60 leading-relaxed mb-5">{f.desc}</p>
                  <div className="relative rounded-md overflow-hidden border border-amarillo/20 group">
                    <img
                      src="/images/union.jpeg"
                      alt="Johana Ramírez Flórez y Jorge Iván Ríos Medina"
                      className="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cafe-oscuro via-cafe-oscuro/80 to-transparent p-4 pt-10">
                      <p className="font-playfair text-crema text-sm text-center leading-snug">
                        Johana Ramírez Flórez
                        <span className="block text-amarillo text-[11px] tracking-[2px] uppercase mt-1">&</span>
                        Jorge Iván Ríos Medina
                      </p>
                    </div>
                  </div>
                </div>
              ) : f.title === "Agroecológico" ? (
                <div key={f.title} className="p-7 rounded-lg bg-cafe-oscuro text-crema border-t-[3px] border-t-amarillo flex flex-col">
                  <h4 className="font-playfair text-lg mb-2">{f.title}</h4>
                  <p className="font-cormorant italic text-[15px] text-crema/60 leading-relaxed mb-5">{f.desc}</p>
                  <div className="relative rounded-md overflow-hidden border border-amarillo/20 group mt-auto bg-cafe-oscuro">
                    <img
                      src="/images/agroecologico.png"
                      alt="Cultivo agroecológico de café La Elda"
                      className="w-full h-[220px] object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              ) : f.title === "Hecho en Risaralda" ? (
                <div key={f.title} className="p-7 rounded-lg bg-cafe-oscuro text-crema border-t-[3px] border-t-amarillo flex flex-col">
                  <h4 className="font-playfair text-lg mb-2">{f.title}</h4>
                  <p className="font-cormorant italic text-[15px] text-crema/60 leading-relaxed mb-5">{f.desc}</p>
                  <div className="relative rounded-md overflow-hidden border border-amarillo/20 group mt-auto bg-cafe-oscuro">
                    <img
                      src="/images/hecho-en-risaralda.png"
                      alt="Sello Hecho en Risaralda"
                      className="w-full h-[220px] object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              ) : f.title === "Alta Montaña" ? (
                <div key={f.title} className="p-7 rounded-lg bg-cafe-oscuro text-crema border-t-[3px] border-t-amarillo flex flex-col">
                  <h4 className="font-playfair text-lg mb-2">{f.title}</h4>
                  <p className="font-cormorant italic text-[15px] text-crema/60 leading-relaxed mb-5">{f.desc}</p>
                  <div className="relative rounded-md overflow-hidden border border-amarillo/20 group mt-auto">
                    <img
                      src="/images/alta-montana.jpg"
                      alt="Cafetales de alta montaña en el Eje Cafetero"
                      className="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-cafe-oscuro/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amarillo/30">
                      <span className="text-amarillo text-[11px] tracking-[2px] uppercase font-josefin">1.400 - 1.800 msnm</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={f.title} className="p-7 rounded-lg bg-cafe-oscuro text-crema border-t-[3px] border-t-amarillo">
                  <span className="text-[32px] mb-3 block">{f.icon}</span>
                  <h4 className="font-playfair text-lg mb-2">{f.title}</h4>
                  <p className="font-cormorant italic text-[15px] text-crema/60 leading-relaxed">{f.desc}</p>
                </div>
              )
            )}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-lg bg-cafe-oscuro text-crema border-t-[3px] border-t-amarillo flex flex-col">
              <span className="block text-amarillo text-[11px] tracking-[3px] uppercase mb-2 font-josefin">Nuestra Misión</span>
              <p className="font-cormorant italic text-[14px] text-crema/80 leading-[1.7]">
                En Café La Elda 1941, nos dedicamos a transformar la esencia del café en experiencias
                únicas, ofreciendo productos derivados que capturan la riqueza, la tradición y la
                autenticidad de nuestras raíces cafetaleras. Nos comprometemos a innovar continuamente,
                promoviendo prácticas sostenibles y entregando calidad excepcional en cada taza y cada
                producto, para el deleite de nuestros clientes en todo el mundo.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-cafe-oscuro text-crema border-t-[3px] border-t-amarillo flex flex-col">
              <span className="block text-amarillo text-[11px] tracking-[3px] uppercase mb-2 font-josefin">Nuestra Visión</span>
              <p className="font-cormorant italic text-[14px] text-crema/80 leading-[1.7]">
                Ser la marca líder y referente mundial en la creación de productos derivados del café,
                fusionando tradición y vanguardia para transformar el café en experiencias sensoriales
                inigualables, mientras inspiramos una conexión profunda y sostenible con la tierra y las
                comunidades que lo cultivan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-10" style={{ gridAutoRows: "250px" }}>
        {gallery.map((item, i) => (
          <div
            key={i}
            className={`overflow-hidden rounded-lg relative cursor-pointer group ${item.span ? "sm:col-span-2 sm:row-span-2" : ""} ${item.spanRow ? "sm:row-span-2" : ""}`}
          >
            <img src={item.src} alt={item.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 bg-gradient-to-t from-[rgba(26,15,8,0.7)] to-transparent">
              <span className="font-cormorant italic text-crema text-base">{item.caption}</span>
            </div>
          </div>
        ))}
      </div>

      {/* === Banner Ferias Locales === */}
      <div className="mt-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-cafe-oscuro shadow-2xl shadow-amarillo/10">
          {/* Video comercialización local */}
          <div className="lg:col-span-3 relative bg-crema flex items-center justify-center p-4 min-h-[420px]">
            <video
              src="/images/comercializacion-local.mp4#t=0.5"
              controls
              className="w-full h-full object-contain"
              preload="metadata"
              playsInline
            />
            {/* Badge ferias locales */}
            <div className="absolute top-5 left-5 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Comercialización Local
                </span>
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Presencia en el territorio
            </div>
            <h3 className="font-playfair text-3xl lg:text-4xl text-crema mb-5 leading-tight">
              Mercados Campesinos
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              Participamos en los <span className="text-amarillo">mercados campesinos</span> de la <span className="text-amarillo not-italic font-josefin font-semibold">Alcaldía de Dosquebradas</span> y en la <span className="text-amarillo">Tienda Campesina</span>, llevando directamente a la comunidad el sabor auténtico de Café La Elda 1941.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["Mercados Campesinos", "Tienda Campesina", "Dosquebradas"].map((et) => (
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

      {/* === Banner Ferias Regionales === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-cafe-oscuro shadow-2xl shadow-amarillo/10">
          {/* Imagen grande (izquierda en escritorio) */}
          <div className="lg:col-span-3 relative bg-crema flex items-center justify-center p-4 min-h-[420px]">
            <img
              src="/images/ferias-regionales.png"
              alt="Café La Elda 1941 en ferias regionales"
              className="w-full h-full object-contain"
            />
            {/* Badge ferias regionales */}
            <div className="absolute top-5 left-5 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Ferias Regionales
                </span>
              </span>
            </div>
          </div>

          {/* Contenido (derecha en escritorio) */}
          <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Presentes en nuestra región
            </div>
            <h3 className="font-playfair text-3xl lg:text-4xl text-crema mb-5 leading-tight">
              Ferias Regionales
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              El equipo de <span className="text-amarillo not-italic font-josefin font-semibold">Café La Elda 1941</span> ha participado en diferentes espacios regionales, gracias a entidades como la <span className="text-amarillo">Gobernación de Risaralda</span> y empresas como el <span className="text-amarillo">Ingenio Risaralda</span>, llevando nuestro sabor a municipios del territorio.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["La Virginia", "Belén de Umbría", "Viterbo", "Balboa", "Belalcázar"].map((municipio) => (
                <span
                  key={municipio}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {municipio}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === Banner Ferias Nacionales === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-cafe-oscuro shadow-2xl shadow-amarillo/10">
          {/* Contenido (izquierda en escritorio) */}
          <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center md:order-1 order-2">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Presencia en todo el país
            </div>
            <h3 className="font-playfair text-3xl lg:text-4xl text-crema mb-5 leading-tight">
              Ferias Nacionales
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              Hemos llevado el sabor de <span className="text-amarillo not-italic font-josefin font-semibold">Café La Elda 1941</span> a las ferias más importantes del país, conectando con clientes y amantes del café en las principales ciudades de Colombia.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["Bogotá", "Cali", "Medellín", "Cartagena", "Barranquilla", "Tunja", "Popayán", "Huila", "Ibagué"].map((ciudad) => (
                <span
                  key={ciudad}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[11px] tracking-[1.5px] uppercase font-josefin"
                >
                  {ciudad}
                </span>
              ))}
            </div>
          </div>

          {/* Imagen grande (derecha en escritorio) */}
          <div className="lg:col-span-3 relative bg-crema flex items-center justify-center p-4 min-h-[420px] md:order-2 order-1">
            <img
              src="/images/ferias-nacionales.png"
              alt="Café La Elda 1941 en ferias nacionales"
              className="w-full h-full object-contain"
            />
            {/* Badge ferias nacionales */}
            <div className="absolute top-5 right-5 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Ferias Nacionales
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* === Banner Ferias Internacionales === */}
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden border-2 border-amarillo/40 bg-cafe-oscuro shadow-2xl shadow-amarillo/10">
          {/* Imagen grande (izquierda en escritorio) */}
          <div className="lg:col-span-3 relative bg-crema flex items-center justify-center p-4 min-h-[420px]">
            <img
              src="/images/ferias-internacionales.png"
              alt="Café La Elda 1941 en ferias internacionales"
              className="w-full h-full object-contain"
            />
            {/* Badge ferias internacionales */}
            <div className="absolute top-5 left-5 z-30">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cafe-oscuro border-2 border-amarillo/60 shadow-lg">
                <span className="text-amarillo text-xs">★</span>
                <span className="text-amarillo text-[10px] tracking-[2px] uppercase font-josefin font-semibold">
                  Ferias Internacionales
                </span>
              </span>
            </div>
          </div>

          {/* Contenido (derecha en escritorio) */}
          <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-amarillo/90 mb-3 font-josefin">
              Llevando Colombia al mundo
            </div>
            <h3 className="font-playfair text-3xl lg:text-4xl text-crema mb-5 leading-tight">
              Ferias Internacionales
            </h3>
            <p className="font-cormorant italic text-[17px] text-crema/75 leading-relaxed mb-6">
              Con orgullo hemos llevado el sabor de <span className="text-amarillo not-italic font-josefin font-semibold">Café La Elda 1941</span> más allá de las fronteras, participando en ferias internacionales y compartiendo la riqueza del café colombiano con el mundo.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["🇪🇸 España", "🇨🇦 Canadá", "🇺🇸 Estados Unidos", "🇦🇷 Argentina"].map((pais) => (
                <span
                  key={pais}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-verde/20 border border-verde-claro/40 text-crema/90 text-[12px] tracking-[1px] uppercase font-josefin"
                >
                  {pais}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
