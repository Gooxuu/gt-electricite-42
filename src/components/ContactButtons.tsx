import CallButton from "@/components/CallButton";
import Icon from "@/components/Icons";
import { EMAIL, EMAIL_MAILTO, WHATSAPP_ENABLED, WHATSAPP_URL } from "@/lib/infos";

type Props = {
  /** « dark » : sur fond sombre. */
  tone?: "light" | "dark";
  size?: "md" | "lg";
  /** Ajoute un lien e-mail discret à côté des boutons. */
  showEmail?: boolean;
  className?: string;
};

const BASE = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors";
const SIZES = { md: "px-5 py-3 text-sm", lg: "px-7 py-4 text-base" } as const;

/** Les trois moyens de contact du site : appel, WhatsApp, e-mail. Aucun formulaire. */
export default function ContactButtons({ tone = "light", size = "md", showEmail = false, className = "" }: Props) {
  const secondary =
    tone === "dark"
      ? "border border-white/40 text-white hover:bg-white/10"
      : "border border-brand/30 text-brand hover:bg-brand/5";
  const mailLink = tone === "dark" ? "text-white/85 hover:text-white" : "text-brand hover:text-brand-deep";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <CallButton size={size} />
      {WHATSAPP_ENABLED && (
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`${BASE} ${SIZES[size]} ${secondary}`}>
          <Icon name="chat" className="size-5" />
          WhatsApp
        </a>
      )}
      {showEmail && (
        <a
          href={EMAIL_MAILTO}
          className={`inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline ${mailLink}`}
        >
          <Icon name="mail" className="size-5" />
          {EMAIL}
        </a>
      )}
    </div>
  );
}
