"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface NavSection {
  title: string;
  items: { href: string; label: string; icon: string }[];
}

const navSections: NavSection[] = [
  {
    title: "Inicio",
    items: [
      { href: "/admin", label: "Dashboard", icon: "📊" },
    ],
  },
  {
    title: "Tienda",
    items: [
      { href: "/admin/productos", label: "Productos", icon: "☕" },
      { href: "/admin/pedidos", label: "Pedidos", icon: "📦" },
      { href: "/admin/mensajes", label: "Mensajes", icon: "✉️" },
    ],
  },
  {
    title: "Facturación",
    items: [
      { href: "/admin/facturas", label: "Facturas DIAN", icon: "🧾" },
      { href: "/admin/terceros", label: "Clientes y Proveedores", icon: "👥" },
    ],
  },
  {
    title: "Contabilidad",
    items: [
      { href: "/admin/contabilidad", label: "Plan de Cuentas", icon: "📒" },
      { href: "/admin/asientos", label: "Asientos Contables", icon: "📝" },
      { href: "/admin/reportes", label: "Estados Financieros", icon: "📈" },
    ],
  },
  {
    title: "Operación",
    items: [
      { href: "/admin/inventario", label: "Inventario", icon: "📦" },
      { href: "/admin/bancos", label: "Bancos y Tesorería", icon: "🏦" },
      { href: "/admin/nomina", label: "Nómina", icon: "💰" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/admin/configuracion", label: "Configuración", icon: "⚙️" },
    ],
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Si estamos en el login, no mostrar el sidebar
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0f0a06]">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-cafe-oscuro border-r border-amarillo/15 flex flex-col z-50 overflow-hidden">
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b-2 border-b-amarillo shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-center leading-[1.1] shrink-0 bg-amarillo font-playfair text-[8px] font-black text-verde border-2 border-verde">
            la<br />Elda
          </div>
          <div>
            <div className="font-playfair text-crema text-sm font-bold">Admin Panel</div>
            <div className="text-[10px] tracking-wider text-crema/40">SISTEMA CONTABLE</div>
          </div>
        </div>

        {/* Nav con secciones */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto scroll-area">
          {navSections.map((section) => (
            <div key={section.title} className="mb-1">
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amarillo/40 font-josefin">
                {section.title}
              </div>
              {section.items.map((item) => {
                const active = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg no-underline text-sm transition-all font-josefin ${
                      active
                        ? "bg-amarillo/12 text-amarillo border-l-[3px] border-l-amarillo"
                        : "text-crema/50 border-l-[3px] border-l-transparent hover:text-crema/80 hover:bg-crema/[0.03]"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-crema/[0.08] shrink-0 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-wider uppercase text-red-400/70 font-josefin hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
          >
            ⏻ Cerrar sesión
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg no-underline text-xs tracking-wider uppercase text-crema/40 font-josefin hover:text-crema/60 transition-colors"
          >
            ← Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 min-h-screen p-6 md:p-8">
        {children}
      </main>

      {/* Scrollbar styles */}
      <style jsx global>{`
        .scroll-area::-webkit-scrollbar {
          width: 4px;
        }
        .scroll-area::-webkit-scrollbar-thumb {
          background: rgba(200, 162, 74, 0.2);
          border-radius: 2px;
        }
        .scroll-area::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
