"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/productos", label: "Productos", icon: "☕" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "📦" },
  { href: "/admin/mensajes", label: "Mensajes", icon: "✉️" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Si estamos en el login, no mostrar el sidebar
  const isLoginPage = pathname === "/admin/login";

  // En la página de login, renderizar sin sidebar
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
      <aside className="fixed top-0 left-0 bottom-0 w-60 bg-cafe-oscuro border-r border-amarillo/15 flex flex-col z-50">
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b-2 border-b-amarillo shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-center leading-[1.1] shrink-0 bg-amarillo font-playfair text-[8px] font-black text-verde border-2 border-verde">
            la<br />Elda
          </div>
          <div>
            <div className="font-playfair text-crema text-sm font-bold">Admin Panel</div>
            <div className="text-[10px] tracking-wider text-crema/40">CAFÉ LA ELDA</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-sm transition-all font-josefin ${
                  active
                    ? "bg-amarillo/12 text-amarillo border-l-[3px] border-l-amarillo"
                    : "text-crema/50 border-l-[3px] border-l-transparent hover:text-crema/80 hover:bg-crema/[0.03]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back + Logout */}
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
      <main className="ml-60 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
