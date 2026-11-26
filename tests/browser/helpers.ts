import { expect, type Page } from "@playwright/test";

/* Utilitários compartilhados dos testes de navegador. */

export const WIDTHS = [360, 768, 1280, 1920] as const;

export const APP_ROUTES = [
  { path: "/dashboard", title: "Visão geral" },
  { path: "/transactions", title: "Transações" },
  { path: "/accounts", title: "Contas bancárias" },
  { path: "/credit-cards", title: "Cartões de crédito" },
  { path: "/planning", title: "Planejamento" },
  { path: "/receivables", title: "A receber" },
  { path: "/goals", title: "Metas e wishlist" },
  { path: "/investments", title: "Investimentos" },
  { path: "/reports", title: "Relatórios" },
  { path: "/settings", title: "Configurações" },
] as const;

export const KEYS = {
  theme: "aurum:theme",
  sidebar: "aurum:sidebar",
  values: "aurum:values",
} as const;

/** Registra erros de console e de página (inclui erros de hidratação do React). */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/** Define preferências antes de qualquer script da página rodar. */
export async function seedStorage(page: Page, values: Record<string, string>): Promise<void> {
  await page.addInitScript((entries) => {
    // Só na primeira carga da aba, para não desfazer escolhas feitas no teste.
    if (window.sessionStorage.getItem("__seeded")) return;
    for (const [key, value] of Object.entries(entries)) window.localStorage.setItem(key, value);
    window.sessionStorage.setItem("__seeded", "1");
  }, values);
}

export async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(overflow.scrollWidth, "a página não pode rolar na horizontal").toBeLessThanOrEqual(
    overflow.innerWidth,
  );
}

type RootState = {
  dark: boolean;
  sidebar: string | null;
  values: string | null;
  themeColor: string | null | undefined;
};

function snapshotRoot(): RootState {
  return {
    dark: document.documentElement.classList.contains("dark"),
    sidebar: document.documentElement.getAttribute("data-sidebar"),
    values: document.documentElement.getAttribute("data-values"),
    themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
  };
}

/**
 * Registra o estado do <html> no instante em que o <body> é criado: depois do
 * script inline do <head> e antes de qualquer conteúdo ser pintado ou de o
 * React hidratar. É o que a pessoa veria na primeira pintura.
 */
export async function captureFirstPaintState(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const record = () => {
      const root = document.documentElement;
      (window as unknown as { __firstPaint: unknown }).__firstPaint = {
        dark: root.classList.contains("dark"),
        sidebar: root.getAttribute("data-sidebar"),
        values: root.getAttribute("data-values"),
        themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
      };
    };
    const observer = new MutationObserver(() => {
      if (document.body) {
        observer.disconnect();
        record();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });
}

export async function readFirstPaintState(page: Page): Promise<RootState> {
  return page.evaluate(() => (window as unknown as { __firstPaint: RootState }).__firstPaint);
}

export async function readRootState(page: Page): Promise<RootState> {
  return page.evaluate(snapshotRoot);
}
