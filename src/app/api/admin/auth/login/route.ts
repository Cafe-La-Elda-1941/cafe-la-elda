import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, verifyPassword, COOKIE_NAME } from "@/lib/auth";

// === Rate limiting simple en memoria (por IP) ===
// Limita los intentos de fuerza bruta contra la contraseña del admin.
// Nota: en entornos serverless (Vercel) cada instancia mantiene su propio mapa,
// por lo que el límite efectivo puede ser mayor; aun así reduce drásticamente
// los ataques automatizados. Para producción a gran escala se recomienda
// respaldar esto con un almacenamiento compartido (p. ej. Upstash Redis).
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // ventana de 15 minutos

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "desconocida";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= MAX_ATTEMPTS) {
      return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
    }
  } else if (entry) {
    // ventana expirada: limpiar
    loginAttempts.delete(ip);
  }
  return { allowed: true, retryAfter: 0 };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (entry && now < entry.resetAt) {
    entry.count += 1;
  } else {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }
}

function resetAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // 1. Verificar rate limit antes de procesar
    const { allowed, retryAfter } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Demasiados intentos. Intenta nuevamente en ${Math.ceil(
            retryAfter / 60
          )} minuto(s).`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Contraseña requerida." },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      // Registrar intento fallido
      recordFailedAttempt(ip);
      const remaining = MAX_ATTEMPTS - (loginAttempts.get(ip)?.count ?? 0);
      return NextResponse.json(
        {
          error:
            remaining > 0
              ? `Contraseña incorrecta. Intentos restantes: ${remaining}.`
              : "Demasiados intentos fallidos. Cuenta bloqueada temporalmente.",
        },
        { status: 401 }
      );
    }

    // Login exitoso: limpiar intentos de esta IP
    resetAttempts(ip);

    // Crear el token de sesión
    const token = await createSessionToken();

    // Crear respuesta exitosa
    const response = NextResponse.json({ success: true });

    // Establecer cookie httpOnly (segura, no accesible por JavaScript)
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Error al iniciar sesión." },
      { status: 500 }
    );
  }
}
