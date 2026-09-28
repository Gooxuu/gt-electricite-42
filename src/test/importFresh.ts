import { vi } from "vitest";

type Infos = typeof import("@/lib/infos");

/** Élargit les types littéraux (true → boolean, "Nom de l'entreprise" → string) : un test peut donner d'autres valeurs. */
type Widen<T> = T extends string ? string : T extends boolean ? boolean : T extends number ? number : T;

type Options = {
  /** Valeurs de lib/infos.ts à remplacer (les autres sont conservées). */
  infos?: { [K in keyof Infos]?: Widen<Infos[K]> };
  /** Variables d'environnement lues au chargement des modules (ex. NEXT_PUBLIC_BASE_PATH). */
  env?: Record<string, string>;
};

/**
 * Recharge les modules, puis importe `load()` avec d'autres réglages que ceux de la démo en cours.
 * Les tests restent ainsi valables quelle que soit la personnalisation de lib/infos.ts.
 *
 *   const { default: DemoBanner } = await importFresh(() => import("@/components/DemoBanner"), {
 *     infos: { DEMO_MODE: false },
 *   });
 *
 * Les variables d'environnement sont restaurées après chaque test (voir setup.ts).
 */
export async function importFresh<T>(load: () => Promise<T>, { infos, env = {} }: Options = {}): Promise<T> {
  vi.resetModules();
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  if (infos) {
    vi.doMock("@/lib/infos", async (importOriginal) => ({ ...(await importOriginal<Infos>()), ...infos }));
  }
  try {
    return await load();
  } finally {
    vi.doUnmock("@/lib/infos");
  }
}
