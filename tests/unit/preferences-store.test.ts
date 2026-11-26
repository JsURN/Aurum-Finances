import { beforeEach, describe, expect, it, vi } from "vitest";

import { PREFERENCE_KEYS } from "@/config/preferences";

import { installFakeDom } from "./helpers/fake-dom";

// O store guarda estado de módulo (fallback em memória), então cada teste
// importa uma instância nova.
async function loadStore() {
  vi.resetModules();
  return import("@/lib/preferences-store");
}

describe("preferences-store", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("persiste no localStorage e notifica os inscritos", async () => {
    const dom = installFakeDom();
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribePreferences(listener);

    store.setPreference("theme", "light");

    expect(dom.storage.data.get(PREFERENCE_KEYS.theme)).toBe("light");
    expect(store.browserStorage.getItem(PREFERENCE_KEYS.theme)).toBe("light");
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("mantém a escolha em memória quando o localStorage lança ao gravar", async () => {
    const dom = installFakeDom({ storageMode: "throws-on-write" });
    const store = await loadStore();

    expect(() => store.setPreference("values", "hidden")).not.toThrow();
    expect(store.browserStorage.getItem(PREFERENCE_KEYS.values)).toBe("hidden");
    expect(dom.storage.data.has(PREFERENCE_KEYS.values)).toBe(false);
  });

  it("funciona só em memória quando o localStorage está bloqueado", async () => {
    installFakeDom({ storageMode: "throws-on-access" });
    const store = await loadStore();

    expect(store.browserStorage.getItem(PREFERENCE_KEYS.theme)).toBeNull();
    store.setPreference("theme", "system");
    expect(store.browserStorage.getItem(PREFERENCE_KEYS.theme)).toBe("system");
  });

  it("sincroniza mudanças feitas em outra aba", async () => {
    const dom = installFakeDom();
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribePreferences(listener);

    dom.otherTabWrites(PREFERENCE_KEYS.sidebar, "collapsed");

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.browserStorage.getItem(PREFERENCE_KEYS.sidebar)).toBe("collapsed");
    unsubscribe();
  });

  it("descarta o valor em memória quando outra aba grava a mesma chave", async () => {
    const dom = installFakeDom({ storageMode: "throws-on-write" });
    const store = await loadStore();
    const unsubscribe = store.subscribePreferences(() => {});

    store.setPreference("theme", "light");
    dom.otherTabWrites(PREFERENCE_KEYS.theme, "dark");

    expect(store.browserStorage.getItem(PREFERENCE_KEYS.theme)).toBe("dark");
    unsubscribe();
  });

  it("reage a localStorage.clear() em outra aba", async () => {
    const dom = installFakeDom({ storage: { [PREFERENCE_KEYS.values]: "hidden" } });
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribePreferences(listener);

    dom.otherTabWrites(null);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.browserStorage.getItem(PREFERENCE_KEYS.values)).toBeNull();
    unsubscribe();
  });

  it("ignora eventos de storage de chaves que não são preferências", async () => {
    const dom = installFakeDom();
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribePreferences(listener);

    dom.otherTabWrites("outra-chave", "x");

    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("notifica mudanças do tema do sistema operacional", async () => {
    const dom = installFakeDom();
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribePreferences(listener);

    dom.setSystemDark(true);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSystemPrefersDark()).toBe(true);
    unsubscribe();
  });

  it("remove todos os listeners ao cancelar a inscrição", async () => {
    const dom = installFakeDom();
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribePreferences(listener);
    expect(dom.mediaListenerCount()).toBe(1);

    unsubscribe();

    expect(dom.mediaListenerCount()).toBe(0);
    store.setPreference("theme", "light");
    dom.otherTabWrites(PREFERENCE_KEYS.theme, "dark");
    dom.setSystemDark(true);
    expect(listener).not.toHaveBeenCalled();
  });
});
