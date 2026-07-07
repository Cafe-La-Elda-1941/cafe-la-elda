// Datos estáticos de productos para Vercel (sin dependencia de SQLite/Prisma en runtime)
export interface StaticProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  weight: string;
  image: string | null;
  tag: string | null;
  tagStyle: string | null;
  category: { slug: string };
}

const allProducts: StaticProduct[] = [
  {
    id: "panderositas-de-cafe-20g",
    name: "Panderositas de Café 20g",
    slug: "panderositas-de-cafe-20g",
    description: "Galletas artesanales de café colombiano. Presentación individual de 20g.",
    price: 5000,
    weight: "20 gramos",
    image: "/images/panderositas-20g.png",
    tag: "Nuevo",
    tagStyle: null,
    category: { slug: "derivado" },
  },
  {
    id: "panderositas-de-cafe",
    name: "Panderositas de Café",
    slug: "panderositas-de-cafe",
    description: "Galletas artesanales de café colombiano. El snack perfecto para tu taza.",
    price: 10000,
    weight: "60 gramos",
    image: "/images/panderositas-60g.png",
    tag: "Nuevo",
    tagStyle: null,
    category: { slug: "derivado" },
  },
  {
    id: "panderositas-de-cafe-125g",
    name: "Panderositas de Café 125g",
    slug: "panderositas-de-cafe-125g",
    description: "Galletas artesanales de café colombiano. Presentación familiar de 125g.",
    price: 20000,
    weight: "125 gramos",
    image: "/images/panderositas-125g.png",
    tag: "Nuevo",
    tagStyle: null,
    category: { slug: "derivado" },
  },
  {
    id: "chocoffee",
    name: "Chocoffee",
    slug: "chocoffee",
    description: "Mezcla de café tostado con cobertura de chocolate artesanal. Irresistible.",
    price: 8000,
    weight: "30 gramos",
    image: "/images/chocoffee-30g.png",
    tag: "Especial",
    tagStyle: "nuevo",
    category: { slug: "derivado" },
  },
  {
    id: "chocoffee-70g",
    name: "Chocoffee 70g",
    slug: "chocoffee-70g",
    description: "Mezcla de café tostado con cobertura de chocolate artesanal. Presentación 70g. Irresistible.",
    price: 12000,
    weight: "70 gramos",
    image: "/images/chocoffee-70g.png",
    tag: "Especial",
    tagStyle: "nuevo",
    category: { slug: "derivado" },
  },
  {
    id: "chocoffee-120g",
    name: "Chocoffee 120g",
    slug: "chocoffee-120g",
    description: "Mezcla de café tostado con cobertura de chocolate artesanal. Presentación 120g. Irresistible.",
    price: 23000,
    weight: "120 gramos",
    image: "/images/chocoffee-120g.png",
    tag: "Especial",
    tagStyle: "nuevo",
    category: { slug: "derivado" },
  },
  {
    id: "kaski-cascara-de-cafe",
    name: "Kaski Cáscara de Café",
    slug: "kaski-cascara-de-cafe",
    description: "Cáscara de café deshidratada con panela. Snack para deleitar el paladar con yogurt, leche, fruta deshidratada, yogurt de frutas, etc.",
    price: 10000,
    weight: "30 gramos",
    image: "/images/kaski-30g.png",
    tag: "Novedad",
    tagStyle: "nuevo",
    category: { slug: "derivado" },
  },
  {
    id: "kaski-cascara-de-cafe-80g",
    name: "Kaski Cáscara de Café 80g",
    slug: "kaski-cascara-de-cafe-80g",
    description: "Cáscara caramelizada y deshidratada de café. Snack para deleitar el paladar con yogurt, leche, fruta deshidratada, yogurt de frutas, etc.",
    price: 25000,
    weight: "80 gramos",
    image: "/images/kaski-80g.png",
    tag: "Novedad",
    tagStyle: "nuevo",
    category: { slug: "derivado" },
  },
  {
    id: "totumo-arequipe-de-cafe-40g",
    name: "Totumo de Arequipe de Café 40g",
    slug: "totumo-arequipe-de-cafe-40g",
    description: "Arequipe de café artesanal La Elda en totumo tradicional. Presentación de 40g.",
    price: 4000,
    weight: "40 gramos",
    image: "/images/totumo-arequipe-40g.png",
    tag: "Artesanal",
    tagStyle: "nuevo",
    category: { slug: "derivado" },
  },
  {
    id: "totumo-arequipe-de-cafe-130g",
    name: "Totumo de Arequipe de Café 130g",
    slug: "totumo-arequipe-de-cafe-130g",
    description: "Arequipe de café artesanal La Elda en totumo tradicional. Presentación de 130g.",
    price: 10000,
    weight: "130 gramos",
    image: "/images/totumo-arequipe-130g.png",
    tag: "Artesanal",
    tagStyle: "nuevo",
    category: { slug: "derivado" },
  },
  {
    id: "cafe-premium-125g",
    name: "Café Premium 125g",
    slug: "cafe-premium-125g",
    description: "Presentación ideal para regalo o para probar nuestro café artesanal.",
    price: 15000,
    weight: "125 gramos",
    image: "/images/cafe-premium-125g.png",
    tag: "Grano · Molido",
    tagStyle: null,
    category: { slug: "cafe" },
  },
  {
    id: "cafe-premium-250g",
    name: "Café Premium 250g",
    slug: "cafe-premium-250g",
    description: "Café agroecológico seleccionado, disponible en grano o molido.",
    price: 25000,
    weight: "250 gramos",
    image: "/images/cafe-premium-250g.png",
    tag: "Grano · Molido",
    tagStyle: null,
    category: { slug: "cafe" },
  },
  {
    id: "pack-totumos-x4",
    name: "Pack x4 Totumos de Arequipe",
    slug: "pack-totumos-x4",
    description: "Set de 4 totumos de arequipe de café artesanal La Elda. El regalo perfecto para los amantes del buen sabor.",
    price: 12000,
    weight: "4 totumos",
    image: "/images/pack-totumos-x4.png",
    tag: "Pack x4",
    tagStyle: "nuevo",
    category: { slug: "derivado" },
  },
  {
    id: "vino-de-cafe-750ml",
    name: "Vino de Café 750ml",
    slug: "vino-de-cafe-750ml",
    description: "Una obra maestra artesanal donde el café de altura se abraza con la uva isabelina. Vino de cuerpo sedoso, aromas envolventes y un final que despierta los sentidos. El espíritu del Eje Cafetero, destilado con la más suave expresión para conquistar cada paladar.",
    price: 38000,
    weight: "750 ml",
    image: "/images/vino-de-cafe-750ml.png",
    tag: "Edición Artesanal",
    tagStyle: "nuevo",
    category: { slug: "derivado" },
  },
  {
    id: "cafe-familiar-500g",
    name: "Café Familiar 500g",
    slug: "cafe-familiar-500g",
    description: "La presentación más completa para los verdaderos amantes de café.",
    price: 45000,
    weight: "500 gramos",
    image: "/images/cafe-familiar-500g.png",
    tag: "Grano · Molido",
    tagStyle: null,
    category: { slug: "cafe" },
  },
];

// Orden personalizado: 1) Cafés, 2) Chocoffee (por precio), 3) Panderositas (por precio), 4) Kaski, 5) Otros derivados (por precio)
const groupPriority = (name: string, categorySlug: string) => {
  if (categorySlug === "cafe") return 0;
  if (name.toLowerCase().includes("chocoffee")) return 1;
  if (name.toLowerCase().includes("panderositas")) return 2;
  if (name.toLowerCase().includes("kaski")) return 3;
  return 4;
};

export function getProducts(): StaticProduct[] {
  return [...allProducts].sort((a, b) => {
    const ga = groupPriority(a.name, a.category.slug);
    const gb = groupPriority(b.name, b.category.slug);
    return ga !== gb ? ga - gb : a.price - b.price;
  });
}
