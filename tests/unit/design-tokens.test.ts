import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { THEME_COLORS } from "@/config/preferences";

/*
 * Verifica o contraste WCAG 2.x dos tokens definidos em src/app/globals.css.
 * - Texto normal: >= 4.5:1 (AA, critério 1.4.3).
 * - Contornos de componentes e indicadores de foco: >= 3:1 (critério 1.4.11).
 * A tabela resultante está em docs/DESIGN_SYSTEM.md.
 */

const css = readFileSync(new URL("../../src/app/globals.css", import.meta.url), "utf8");

function readBlock(selector: RegExp): Record<string, string> {
  const match = selector.exec(css);
  if (!match) throw new Error(`Bloco não encontrado: ${selector}`);
  const start = css.indexOf("{", match.index);
  const end = css.indexOf("}", start);
  const tokens: Record<string, string> = {};
  for (const [, name, value] of css.slice(start + 1, end).matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    if (name && value) tokens[name] = value.trim();
  }
  return tokens;
}

const themes = {
  light: readBlock(/^:root,\s*\n\.light\s*\{/m),
  dark: readBlock(/^\.dark\s*\{/m),
};

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

const TEXT_PAIRS: [foreground: string, background: string][] = [
  ["foreground", "background"],
  ["foreground", "surface"],
  ["foreground", "surface-elevated"],
  ["muted-foreground", "background"],
  ["muted-foreground", "surface"],
  ["muted-foreground", "surface-elevated"],
  ["muted-foreground", "muted"],
  ["highlight-foreground", "highlight"],
  ["muted-foreground", "highlight"],
  ["accent", "background"],
  ["accent", "surface"],
  ["accent", "highlight"],
  ["gold", "background"],
  ["gold", "surface"],
  ["success", "background"],
  ["success", "surface"],
  ["danger", "background"],
  ["danger", "surface"],
  ["primary-foreground", "primary"],
  ["accent-foreground", "accent"],
  ["gold-foreground", "gold"],
  ["success-foreground", "success"],
  ["danger-foreground", "danger"],
  // Tooltip: fundo `foreground` com texto `background`.
  ["background", "foreground"],
];

const NON_TEXT_PAIRS: [component: string, background: string][] = [
  ["input", "background"],
  ["input", "surface"],
  ["input", "surface-elevated"],
  ["ring", "background"],
  ["ring", "surface"],
  ["gold", "muted"],
];

describe.each(Object.entries(themes))("tema %s", (theme, tokens) => {
  const color = (name: string) => {
    const value = tokens[name];
    if (!value?.startsWith("#")) throw new Error(`Token sem cor hex no tema ${theme}: ${name}`);
    return value;
  };

  it.each(TEXT_PAIRS)("texto %s sobre %s tem contraste AA (>= 4.5:1)", (fg, bg) => {
    expect(contrast(color(fg), color(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(NON_TEXT_PAIRS)("componente %s sobre %s tem contraste >= 3:1", (fg, bg) => {
    expect(contrast(color(fg), color(bg))).toBeGreaterThanOrEqual(3);
  });

  it("a cor da barra do navegador espelha --background", () => {
    expect(THEME_COLORS[theme as keyof typeof THEME_COLORS]).toBe(color("background"));
  });
});
