import Link from "next/link";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";

const productLinks = ["Café Grano 250g", "Café Molido 125g", "Café Familiar 500g", "Panderositas", "Arequipe de Café", "Chocoffee", "Kaski Cereal"];
const companyLinks = [
  { label: "Nuestra Historia", href: "#historia" },
  { label: "Origen del Café", href: "#origen" },
  { label: "Nuestro Proceso", href: "#proceso" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Contacto", href: "#contacto" },
];
const contactLinks = [
  { label: "+57 310 710 9852", href: "https://wa.me/3107109852" },
  { label: "laeldacafe1941@gmail.com", href: "mailto:laeldacafe1941@gmail.com" },
  { label: "Dosquebradas, Risaralda", href: "#" },
];

const legalLinks = [
  { label: "Términos y Condiciones", href: "/legal/terminos" },
  { label: "Política de Privacidad", href: "/legal/privacidad" },
  { label: "Envíos y Devoluciones", href: "/legal/envios" },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/laeldacafe1941", Icon: FacebookIcon },
  { name: "Instagram", href: "https://instagram.com/cafelaelda1941", Icon: InstagramIcon },
  { name: "TikTok", href: "https://tiktok.com/@laelda1941", Icon: TikTokIcon },
  { name: "YouTube", href: "https://youtube.com/@LaElda1941", Icon: YouTubeIcon },
  { name: "WhatsApp", href: "https://wa.me/3107109852", Icon: WhatsAppIcon },
];

export function Footer() {
  return (
    <footer className="bg-[#0f0804] border-t-2 border-t-verde px-[5%] pt-16 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-center leading-[1.2] bg-amarillo font-playfair font-black text-verde text-[9px] border-[3px] border-verde">
              la<br />Elda<br />1941
            </div>
            <div>
              <div className="font-playfair text-crema text-xl">
                Café <span className="text-amarillo italic">La Elda</span>
              </div>
              <div className="text-[11px] tracking-[2px] text-crema/40">EL MEJOR SABOR DEL MUNDO</div>
            </div>
          </div>
          <p className="font-cormorant italic text-crema/50 text-base my-4 leading-[1.7]">
            Desde 1941 cultivando café colombiano de altísima calidad en el corazón del Eje Cafetero.
          </p>
          <div className="flex gap-2.5">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className="w-9 h-9 flex items-center justify-center rounded-sm no-underline bg-crema/[0.08] border border-crema/[0.12] text-crema hover:bg-verde hover:border-verde hover:-translate-y-0.5 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Productos */}
        <div>
          <h5 className="font-josefin text-[11px] uppercase tracking-[3px] text-amarillo mb-5">Productos</h5>
          <ul className="list-none flex flex-col gap-2.5">
            {productLinks.map((item) => (
              <li key={item}>
                <Link href="#productos" className="font-cormorant text-crema/55 text-base no-underline hover:text-crema transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h5 className="font-josefin text-[11px] uppercase tracking-[3px] text-amarillo mb-5">Empresa</h5>
          <ul className="list-none flex flex-col gap-2.5">
            {companyLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-cormorant text-crema/55 text-base no-underline hover:text-crema transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h5 className="font-josefin text-[11px] uppercase tracking-[3px] text-amarillo mb-5">Contacto</h5>
          <ul className="list-none flex flex-col gap-2.5">
            {contactLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-cormorant text-crema/55 text-base no-underline hover:text-crema transition-colors">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Enlaces legales */}
      <div className="flex flex-wrap justify-center gap-6 pb-6 border-t border-crema/[0.08] pt-6">
        {legalLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-cormorant text-crema/40 text-sm no-underline hover:text-amarillo transition-colors tracking-wide"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-crema/[0.08] text-xs text-crema/30 tracking-wider">
        <span>© 2025 Café La Elda 1941 · <span className="text-verde-claro">RSA-0021672-2022</span> · Todos los derechos reservados</span>
        <span>Hecho con ☕ en Risaralda, Colombia</span>
      </div>
    </footer>
  );
}
