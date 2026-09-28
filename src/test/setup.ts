import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { reducedMotion } from "./reducedMotion";

afterEach(() => {
  cleanup();
  reducedMotion.value = false;
  vi.unstubAllEnvs();
});

// `useReducedMotion` suit `setReducedMotion()` au lieu de window.matchMedia (absent de jsdom).
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  const { reducedMotion: state } = await import("./reducedMotion");
  return { ...actual, useReducedMotion: () => state.value };
});

/**
 * jsdom n'implémente pas IntersectionObserver (utilisé par `whileInView` et `useInView` de motion).
 * Simulation : tout élément observé est signalé visible au tick suivant.
 */
class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    queueMicrotask(() =>
      this.callback(
        [
          {
            target,
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRect: target.getBoundingClientRect(),
            rootBounds: null,
            time: 0,
          },
        ],
        this,
      ),
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
