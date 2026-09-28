/**
 * Préférence « réduire les animations » simulée pour les tests.
 * `src/test/setup.ts` branche `useReducedMotion` de motion sur cette valeur.
 */
export const reducedMotion = { value: false };

export function setReducedMotion(value: boolean) {
  reducedMotion.value = value;
}
