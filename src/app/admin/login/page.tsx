"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión.");
        setLoading(false);
        return;
      }

      // Login exitoso → redirigir al dashboard
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a06] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amarillo font-playfair text-[12px] font-black text-verde border-2 border-verde mb-4">
            la<br />Elda
          </div>
          <h1 className="font-playfair text-crema text-2xl font-bold">
            Admin Panel
          </h1>
          <p className="text-crema/40 text-sm font-josefin mt-1">
            Café La Elda 1941
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-cafe-oscuro border border-amarillo/15 rounded-2xl p-6 space-y-5"
        >
          <div>
            <label className="block text-crema/60 text-sm font-josefin mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full bg-[#0f0a06] border border-amarillo/20 rounded-lg px-4 py-3 text-crema placeholder-crema/30 font-josefin text-sm focus:border-amarillo transition-colors"
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-josefin bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-amarillo text-verde font-josefin font-bold text-sm uppercase tracking-wider py-3 rounded-lg hover:bg-amarillo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-crema/40 hover:text-crema/60 text-xs font-josefin transition-colors"
          >
            ← Volver al sitio
          </a>
        </div>
      </div>
    </div>
  );
}
