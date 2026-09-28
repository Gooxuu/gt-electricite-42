import Link from "next/link";
import { Container } from "@/components/Section";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted">Erreur 404</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-brand">Cette page n’existe pas</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">Le lien est peut-être incorrect ou la page a été déplacée.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-accent px-7 py-4 font-semibold text-brand-deep transition-colors hover:bg-accent-light"
        >
          Retour à l’accueil
        </Link>
      </Container>
    </section>
  );
}
