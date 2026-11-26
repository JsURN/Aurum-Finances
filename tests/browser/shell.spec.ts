import { expect, test } from "@playwright/test";

import {
  APP_ROUTES,
  KEYS,
  WIDTHS,
  collectErrors,
  expectNoHorizontalScroll,
  seedStorage,
} from "./helpers";

test.describe("App Shell", () => {
  for (const width of WIDTHS) {
    for (const theme of ["dark", "light"] as const) {
      test(`sem scroll horizontal nem erros em ${width}px (tema ${theme})`, async ({ page }) => {
        const errors = collectErrors(page);
        await seedStorage(page, { [KEYS.theme]: theme });
        await page.setViewportSize({ width, height: 900 });

        for (const route of [{ path: "/", title: "" }, ...APP_ROUTES]) {
          await page.goto(route.path);
          await expectNoHorizontalScroll(page);
          if (route.title) {
            await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.title);
          }
        }

        expect(errors).toEqual([]);
      });
    }
  }

  test("navega pela sidebar e marca a página ativa", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/dashboard");
    const nav = page.getByRole("navigation", { name: "Navegação principal" });

    for (const route of APP_ROUTES) {
      await nav.getByRole("link", { name: route.title }).click();
      await expect(page).toHaveURL(route.path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.title);
      await expect(nav.getByRole("link", { name: route.title })).toHaveAttribute(
        "aria-current",
        "page",
      );
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
      const trail = page.getByRole("navigation", { name: "Trilha de navegação" });
      await expect(trail.locator('[aria-current="page"]')).toHaveText(route.title);
    }
  });

  test("páginas em desenvolvimento não simulam dados", async ({ page }) => {
    await page.goto("/credit-cards");
    await expect(page.getByText("Este módulo está em desenvolvimento")).toBeVisible();
    await expect(page.getByText("Previsto para a Fase 7 do roadmap")).toBeVisible();
    await expect(page.locator("main")).not.toContainText("R$");
  });

  test("a landing page continua na rota principal, sem o App Shell", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Seu dinheiro, com clareza e intenção.",
    );
    await expect(page.getByRole("navigation", { name: "Navegação principal" })).toHaveCount(0);
  });

  test("a página /design-system não existe em produção", async ({ page }) => {
    const response = await page.goto("/design-system");
    expect(response?.status()).toBe(404);
    await page.goto("/settings");
    await expect(page.getByRole("link", { name: /Design System/ })).toHaveCount(0);
  });
});
