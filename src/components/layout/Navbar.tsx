"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

const sections = [
  { href: "#inicio", label: "Inicio" },
  { href: "#historia", label: "Historia" },
  { href: "#productos", label: "Productos" },
  { href: "#origen", label: "Origen" },
  { href: "#proceso", label: "Proceso" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, setCartOpen } = useCart();
  const pathname = usePathname();

  // Si no estamos en la página principal, los enlaces deben llevar primero al home
  const isHome = pathname === "/";
  const prefix = isHome ? "" : "/";

  // Construir enlaces con prefijo
  const links = sections.map((s) => ({ ...s, href: `${prefix}${s.href}` }));

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-[70px] px-[5%] bg-[rgba(26,15,8,0.95)] backdrop-blur-xl border-b-2 border-amarillo">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-center leading-[1.1] bg-amarillo text-verde font-playfair text-[10px] font-black border-[3px] border-verde p-1">
          la<br />Elda<br />1941
        </div>
        <div className="font-playfair text-crema text-base leading-tight">
          Café <span className="text-amarillo italic">La Elda</span>
          <br />
          <small className="text-[11px] tracking-[2px] opacity-60">1941</small>
        </div>
      </Link>

      {/* Desktop menu */}
      <ul className="hidden md:flex gap-8 list-none items-center">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-crema/80 no-underline uppercase tracking-[2px] text-[12px] transition-colors duration-300 hover:text-amarillo"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={`${prefix}#contacto`}
            className="text-crema no-underline uppercase tracking-[2px] text-[12px] px-5 py-2 rounded-sm bg-verde border border-verde-claro transition-colors duration-300 hover:bg-verde-claro"
          >
            Pedir Ahora
          </Link>
        </li>
        <li>
          <button
            onClick={() => setCartOpen(true)}
            className="relative cursor-pointer bg-transparent border-none p-1"
          >
            <img
              src="/images/carrito-icon.png"
              alt="Carrito de compras"
              className="w-9 h-9 object-contain drop-shadow-lg"
            />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-rojo text-crema">
                {itemCount}
              </span>
            )}
          </button>
        </li>
      </ul>

      {/* Mobile */}
      <div className="flex md:hidden items-center gap-4">
        <button
          onClick={() => setCartOpen(true)}
          className="relative cursor-pointer bg-transparent border-none p-1"
        >
          <img
            src="/images/carrito-icon.png"
            alt="Carrito de compras"
            className="w-8 h-8 object-contain drop-shadow-lg"
          />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-rojo text-crema">
              {itemCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl bg-transparent border-none cursor-pointer text-crema"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 right-0 flex flex-col items-center gap-6 py-8 md:hidden bg-[rgba(26,15,8,0.98)] border-b-2 border-amarillo">
          {[...links, { href: `${prefix}#contacto`, label: "Pedir Ahora" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-crema no-underline uppercase tracking-[2px] text-[13px] hover:text-amarillo transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
