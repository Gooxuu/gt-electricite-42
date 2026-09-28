import Icon from "@/components/Icons";
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_ENABLED, WHATSAPP_URL } from "@/lib/infos";

/**
 * Barre d'appel fixée en bas de l'écran sur mobile (sous 640 px), toujours à portée de pouce.
 * Le <body> réserve sa hauteur (layout.tsx) pour ne rien masquer du pied de page.
 */
export default function MobileCallBar() {
  return (
    <div
      className="callbar-in fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white/95 px-3 pt-3 backdrop-blur sm:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={PHONE_TEL}
        aria-label={`Appeler le ${PHONE_DISPLAY}`}
        className="cta-pulse relative flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-bold text-brand-deep"
      >
        <Icon name="phone" className="cta-ring size-5" />
        Appeler
      </a>
      {WHATSAPP_ENABLED && (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Écrire sur WhatsApp"
          className="flex items-center justify-center gap-2 rounded-full border border-brand/30 px-5 py-3.5 font-semibold text-brand"
        >
          <Icon name="chat" className="size-5" />
          WhatsApp
        </a>
      )}
    </div>
  );
}
