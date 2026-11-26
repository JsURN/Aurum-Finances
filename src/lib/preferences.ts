import {
  DEFAULT_PREFERENCES,
  SIDEBAR_STATES,
  THEME_PREFERENCES,
  VALUES_VISIBILITY,
  type Preferences,
  type ResolvedTheme,
  type ThemePreference,
} from "@/config/preferences";

/*
 * Validação das preferências de interface. Funções puras, testadas em Node.
 */

/** Subconjunto de `Storage` usado pelas preferências (facilita testes). */
export type StorageLike = Pick<Storage, "getItem" | "setItem">;

function isOneOf<T extends string>(options: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (options as readonly string[]).includes(value);
}

// O `satisfies` garante que cada lista contém só valores válidos da preferência.
const OPTIONS: { readonly [K in keyof Preferences]: readonly Preferences[K][] } = {
  theme: THEME_PREFERENCES,
  sidebar: SIDEBAR_STATES,
  values: VALUES_VISIBILITY,
} satisfies { [K in keyof Preferences]: readonly Preferences[K][] };

/** Valor ausente, inválido ou corrompido cai no padrão da preferência. */
export function parsePreference<K extends keyof Preferences>(
  name: K,
  raw: unknown,
): Preferences[K] {
  const options: readonly Preferences[K][] = OPTIONS[name];
  const fallback: Preferences[K] = DEFAULT_PREFERENCES[name];
  return isOneOf(options, raw) ? raw : fallback;
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === "system") return systemPrefersDark ? "dark" : "light";
  return preference;
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return isOneOf(THEME_PREFERENCES, value);
}
