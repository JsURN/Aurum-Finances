import { expect, test, type Page } from "@playwright/test";

import {
  KEYS,
  WIDTHS,
  captureFirstPaintState,
  collectErrors,
  expectNoHorizontalScroll,
  readFirstPaintState,
  seedStorage,
} from "./helpers";

/*
 * Roda contra `next dev` (projeto "development"): a página /design-system só
 * existe em desenvolvimento. Concentra os testes dos componentes financeiros.
 */

// Qualquer valor em reais formatado: "1.234,56", "0,01"...
const MONEY_PATTERN = /\d{1,3}(?:\.\d{3})*,\d{2}/;
const MASK = "R$ •••••";

async function hideValues(page: Page) {
  const toggle = page.getByRole("button", { name: "Ocultar valores financeiros" }).first();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
}

/** Procura valores monetários em atributos que leitores de tela ou tooltips expõem. */
async function findMoneyInAttributes(page: Page): Promise<string[]> {
  return page.evaluate((source) => {
    const pattern = new RegExp(source);
    const attributes = ["title", "aria-label", "aria-valuetext", "aria-description", "alt"];
    const found: string[] = [];
    for (const element of document.querySelectorAll("*")) {
      for (const name of attributes) {
        const value = element.getAttribute(name);
        if (value && pattern.test(value)) found.push(`${element.tagName} [${name}="${value}"]`);
      }
    }
    return found;
  }, MONEY_PATTERN.source);
}

test.describe("Página /design-system", () => {
  test("carrega sem erros e sem scroll horizontal nas quatro larguras", async ({ page }) => {
    const errors = collectErrors(page);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/design-system");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Design System");
      await expectNoHorizontalScroll(page);
    }
    expect(errors).toEqual([]);
  });

  test("valores longos cabem nos cards em 360px, sem corte", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto("/design-system#financeiros");

    const problems = await page.evaluate(() => {
      const issues: string[] = [];
      for (const card of document.querySelectorAll("section.\\@container")) {
        const cardBox = card.getBoundingClientRect();
        if (card.scrollWidth > card.clientWidth) issues.push(`card com overflow: ${card.id}`);
        for (const money of card.querySelectorAll<HTMLElement>('[data-sensitive="value"]')) {
          const box = money.getBoundingClientRect();
          if (box.left < cardBox.left - 0.5 || box.right > cardBox.right + 0.5) {
            issues.push(`valor fora do card: ${money.textContent}`);
          }
          // Cada linha do valor deve terminar num separador de grupo (quebra só no <wbr>).
          const range = document.createRange();
          range.selectNodeContents(money);
          const lines = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));
          if (lines.size > 1 && !/\./.test(money.textContent ?? "")) {
            issues.push(`quebra inesperada: ${money.textContent}`);
          }
        }
      }
      return issues;
    });
    expect(problems).toEqual([]);

    // O maior valor suportado aparece completo, com todos os dígitos.
    await expect(page.getByText("R$ 90.071.992.547.409,91").first()).toBeVisible();
  });

  test("a ocultação de valores vale para Money, SummaryCard e ProgressBar", async ({ page }) => {
    await page.goto("/design-system");
    const main = page.locator("main");
    await expect(main).toContainText("R$ 24.380,55");

    await hideValues(page);

    // Nenhum valor monetário visível, em atributos ou na árvore de acessibilidade.
    expect(await main.innerText()).not.toMatch(MONEY_PATTERN);
    expect(await findMoneyInAttributes(page)).toEqual([]);
    // O placeholder "0,00" do campo de valor do formulário não é um valor do usuário.
    const tree = (await main.ariaSnapshot())
      .split("\n")
      .filter((line) => !line.includes("/placeholder:"))
      .join("\n");
    expect(tree).not.toMatch(MONEY_PATTERN);
    expect(tree).toContain("Valor oculto");

    // `innerText` reflete o que é renderizado (o valor real segue no HTML, com display: none).
    for (const money of await page.locator('[data-slot="money"]').all()) {
      if (!(await money.isVisible())) continue;
      const rendered = await money.innerText();
      expect(rendered).toContain(MASK);
      expect(rendered).not.toMatch(MONEY_PATTERN);
    }

    // SummaryCard: o nome acessível vem só do rótulo.
    await expect(page.getByRole("region", { name: "Saldo consolidado" })).toContainText(MASK);

    // ProgressBar: aria-valuetext só com percentual e status.
    const progress = page.getByRole("progressbar", { name: "Reserva de emergência" });
    await expect(progress).toHaveAttribute("aria-valuetext", "64%");

    // Tooltip do botão de ocultação também não mostra valores.
    // O ponteiro sai e volta: o tooltip abre num novo `pointerenter` após o clique.
    await page.mouse.move(0, 400);
    await page.getByRole("button", { name: "Ocultar valores financeiros" }).first().hover();
    await expect(page.getByRole("tooltip")).toHaveText("Mostrar valores");
  });

  test("a ocultação persiste sem flash de valores", async ({ page }) => {
    await seedStorage(page, { [KEYS.values]: "hidden" });
    await captureFirstPaintState(page);
    await page.goto("/design-system");

    expect((await readFirstPaintState(page)).values).toBe("hidden");
    // Os valores reais existem no HTML (não é segurança), mas não são exibidos.
    const firstValue = page.locator('[data-sensitive="value"]').first();
    await expect(firstValue).toBeHidden();
    await expect(page.locator('[data-sensitive="mask"]').first()).toBeVisible();
  });

  test("o modal prende o foco, fecha com Esc e devolve o foco", async ({ page }) => {
    await page.goto("/design-system#modais");
    const trigger = page.getByRole("button", { name: "Abrir modal" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Modal de exemplo" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription(/não são enviados nem salvos/);

    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
        true,
      );
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("o Select funciona pelo teclado", async ({ page }) => {
    await page.goto("/design-system#formularios");
    const select = page.getByRole("combobox", { name: "Conta" });
    await select.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(select).not.toHaveText("Selecione uma conta");
    await expect(select).toBeFocused();
  });
});
