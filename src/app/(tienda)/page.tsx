export const dynamic = "force-static";

import { getProducts } from "@/lib/products";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { HistoriaSection } from "@/components/sections/HistoriaSection";
import { ProductosSection } from "@/components/sections/ProductosSection";
import { CombosSection } from "@/components/sections/CombosSection";
import { RegalosCorporativosSection } from "@/components/sections/RegalosCorporativosSection";
import { OrigenSection } from "@/components/sections/OrigenSection";
import { ProcesoSection } from "@/components/sections/ProcesoSection";
import { TestimoniosSection } from "@/components/sections/TestimoniosSection";
import { AliadosSection } from "@/components/sections/AliadosSection";
import { ContactoSection } from "@/components/sections/ContactoSection";

export default function HomePage() {
  const serializedProducts = getProducts();

  return (
    <main>
      <HeroSection />
      <StatsBar />
      <HistoriaSection />
      <ProductosSection products={serializedProducts} />
      <CombosSection />
      <RegalosCorporativosSection />
      <OrigenSection />
      <ProcesoSection />
      <TestimoniosSection />
      <AliadosSection />
      <ContactoSection products={serializedProducts} />
    </main>
  );
}
