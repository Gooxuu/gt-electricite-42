"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Léger soulèvement au survol (cartes, images). Aucun effet avec « Réduire les animations ». */
export default function HoverLift({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}
