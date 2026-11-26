import {
  DEFAULT_PREFERENCES,
  PREFERENCE_KEYS,
  SIDEBAR_STATES,
  THEME_COLORS,
  THEME_PREFERENCES,
  VALUES_VISIBILITY,
} from "@/config/preferences";
import type { StorageLike } from "@/lib/preferences";

/*
 * Aplica as preferências salvas no <html>: classe `dark`, `data-sidebar`,
 * `data-values` e a cor da barra do navegador (ADR-007 e ADR-008).
 *
 * Roda em dois momentos, sempre com esta mesma função:
 * 1. Como script inline no <head>, antes da primeira pintura (sem flash de
 *    tema nem de valores financeiros).
 * 2. No cliente, pelo `PreferencesSync`, quando uma preferência muda (nesta
 *    aba, em outra aba ou no sistema operacional) e após o remount do Strict Mode.
 *
 * Como é serializada com `toString()`, precisa ser autocontida: nada de
 * imports, helpers externos ou sintaxe que dependa de transpilação.
 * Testada em `tests/unit/preferences-script.test.ts`.
 */

export type PreferencesScriptConfig = {
  keys: typeof PREFERENCE_KEYS;
  defaults: typeof DEFAULT_PREFERENCES;
  options: {
    theme: readonly string[];
    sidebar: readonly string[];
    values: readonly string[];
  };
  colors: typeof THEME_COLORS;
};

export const preferencesScriptConfig: PreferencesScriptConfig = {
  keys: PREFERENCE_KEYS,
  defaults: DEFAULT_PREFERENCES,
  options: { theme: THEME_PREFERENCES, sidebar: SIDEBAR_STATES, values: VALUES_VISIBILITY },
  colors: THEME_COLORS,
};

export function applyPreferences(config: PreferencesScriptConfig, storage?: StorageLike): void {
  function read(name: "theme" | "sidebar" | "values"): string {
    let value: string | null = null;
    try {
      value = (storage || window.localStorage).getItem(config.keys[name]);
    } catch {
      value = null;
    }
    return value !== null && config.options[name].indexOf(value) !== -1
      ? value
      : config.defaults[name];
  }

  let systemDark = false;
  try {
    systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    systemDark = false;
  }

  const preference = read("theme");
  const theme = preference === "system" ? (systemDark ? "dark" : "light") : preference;
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-sidebar", read("sidebar"));
  root.setAttribute("data-values", read("values"));

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta)
    meta.setAttribute("content", theme === "dark" ? config.colors.dark : config.colors.light);
}

/** Código do script inline do <head>. */
export function getPreferencesScript(): string {
  return `(${applyPreferences.toString()})(${JSON.stringify(preferencesScriptConfig)})`;
}
