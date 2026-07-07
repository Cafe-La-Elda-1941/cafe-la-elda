import type { Metadata } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Bebas_Neue,
  Josefin_Sans,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

// ⚠️ Cambiar esta URL cuando tengas tu dominio de producción
const SITE_URL = "https://cafelaelda.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Café La Elda 1941 — El Mejor Sabor Del Mundo",
    template: "%s | Café La Elda 1941",
  },
  description:
    "Más de 4 años cultivando el mejor café del Eje Cafetero colombiano. Café agroecológico, tostado artesanalmente en Risaralda. Compra online con pago seguro.",
  keywords: [
    "café de Colombia",
    "café agroecológico",
    "café del Eje Cafetero",
    "café de Risaralda",
    "café tostado artesanal",
    "Café La Elda",
    "comprar café online Colombia",
    "café especialidad",
    "vino de café",
    "chocoffee",
  ],
  authors: [{ name: "Café La Elda 1941" }],
  creator: "Café La Elda 1941",
  publisher: "Café La Elda 1941",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "Café La Elda 1941",
    title: "Café La Elda 1941 — El Mejor Sabor Del Mundo",
    description:
      "Café agroecológico del Eje Cafetero colombiano. Tostado artesanalmente en Risaralda. Compra online con pago seguro.",
    images: [
      {
        url: "/images/logo-cafe-la-elda.png",
        width: 400,
        height: 400,
        alt: "Café La Elda 1941",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Café La Elda 1941 — El Mejor Sabor Del Mundo",
    description:
      "Café agroecológico del Eje Cafetero colombiano. Tostado artesanalmente en Risaralda.",
    images: ["/images/logo-cafe-la-elda.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/logo-cafe-la-elda.png",
  },
  category: "food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${cormorant.variable} ${bebas.variable} ${josefin.variable} font-josefin`}
    >
      <body>{children}</body>
    </html>
  );
}
