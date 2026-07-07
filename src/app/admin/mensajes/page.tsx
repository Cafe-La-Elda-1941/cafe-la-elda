"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string; name: string; phone: string | null; email: string | null;
  product: string | null; message: string; read: boolean; createdAt: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminMensajes() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/messages").then((r) => r.json()).then(setMessages).finally(() => setLoading(false));
  }, []);

  const toggleRead = async (id: string, read: boolean) => {
    const res = await fetch(`/api/admin/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: !read }) });
    if (res.ok) setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: !read } : m)));
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) { setMessages((prev) => prev.filter((m) => m.id !== id)); if (selected === id) setSelected(null); }
  };

  const unread = messages.filter((m) => !m.read).length;
  const msg = messages.find((m) => m.id === selected);

  if (loading) return <div className="flex items-center justify-center h-64 text-crema/30">Cargando...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-crema mb-1">Mensajes</h1>
        <p className="text-sm text-crema/50">{messages.length} mensajes · {unread} sin leer</p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 rounded-xl bg-crema/[0.04] border border-crema/[0.08]">
          <div className="text-5xl mb-4">✉️</div>
          <p className="font-cormorant italic text-lg text-crema/50">No hay mensajes aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto dark-scrollbar pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => { setSelected(m.id); if (!m.read) toggleRead(m.id, m.read); }}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  selected === m.id
                    ? "bg-amarillo/[0.08] border-amarillo/30"
                    : "bg-crema/[0.04] border-crema/[0.08] hover:bg-crema/[0.06]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${m.read ? "bg-transparent" : "bg-rojo"}`} />
                  <span className={`text-sm font-medium truncate ${m.read ? "text-crema/60" : "text-crema"}`}>{m.name}</span>
                </div>
                <p className="text-xs text-crema/40 truncate ml-4">{m.message}</p>
                <div className="text-[10px] text-crema/30 ml-4 mt-1">{formatDate(m.createdAt)}</div>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {msg ? (
              <div className="rounded-xl p-6 bg-crema/[0.04] border border-crema/[0.08]">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-playfair text-xl text-crema">{msg.name}</h3>
                    <p className="text-xs text-crema/40 mt-1">{formatDate(msg.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleRead(msg.id, msg.read)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer border-none bg-crema/[0.08] text-crema hover:bg-crema/15 transition-colors">
                      {msg.read ? "No leído" : "Leído"}
                    </button>
                    <button onClick={() => deleteMsg(msg.id)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer border-none bg-rojo/15 text-rojo hover:bg-rojo/25 transition-colors">
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-crema/[0.04]">
                  {msg.phone && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-crema/40 mb-1">Teléfono</div>
                      <a href={`https://wa.me/${msg.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-verde-claro no-underline hover:underline">{msg.phone}</a>
                    </div>
                  )}
                  {msg.email && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-crema/40 mb-1">Email</div>
                      <a href={`mailto:${msg.email}`} className="text-sm text-verde-claro no-underline hover:underline">{msg.email}</a>
                    </div>
                  )}
                  {msg.product && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-crema/40 mb-1">Producto</div>
                      <span className="text-sm text-crema">{msg.product}</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] uppercase tracking-wider text-crema/40 mb-2">Mensaje</div>
                <p className="font-cormorant italic text-[17px] text-crema/70 leading-[1.8]">{msg.message}</p>

                <div className="flex gap-3 mt-6">
                  {msg.phone && (
                    <a href={`https://wa.me/${msg.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${msg.name}, gracias por contactar Café La Elda. `)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg no-underline text-sm font-medium bg-[#25D366] text-white">
                      💬 WhatsApp
                    </a>
                  )}
                  {msg.email && (
                    <a href={`mailto:${msg.email}?subject=Re: Consulta Café La Elda`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg no-underline text-sm bg-crema/[0.08] text-crema hover:bg-crema/15 transition-colors">
                      ✉️ Email
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 rounded-xl bg-crema/[0.04] border border-crema/[0.08]">
                <p className="text-sm text-crema/30">Selecciona un mensaje</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
