import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Vite 8 lit directement l'alias « @/* » de tsconfig.json.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    // Reproduit `trailingSlash: true` de next.config.ts : next/link garde alors la barre finale, comme au build.
    env: { __NEXT_TRAILING_SLASH: "true" },
  },
});
