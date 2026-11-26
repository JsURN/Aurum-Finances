"use client";

import { useSyncExternalStore } from "react";

import { PREFERENCE_KEYS, type Preferences, type ResolvedTheme } from "@/config/preferences";
import { parsePreference, resolveTheme } from "@/lib/preferences";
import {
  browserStorage,
  getSystemPrefersDark,
  setPreference,
  subscribePreferences,
} from "@/lib/preferences-store";

/*
 * Hooks de leitura das preferências. No servidor e durante a hidratação o
 * valor é `null` (desconhecido), o que evita divergência de hidratação; logo
 * depois o React lê o valor real do navegador.
 * O visual que depende da preferência (ícone de sol/lua, valores ocultos) é
 * feito por CSS a partir dos atributos do <html>, então não pisca.
 */

const getServerSnapshot = () => null;

export function usePreference<K extends keyof Preferences>(name: K): Preferences[K] | null {
  return useSyncExternalStore(
    subscribePreferences,
    () => parsePreference(name, browserStorage.getItem(PREFERENCE_KEYS[name])),
    getServerSnapshot,
  );
}

export function useResolvedTheme(): ResolvedTheme | null {
  const preference = usePreference("theme");
  const systemPrefersDark = useSyncExternalStore(
    subscribePreferences,
    getSystemPrefersDark,
    getServerSnapshot,
  );
  if (preference === null || systemPrefersDark === null) return null;
  return resolveTheme(preference, systemPrefersDark);
}

/** Troca o tema sem animar a transição de cores de cada elemento. */
export function setThemePreference(value: Preferences["theme"]): void {
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);

  setPreference("theme", value);

  // Força o recálculo de estilos com as transições desligadas e reativa depois.
  void window.getComputedStyle(document.body).opacity;
  window.requestAnimationFrame(() => style.remove());
}

export { setPreference };
