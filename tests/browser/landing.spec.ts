import { expect, type Page, test } from "@playwright/test";

import { KEYS, collectErrors, expectNoHorizontalScroll, seedStorage } from "./helpers";

/*
 * Navegação entre a landing page (`/`) e as páginas internas (`/dashboard`):
 * os dois botões de acesso da landing e o logotipo do App Shell como caminho
 * de volta, com a sidebar expandida, recolhida e no menu mobile.
 */

const LANDING_TITLE = "Seu dinheiro, com clareza e intenção.";
const HOME_LINK = "Aurum Finances, ir para a página inicial";

async function expectLanding(page: Page): Promise<void> {
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(LANDING_TITLE);
  await expect(page.getByRole("navigation", { name: "Navegação principal" })).toHaveCount(0);
}

async function expectDashboard(page: Page): Promise<void> {
  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Visão geral");
}

/** Confirma que a navegação foi no cliente (sem recarregar o documento). */
async function markDocument(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as { __sameDocument: boolean }).__sameDocument = true;
  });
}

async function expectSameDocument(page: Page): Promise<void> {
  const same = await page.evaluate(
    () => (window as unknown as { __sameDocument?: boolean }).__sameDocument === true,
  );
  expect(same, "a navegação deve ser feita pelo roteador do Next.js").toBe(true);
}

test.describe("Landing page → App Shell (desktop)", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("o botão do cabeçalho leva ao dashboard e o logotipo traz de volta", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    await markDocument(page);

    const headerButton = page.getByRole("banner").getByRole("link", { name: "Acessar Aurum" });
    await expect(headerButton).toBeVisible();
    await expect(headerButton).toHaveAttribute("href", "/dashboard");
    await headerButton.click();
    await expectDashboard(page);

    const sidebar = page.locator("#app-sidebar");
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(nav.getByRole("link", { name: "Visão geral" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    const logo = sidebar.getByRole("link", { name: HOME_LINK });
    await expect(logo).toHaveAttribute("href", "/");
    await expect(logo).not.toHaveAttribute("aria-current", /.*/);
    await logo.click();
    await expectLanding(page);
    await expectSameDocument(page);
    expect(errors).toEqual([]);
  });

  test("o botão principal leva ao dashboard", async ({ page }) => {
    await page.goto("/");
    await markDocument(page);
    const cta = page.getByRole("main").getByRole("link", { name: "Acessar plataforma" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/dashboard");
    await cta.click();
    await expectDashboard(page);
    await expectSameDocument(page);
  });

  test("o logotipo volta à landing com a sidebar recolhida", async ({ page }) => {
    await seedStorage(page, { [KEYS.sidebar]: "collapsed" });
    await page.goto("/transactions");
    const sidebar = page.locator("#app-sidebar");
    await expect(sidebar).toHaveCSS("width", "72px");

    // A página ativa continua marcada, e o logotipo não disputa essa marcação.
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(nav.getByRole("link", { name: "Transações" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    const logo = sidebar.getByRole("link", { name: HOME_LINK });
    await expect(logo).toBeVisible();
    await logo.click();
    await expectLanding(page);

    // Ao voltar para o App Shell, a preferência de sidebar recolhida se mantém.
    await page.getByRole("link", { name: "Acessar plataforma" }).click();
    await expectDashboard(page);
    await expect(sidebar).toHaveCSS("width", "72px");
  });

  test("os botões de acesso funcionam só com o teclado", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const headerButton = page.getByRole("link", { name: "Acessar Aurum" });
    await expect(headerButton).toBeFocused();
    const outline = await headerButton.evaluate(
      (element) => getComputedStyle(element).outlineStyle,
    );
    expect(outline, "o foco deve ser visível").not.toBe("none");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Acessar plataforma" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expectDashboard(page);
  });
});

test.describe("Landing page → App Shell (mobile)", () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test("os botões cabem em 360px e o logotipo do menu volta à landing", async ({ page }) => {
    await page.goto("/");
    await expectNoHorizontalScroll(page);
    const headerButton = page.getByRole("link", { name: "Acessar Aurum" });
    const cta = page.getByRole("link", { name: "Acessar plataforma" });
    await expect(headerButton).toBeInViewport();
    await expect(cta).toBeVisible();

    // Alvos de toque com pelo menos 36px de altura.
    for (const target of [headerButton, cta]) {
      const box = await target.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(36);
    }

    await cta.click();
    await expectDashboard(page);

    await page.getByRole("button", { name: "Abrir menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu de navegação" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Visão geral" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await dialog.getByRole("link", { name: HOME_LINK }).click();
    await expect(dialog).toBeHidden();
    await expectLanding(page);
  });

  test("o logotipo do header mobile também volta à landing", async ({ page }) => {
    await page.goto("/goals");
    await page.getByRole("banner").getByRole("link", { name: HOME_LINK }).click();
    await expectLanding(page);
  });
});
