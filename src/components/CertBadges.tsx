import Icon from "@/components/Icons";
import { CERTIFICATIONS, type Certification } from "@/lib/infos";

type Props = {
  items?: readonly Certification[];
  tone?: "light" | "dark";
  className?: string;
};

/** Certifications réelles de l'artisan, en badges texte (jamais de reproduction des logos officiels). */
export default function CertBadges({ items = CERTIFICATIONS, tone = "light", className = "" }: Props) {
  if (items.length === 0) return null;
  const card = tone === "dark" ? "border-white/15 bg-white/5 text-white" : "border-line bg-white text-brand shadow-sm";
  const badge = tone === "dark" ? "bg-white/10 text-accent" : "bg-accent/20 text-brand";
  const detail = tone === "dark" ? "text-white/70" : "text-muted";

  return (
    <ul className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {items.map((cert) => (
        <li key={cert.id} className={`flex min-w-60 items-center gap-3 rounded-2xl border p-4 ${card}`}>
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${badge}`}>
            <Icon name="shield" className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold leading-tight">{cert.label}</span>
            <span className={`block text-xs ${detail}`}>{cert.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
