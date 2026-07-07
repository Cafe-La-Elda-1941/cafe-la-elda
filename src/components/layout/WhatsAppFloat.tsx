"use client";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/3107109852?text=Hola!%20Me%20interesa%20Café%20La%20Elda%201941"
      target="_blank"
      rel="noopener noreferrer"
      title="WhatsApp"
      className="fixed bottom-8 right-8 z-50 w-[60px] h-[60px] rounded-full flex items-center justify-center text-[28px] text-white no-underline transition-all duration-300 animate-pulse-wa hover:scale-110 bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.4)]"
    >
      💬
    </a>
  );
}
