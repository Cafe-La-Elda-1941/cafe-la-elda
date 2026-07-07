interface SectionHeaderProps {
  label: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
  accentColor?: "verde" | "amarillo";
}

export function SectionHeader({
  label,
  title,
  titleAccent,
  subtitle,
  centered = false,
  dark = false,
  accentColor = "verde",
}: SectionHeaderProps) {
  const labelCn = dark ? "text-amarillo" : "text-verde-claro";
  const lineCn = dark ? "bg-amarillo" : "bg-verde-claro";
  const titleCn = dark ? "text-crema" : "text-texto";
  const subtitleCn = dark ? "text-crema/60" : "text-cafe-medio/65";
  const accentCn = accentColor === "amarillo" ? "text-amarillo" : "text-verde";

  return (
    <div className={centered ? "text-center" : ""}>
      <div className={`flex items-center gap-3 mb-3 text-[11px] tracking-[4px] uppercase ${labelCn} ${centered ? "justify-center" : ""}`}>
        <span className={`h-px max-w-10 flex-1 ${lineCn}`} />
        {label}
        <span className={`h-px max-w-10 flex-1 ${lineCn}`} />
      </div>

      <h2 className={`font-playfair font-bold mb-4 leading-[1.1] ${titleCn}`} style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
        {title}
        {titleAccent && (
          <>
            <br />
            <em className={`italic ${accentCn}`}>{titleAccent}</em>
          </>
        )}
      </h2>

      {subtitle && (
        <p className={`font-cormorant italic text-lg max-w-[560px] ${subtitleCn} ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
