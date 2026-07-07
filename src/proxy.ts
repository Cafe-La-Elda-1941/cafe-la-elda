import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

// Rutas públicas dentro del admin (no requieren login)
const PUBLIC_ADMIN_ROUTES = ["/admin/login"];
// Rutas públicas de API (no requieren login)
const PUBLIC_API_ROUTES = ["/api/admin/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Proteger páginas del admin ───
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";

  if (isAdminPage && !isAdminLoginPage) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isValid = token ? await verifySessionToken(token) : false;

    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ─── Proteger APIs del admin ───
  const isAdminApi = pathname.startsWith("/api/admin");
  const isPublicApi = PUBLIC_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminApi && !isPublicApi) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isValid = token ? await verifySessionToken(token) : false;

    if (!isValid) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // El proxy solo se ejecuta en rutas de admin
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
