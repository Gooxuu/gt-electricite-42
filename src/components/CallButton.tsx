import Icon from "@/components/Icons";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/infos";

type Props = {
  /** Texte avant le numéro, ex. « Appeler en urgence le ». */
  label?: string;
  size?: "md" | "lg" | "xl";
  className?: string;
};

const SIZES = {
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
  xl: "px-8 py-5 text-lg",
} as const;

/**
 * Bouton d'appel principal : halo qui pulse, combiné qui « sonne » de temps en temps, reflet au survol.
 * Animations en CSS (globals.css), coupées avec « Réduire les animations ».
 */
export default function CallButton({ label = "Appeler le", size = "md", className = "" }: Props) {
  return (
    <a
      href={PHONE_TEL}
      className={`cta-pulse cta-shine relative inline-flex items-center justify-center gap-2 rounded-full bg-accent font-bold text-brand-deep hover:bg-accent-light ${SIZES[size]} ${className}`}
    >
      <Icon name="phone" className="cta-ring size-5 shrink-0" />
      <span>
        {label} <span className="whitespace-nowrap">{PHONE_DISPLAY}</span>
      </span>
    </a>
  );
}
