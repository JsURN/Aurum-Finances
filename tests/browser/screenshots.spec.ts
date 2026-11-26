import { expect, test } from "@playwright/test";

import { KEYS, seedStorage } from "./helpers";

/*
 * Gera capturas do App Shell para revisão visual. Não compara pixels: os
 * arquivos vão para `test-results/screenshots/` (fora do Git).
 */

const VIEWPORTS = [
  { name: "mobile", width: 360, height: 780 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

for (const theme of ["dark", "light"] as const) {
  for (const viewport of VIEWPORTS) {
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
