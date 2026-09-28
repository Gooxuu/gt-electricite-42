"use client";

/**
 * Année courante calculée dans le navigateur : le copyright ne se fige jamais.
 * `suppressHydrationWarning` couvre un changement d'année entre le build et la visite.
 */
export default function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
