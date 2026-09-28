"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Décalage en secondes, pour faire apparaître les éléments d'une grille l'un après l'autre. */
  delay?: number;
  className?: string;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Apparition en fondu + léger glissement vers le haut à l'entrée dans l'écran (une seule fois).
 * « Réduire les animations » : affichage immédiat, sans déplacement.
 * Le rendu initial est le même dans les deux cas (pas d'écart d'hydratation) ; seule la transition change.
 * La classe `reveal` permet au <noscript> du layout de tout afficher sans JavaScript.
 */
export default function Reveal({ children, delay = 0, className = "" }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`reveal ${className}`.trim()}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
