import Image from "next/image";
import { asset } from "@/lib/infos";
import type { StockPhoto } from "@/lib/stockPhotos";

type Props = {
  photo: StockPhoto;
  /** Largeur affichée selon l'écran, pour que le navigateur choisisse la bonne résolution. */
  sizes?: string;
  /** Uniquement pour la grande image en haut de page (héros). */
  preload?: boolean;
  className?: string;
};

/**
 * Photo plein cadre : le parent fixe la taille (`relative` + ratio ou hauteur).
 * `unoptimized` : site statique, fichiers servis tels quels depuis public/.
 */
export default function StockImage({
  photo,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  preload = false,
  className = "",
}: Props) {
  return (
    <Image
      src={asset(photo.src)}
      alt={photo.alt}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized
      className={`object-cover ${className}`}
    />
  );
}
