import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Testes unitários de funções puras, em ambiente Node (sem DOM real).
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    restoreMocks: true,
    unstubGlobals: true,
  },
});
