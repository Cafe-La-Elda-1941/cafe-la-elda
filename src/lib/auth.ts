import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

/**
 * Devuelve la clave secreta para firmar los JWT.
 * Se lee de AUTH_SECRET en las variables de entorno.
 */
function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "cafe-la-elda-secret-dev-fallback";
  return new TextEncoder().encode(secret);
}

/**
 * Crea un JWT firmado para la sesión de administrador.
 * Vence en 24 horas.
 */
export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

/**
 * Verifica que un JWT sea válido (firma correcta y no expirado).
 */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifica la contraseña de administrador.
 */
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

export { COOKIE_NAME };
