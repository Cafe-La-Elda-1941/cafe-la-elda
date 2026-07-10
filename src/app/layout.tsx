import type { Metadata, Viewport } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Bebas_Neue,
  Josefin_Sans,
} from "next/font/google";
import { StructuredData } from "@/components/seo/StructuredData";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
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
const SITE_URL = "https://cafe-la-elda.vercel.app";

export const viewport: Viewport = {
  themeColor: "#C8A24A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Café La Elda 1941 — El Mejor Sabor Del Mundo | Café Agroecológico de Risaralda",
    template: "%s | Café La Elda 1941",
  },
  description:
    "Café agroecológico del Eje Cafetero colombiano desde 1941. Tostado artesanalmente en Dosquebradas, Risaralda. Café en grano, molido, derivados, combos y regalos corporativos. Compra online con pago seguro.",
  keywords: [
    "café de Colombia",
    "café agroecológico",
    "café del Eje Cafetero",
    "café de Risaralda",
    "café tostado artesanal",
    "Café La Elda",
    "café La Elda 1941",
    "comprar café online Colombia",
    "café especialidad",
    "café Dosquebradas",
    "café Pereira Risaralda",
    "café artesanal",
    "panderositas de café",
    "arequipe de café",
    "chocoffee",
    "regalos corporativos café",
    "café molido 250g",
    "café en grano Colombia",
    "café familiar",
    "tienda de café online",
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
    title: "Café La Elda 1941 — El Mejor Sabor Del Mundo | Café Agroecológico de Risaralda",
    description:
      "Café agroecológico del Eje Cafetero colombiano desde 1941. Tostado artesanalmente en Dosquebradas, Risaralda. Compra online con pago seguro.",
    images: [
      {
        url: "/images/logo-cafe-la-elda.png",
        width: 400,
        height: 400,
        alt: "Logo Café La Elda 1941",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@laelda1941",
    creator: "@laelda1941",
    title: "Café La Elda 1941 — El Mejor Sabor Del Mundo",
    description:
      "Café agroecológico del Eje Cafetero colombiano desde 1941. Tostado artesanalmente en Risaralda. Compra online.",
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
  manifest: "/manifest.json",
  category: "food",
  verification: {
    google: "21OceQzTF7Zd6aqViCj-Rr3kRRMCmPY0nfCTGCfeTcE",
  },
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
      <body>
        <StructuredData />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
