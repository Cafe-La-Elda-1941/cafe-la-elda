const stats = [
  { number: "4+", label: "Años de tradición" },
  { number: "100%", label: "Café colombiano" },
  { number: "8", label: "Productos únicos" },
  { number: "♥", label: "Agroecológico" },
];

export function StatsBar() {
  return (
    <div className="flex justify-center gap-8 md:gap-16 flex-wrap py-7 px-[5%] bg-verde border-t-[3px] border-t-amarillo border-b-[3px] border-b-amarillo-oscuro">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center text-crema">
          <div className="font-bebas text-amarillo text-5xl leading-none">
            {stat.number}
          </div>
          <div className="mt-1 uppercase tracking-[2px] opacity-80 text-[11px]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
