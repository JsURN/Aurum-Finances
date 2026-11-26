/*
 * Preferências de interface persistidas no navegador (ADR-007 e ADR-008).
 * Estas chaves e valores padrão são usados tanto pelo script inline do <head>
 * quanto pelos componentes cliente, para que ambos sempre concordem.
 */

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = Exclude<ThemePreference, "system">;

export const SIDEBAR_STATES = ["expanded", "collapsed"] as const;
export type SidebarState = (typeof SIDEBAR_STATES)[number];

export const VALUES_VISIBILITY = ["visible", "hidden"] as const;
export type ValuesVisibility = (typeof VALUES_VISIBILITY)[number];

export type Preferences = {
  theme: ThemePreference;
  sidebar: SidebarState;
  values: ValuesVisibility;
};

export const PREFERENCE_KEYS = {
  theme: "aurum:theme",
  sidebar: "aurum:sidebar",
  values: "aurum:values",
} as const satisfies Record<keyof Preferences, string>;

export const DEFAULT_PREFERENCES = {
  theme: "dark",
  sidebar: "expanded",
  values: "visible",
} as const satisfies Preferences;

/**
 * Cor da barra do navegador (`<meta name="theme-color">`) por tema.
 * Precisa ser literal; espelha `--background` em `src/app/globals.css`
 * (a correspondência é verificada em `tests/unit/design-tokens.test.ts`).
 */
export const THEME_COLORS = {
  dark: "#101014",
  light: "#f8f6f3",
} as const satisfies Record<ResolvedTheme, string>;

export const THEME_LABELS = {
  dark: "Escuro",
  light: "Claro",
  system: "Automático",
} as const satisfies Record<ThemePreference, string>;
