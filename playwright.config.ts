import { defineConfig, devices } from "@playwright/test";

/*
 * Validação de navegador da Fase 2 (layout, temas, preferências, teclado).
 * Como reproduzir: `npx playwright install chromium` (uma vez) e
 * `npm run test:browser`. Detalhes em docs/DESIGN_SYSTEM.md.
 *
 * Dois servidores:
 * - production: `next build` + `next start` (o app como será publicado).
 * - development: `next dev` (porta 3000, reaproveitado se já estiver rodando),
 *   só para a página /design-system, que não existe
 *   em produção. O `next dev` usa `.next/dev`, então roda junto com o build.
 *
 * Nada gerado aqui é versionado: `test-results/` e `playwright-report/`
 * estão no .gitignore.
 */

const PROD_PORT = 3100;
// Porta padrão do `next dev`: se já houver um servidor de desenvolvimento rodando,
// ele é reaproveitado (o Next 16 não permite dois `next dev` no mesmo diretório).
const DEV_PORT = 3000;

export default defineConfig({
  testDir: "./tests/browser",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    ...devices["Desktop Chrome"],
    locale: "pt-BR",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "production",
      testIgnore: /design-system\.spec\.ts/,
      use: { baseURL: `http://localhost:${PROD_PORT}` },
    },
    {
      name: "development",
      testMatch: /design-system\.spec\.ts/,
      use: { baseURL: `http://localhost:${DEV_PORT}` },
    },
  ],
  webServer: [
    {
      command: `npm run build && npx next start -p ${PROD_PORT}`,
      url: `http://localhost:${PROD_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    },
    {
      command: `npx next dev -p ${DEV_PORT}`,
      url: `http://localhost:${DEV_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
