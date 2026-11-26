import { expect, test } from "@playwright/test";

import { KEYS, seedStorage } from "./helpers";

/*
 * Gera capturas da landing page e do App Shell para revisão visual. Não
 * compara pixels: os arquivos vão para `test-results/screenshots/` (fora do
 * Git). Os botões de acesso da landing (v0.2.0) são uma mudança intencional,
 * então a referência visual da landing passa a ser a desta versão.
 */

const VIEWPORTS = [
  { name: "mobile", width: 360, height: 780 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

for (const theme of ["dark", "light"] as const) {
  for (const viewport of VIEWPORTS) {
    test(`captura da landing page: ${viewport.name}, tema ${theme}`, async ({ page }) => {
      await seedStorage(page, { [KEYS.theme]: theme });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");
      await expect(page.getByRole("link", { name: "Acessar Aurum" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Acessar plataforma" })).toBeVisible();
      await page.screenshot({
        path: `test-results/screenshots/landing-${viewport.name}-${theme}.png`,
        fullPage: true,
      });
    });

    test(`captura do App Shell: ${viewport.name}, tema ${theme}`, async ({ page }) => {
      await seedStorage(page, { [KEYS.theme]: theme });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/settings");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.screenshot({
        path: `test-results/screenshots/shell-${viewport.name}-${theme}.png`,
      });

      if (viewport.name === "mobile") {
        await page.getByRole("button", { name: "Abrir menu" }).click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.waitForTimeout(400); // fim da animação de entrada
        await page.screenshot({ path: `test-results/screenshots/shell-mobile-menu-${theme}.png` });
      } else {
        await page.getByRole("button", { name: "Recolher menu" }).click();
        await page.goto("/credit-cards");
        await page.screenshot({
          path: `test-results/screenshots/shell-desktop-collapsed-${theme}.png`,
        });
      }
    });
  }
}
