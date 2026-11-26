import { expect, test } from "@playwright/test";

import { captureFirstPaintState, expectNoHorizontalScroll, readFirstPaintState } from "./helpers";

test.describe("Sidebar do desktop", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("recolhe, mostra tooltip, persiste após recarregar e expande", async ({ page }) => {
    await captureFirstPaintState(page);
    await page.goto("/dashboard");
    const sidebar = page.locator("#app-sidebar");
    const toggle = page.getByRole("button", { name: "Recolher menu" });

    await expect(sidebar).toHaveCSS("width", "256px");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await toggle.click();
    await expect(sidebar).toHaveCSS("width", "72px");
    const expand = page.getByRole("button", { name: "Expandir menu" });
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await expectNoHorizontalScroll(page);

    // O rótulo continua acessível e aparece como tooltip no hover.
    const link = page.getByRole("link", { name: "Transações" });
    await expect(link).toBeVisible();
    await link.hover();
    await expect(page.getByRole("tooltip")).toHaveText("Transações");

    await page.reload();
    expect((await readFirstPaintState(page)).sidebar).toBe("collapsed");
    await expect(sidebar).toHaveCSS("width", "72px");

    await page.getByRole("button", { name: "Expandir menu" }).click();
    await expect(sidebar).toHaveCSS("width", "256px");
    await page.reload();
    expect((await readFirstPaintState(page)).sidebar).toBe("expanded");
  });
});

test.describe("Menu mobile", () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test("abre com foco preso, fecha com Esc e devolve o foco", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("#app-sidebar")).toBeHidden();

    const trigger = page.getByRole("button", { name: "Abrir menu" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Menu de navegação" });
    await expect(dialog).toBeVisible();

    for (let index = 0; index < 15; index += 1) {
      await page.keyboard.press("Tab");
      const insideDialog = await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      );
      expect(insideDialog, "o foco deve permanecer no menu").toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("fecha ao navegar e mostra só a página atual na trilha", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu de navegação" });
    await dialog.getByRole("link", { name: "Metas e wishlist" }).click();

    await expect(page).toHaveURL("/goals");
    await expect(dialog).toBeHidden();
    const trail = page.getByRole("navigation", { name: "Trilha de navegação" });
    await expect(trail.getByText("Metas e wishlist")).toBeVisible();
    await expect(trail.getByRole("link", { name: "Aurum" })).toBeHidden();
  });
});

test.describe("Teclado", () => {
  test("o primeiro Tab mostra o link para pular a navegação", async ({ page }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#content")).toBeFocused();
  });

  test("o foco é visível nos controles", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/dashboard");
    const button = page.getByRole("button", { name: "Tema da interface" });
    await button.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    const outline = await button.evaluate((element) => getComputedStyle(element).outlineStyle);
    expect(outline).not.toBe("none");
  });

  test("o menu de tema funciona só com o teclado", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Tema da interface" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toBeVisible();
    // Aberto pelo teclado, o foco vai para o primeiro item (ordem: Claro, Escuro, Automático).
    await expect(page.getByRole("menuitemradio", { name: "Claro" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitemradio", { name: "Escuro" })).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(page.getByRole("menuitemradio", { name: "Claro" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(page.getByRole("button", { name: "Tema da interface" })).toBeFocused();
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });

  test("as abas de Configurações seguem o padrão de setas", async ({ page }) => {
    await page.goto("/settings");
    await page.getByRole("tab", { name: "Aparência" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Exibição" })).toBeFocused();
    await expect(page.getByRole("tab", { name: "Exibição" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(
      page.getByRole("button", { name: "Ocultar valores financeiros" }).last(),
    ).toBeVisible();
  });
});
