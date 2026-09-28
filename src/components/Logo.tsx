import Image from "next/image";
import { BRAND, LOGO_FILE, asset } from "@/lib/infos";

/**
 * Logo de l'artisan. Sans fichier (LOGO_FILE = null) : logo texte composé à partir de BRAND,
 * en attendant le vrai logo.
 */
export default function Logo({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  if (LOGO_FILE) {
    return (
      <Image
        src={asset(LOGO_FILE)}
        alt={`${BRAND} — logo`}
        width={160}
        height={64}
        unoptimized
        className={className || "h-12 w-auto"}
      />
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight ${
        tone === "dark" ? "text-white" : "text-brand"
      } ${className}`}
    >
      <span aria-hidden="true" className="inline-block size-3 rotate-45 rounded-sm bg-accent" />
      {BRAND}
    </span>
  );
}
