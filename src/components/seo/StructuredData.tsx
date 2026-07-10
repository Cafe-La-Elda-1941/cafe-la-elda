export function StructuredData() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": "https://cafe-la-elda.vercel.app",
    name: "Café La Elda 1941",
    alternateName: "La Elda 1941",
    description:
      "Café agroecológico del Eje Cafetero colombiano. Más de 80 años cultivando el mejor café en Risaralda. Tostado artesanalmente. Compra online con pago seguro.",
    slogan: "El Mejor Sabor Del Mundo",
    image: "https://cafe-la-elda.vercel.app/images/logo-cafe-la-elda.png",
    logo: "https://cafe-la-elda.vercel.app/images/logo-cafe-la-elda.png",
    url: "https://cafe-la-elda.vercel.app",
    telephone: "+573107109852",
    email: "laeldacafe1941@gmail.com",
    priceRange: "$$",
    currenciesAccepted: "COP",
    paymentAccepted: "Bold, Transferencia Bancolombia, Efectivo",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dosquebradas",
      addressLocality: "Dosquebradas",
      addressRegion: "Risaralda",
      postalCode: "661020",
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 4.8385,
      longitude: -75.6753,
    },
    areaServed: {
      "@type": "Country",
      name: "Colombia",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "14:00",
      },
    ],
    sameAs: [
      "https://facebook.com/laeldacafe1941",
      "https://instagram.com/cafelaelda1941",
      "https://tiktok.com/@laelda1941",
      "https://youtube.com/@LaElda1941",
      "https://wa.me/3107109852",
    ],
    hasMenu: {
      "@type": "Menu",
      name: "Productos Café La Elda 1941",
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Café",
          description: "Café en grano, molido y familiar de alta calidad",
          hasMenuItem: [
            { "@type": "MenuItem", name: "Café Grano 250g", description: "Café agroecológico en grano" },
            { "@type": "MenuItem", name: "Café Molido 125g", description: "Café molido artesanalmente" },
            { "@type": "MenuItem", name: "Café Familiar 500g", description: "Presentación familiar" },
          ],
        },
        {
          "@type": "MenuSection",
          name: "Derivados",
          description: "Productos derivados del café",
          hasMenuItem: [
            { "@type": "MenuItem", name: "Panderositas", description: "Panderos artesanales con café" },
            { "@type": "MenuItem", name: "Arequipe de Café", description: "Arequipe con sabor a café" },
            { "@type": "MenuItem", name: "Chocoffee", description: "Chocolate con café" },
            { "@type": "MenuItem", name: "Kaski Cereal", description: "Cereal crocante" },
          ],
        },
      ],
    },
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Combos Café La Elda",
          category: "Combos de Café",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Regalos Corporativos",
          category: "Regalos Empresariales",
        },
      },
    ],
    foundingDate: "1941",
    knowsLanguage: ["es"],
    nationality: {
      "@type": "Country",
      name: "Colombia",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://cafe-la-elda.vercel.app",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://cafe-la-elda.vercel.app",
    name: "Café La Elda 1941",
    description: "El Mejor Sabor Del Mundo — Café agroecológico del Eje Cafetero",
    publisher: {
      "@type": "Organization",
      name: "Café La Elda 1941",
    },
    inLanguage: "es-CO",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://cafe-la-elda.vercel.app/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
