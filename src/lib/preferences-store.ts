import { PREFERENCE_KEYS, type Preferences } from "@/config/preferences";
import type { StorageLike } from "@/lib/preferences";

/*
 * Armazenamento das preferências no navegador.
 * - Usa `localStorage` quando disponível.
 * - Se ele estiver bloqueado ou lançar erro, mantém o valor em memória: a
 *   escolha funciona durante a sessão, só não sobrevive a um recarregamento.
 * - Notifica os inscritos quando algo muda nesta aba, em outra aba (evento
 *   `storage`) ou no tema do sistema operacional.
 * Só deve ser usado em código cliente.
 */

const memory = new Map<string, string>();
const listeners = new Set<() => void>();
const KNOWN_KEYS: readonly string[] = Object.values(PREFERENCE_KEYS);

export const browserStorage: StorageLike = {
  getItem(key) {
    if (memory.has(key)) return memory.get(key) ?? null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    memory.set(key, value);
    try {
      window.localStorage.setItem(key, value);
      // Persistido com sucesso: a fonte de verdade volta a ser o localStorage,
      // o que mantém a sincronização entre abas funcionando.
      memory.delete(key);
    } catch {
      // localStorage indisponível: fica só em memória.
    }
  },
};

function notify(): void {
  for (const listener of listeners) listener();
}

export function setPreference<K extends keyof Preferences>(name: K, value: Preferences[K]): void {
  browserStorage.setItem(PREFERENCE_KEYS[name], value);
  notify();
}

/**
 * Inscreve um callback para qualquer mudança de preferência. Cada inscrição
 * registra e remove os próprios listeners de `storage` e `matchMedia`.
 */
export function subscribePreferences(listener: () => void): () => void {
  function onStorage(event: StorageEvent): void {
    // `key === null` significa `localStorage.clear()` em outra aba.
    if (event.key !== null && !KNOWN_KEYS.includes(event.key)) return;
    if (event.key === null) memory.clear();
    else memory.delete(event.key);
    listener();
  }

  let media: MediaQueryList | null = null;
  try {
    media = window.matchMedia("(prefers-color-scheme: dark)");
  } catch {
    media = null;
  }

  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  media?.addEventListener("change", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    media?.removeEventListener("change", listener);
  };
}

export function getSystemPrefersDark(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}
