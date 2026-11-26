import { expect, test, type Page } from "@playwright/test";

import {
  KEYS,
  captureFirstPaintState,
  collectErrors,
  readFirstPaintState,
  readRootState,
  seedStorage,
} from "./helpers";

const DARK_COLOR = "#101014";
const LIGHT_COLOR = "#f8f6f3";

async function chooseTheme(page: Page, label: "Claro" | "Escuro" | "Automático") {
  await page.getByRole("button", { name: "Tema da interface" }).click();
  await page.getByRole("menuitemradio", { name: label }).click();
}

test.describe("Temas", () => {
  test("o tema escuro é o padrão desde a primeira pintura", async ({ page }) => {
    await captureFirstPaintState(page);
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/dashboard");

    expect(await readFirstPaintState(page)).toMatchObject({ dark: true, themeColor: DARK_COLOR });
  });

  test("a escolha persiste após recarregar, sem flash", async ({ page }) => {
    const errors = collectErrors(page);
    await captureFirstPaintState(page);
    await page.goto("/dashboard");

    await chooseTheme(page, "Claro");
    expect(await readRootState(page)).toMatchObject({ dark: false, themeColor: LIGHT_COLOR });
    expect(await page.evaluate((key) => localStorage.getItem(key), KEYS.theme)).toBe("light");

    await page.reload();
    expect(await readFirstPaintState(page)).toMatchObject({ dark: false, themeColor: LIGHT_COLOR });
    await expect(page.getByRole("button", { name: "Tema da interface" })).toBeVisible();
    expect(await readRootState(page)).toMatchObject({ dark: false });

    await chooseTheme(page, "Escuro");
    expect(await readRootState(page)).toMatchObject({ dark: true, themeColor: DARK_COLOR });
    expect(errors).toEqual([]);
  });

  test("o modo automático acompanha o sistema operacional, inclusive ao vivo", async ({ page }) => {
    await seedStorage(page, { [KEYS.theme]: "system" });
    await captureFirstPaintState(page);
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/dashboard");
    expect(await readFirstPaintState(page)).toMatchObject({ dark: false, themeColor: LIGHT_COLOR });

    await page.emulateMedia({ colorScheme: "dark" });
    await expect
      .poll(() => readRootState(page))
      .toMatchObject({ dark: true, themeColor: DARK_COLOR });

    await page.emulateMedia({ colorScheme: "light" });
    await expect.poll(() => readRootState(page)).toMatchObject({ dark: false });
  });

  test("sincroniza o tema entre abas", async ({ context }) => {
    const first = await context.newPage();
    const second = await context.newPage();
    await first.goto("/dashboard");
    await second.goto("/settings");

    await chooseTheme(first, "Claro");
    await expect.poll(() => readRootState(second)).toMatchObject({ dark: false });

    await chooseTheme(first, "Escuro");
    await expect.poll(() => readRootState(second)).toMatchObject({ dark: true });
  });

  test("a página de Configurações altera o tema", async ({ page }) => {
    await page.goto("/settings");
    await page.getByRole("combobox", { name: "Tema" }).click();
    await page.getByRole("option", { name: "Claro" }).click();
    expect(await readRootState(page)).toMatchObject({ dark: false });
    await expect(page.getByRole("combobox", { name: "Tema" })).toHaveText("Claro");
  });

  test("valores corrompidos no localStorage caem nos padrões", async ({ page }) => {
    const errors = collectErrors(page);
    await seedStorage(page, {
      [KEYS.theme]: '{"broken":',
      [KEYS.sidebar]: "sideways",
      [KEYS.values]: "1",
    });
    await captureFirstPaintState(page);
    await page.goto("/dashboard");

    expect(await readFirstPaintState(page)).toMatchObject({
      dark: true,
      sidebar: "expanded",
      values: "visible",
    });
    expect(errors).toEqual([]);
  });

  test("funciona com localStorage bloqueado (só em memória)", async ({ page }) => {
    const errors = collectErrors(page);
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new DOMException("Bloqueado", "SecurityError");
        },
      });
    });
    await captureFirstPaintState(page);
    await page.goto("/dashboard");

    expect(await readFirstPaintState(page)).toMatchObject({ dark: true, values: "visible" });

    await chooseTheme(page, "Claro");
    expect(await readRootState(page)).toMatchObject({ dark: false });

    // Sem persistência possível, recarregar volta ao padrão, sem erros.
    await page.reload();
    expect(await readRootState(page)).toMatchObject({ dark: true });
    expect(errors).toEqual([]);
  });
});
