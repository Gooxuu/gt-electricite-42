/** Chiffres seuls, sans le « (0) » que certains écrivent après l'indicatif (+33 (0)6…). */
const digits = (value: string) => value.replace(/\(0\)/g, "").replace(/\D/g, "");

/**
 * Vrai si le numéro affiché (format national « 06 12 34 56 78 » ou international « +33 6 … »)
 * est bien le numéro composé (format international « +33612345678 »).
 */
export function samePhoneNumber(display: string, e164: string): boolean {
  const shown = digits(display);
  const dialed = digits(e164);
  if (!shown || !dialed) return false;
  if (display.trim().startsWith("+")) return shown === dialed;
  // Format national : le 0 initial remplace l'indicatif du pays.
  return shown.startsWith("0") && dialed.length > shown.length - 1 && dialed.endsWith(shown.slice(1));
}
