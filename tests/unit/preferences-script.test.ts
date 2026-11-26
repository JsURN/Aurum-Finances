import { describe, expect, it } from "vitest";

import { PREFERENCE_KEYS, THEME_COLORS } from "@/config/preferences";
import {
  applyPreferences,
  getPreferencesScript,
  preferencesScriptConfig,
} from "@/lib/preferences-script";

import { installFakeDom } from "./helpers/fake-dom";

const run = () => applyPreferences(preferencesScriptConfig);

describe("applyPreferences (script inline do <head>)", () => {
  it("aplica os padrões quando não há nada salvo", () => {
    const dom = installFakeDom({ prefersDark: false });
    run();
    expect(dom.isDark()).toBe(true);
    expect(dom.root.getAttribute("data-sidebar")).toBe("expanded");
    expect(dom.root.getAttribute("data-values")).toBe("visible");
    expect(dom.meta.content).toBe(THEME_COLORS.dark);
  });

  it("aplica as preferências salvas", () => {
    const dom = installFakeDom({
      storage: {
        [PREFERENCE_KEYS.theme]: "light",
        [PREFERENCE_KEYS.sidebar]: "collapsed",
        [PREFERENCE_KEYS.values]: "hidden",
      },
    });
    run();
    expect(dom.isDark()).toBe(false);
    expect(dom.root.getAttribute("data-sidebar")).toBe("collapsed");
    expect(dom.root.getAttribute("data-values")).toBe("hidden");
    expect(dom.meta.content).toBe(THEME_COLORS.light);
  });

  it("resolve o modo automático pelo sistema operacional", () => {
    const light = installFakeDom({ storage: { [PREFERENCE_KEYS.theme]: "system" } });
    run();
    expect(light.isDark()).toBe(false);

    const dark = installFakeDom({
      storage: { [PREFERENCE_KEYS.theme]: "system" },
      prefersDark: true,
    });
    run();
    expect(dark.isDark()).toBe(true);
  });

  it("ignora valores corrompidos e usa os padrões", () => {
    const dom = installFakeDom({
      storage: {
        [PREFERENCE_KEYS.theme]: "<script>",
        [PREFERENCE_KEYS.sidebar]: "{}",
        [PREFERENCE_KEYS.values]: "HIDDEN",
      },
    });
    run();
    expect(dom.isDark()).toBe(true);
    expect(dom.root.getAttribute("data-sidebar")).toBe("expanded");
    expect(dom.root.getAttribute("data-values")).toBe("visible");
  });

  it.each(["throws-on-access", "missing"] as const)(
    "não quebra com localStorage indisponível (%s)",
    (storageMode) => {
      const dom = installFakeDom({ storageMode });
      expect(run).not.toThrow();
      expect(dom.isDark()).toBe(true);
      expect(dom.root.getAttribute("data-values")).toBe("visible");
    },
  );

  it("não quebra sem matchMedia", () => {
    const dom = installFakeDom({
      storage: { [PREFERENCE_KEYS.theme]: "system" },
      matchMediaThrows: true,
    });
    expect(run).not.toThrow();
    expect(dom.isDark()).toBe(false);
  });

  it("gera um script autocontido que funciona fora do módulo", () => {
    const dom = installFakeDom({ storage: { [PREFERENCE_KEYS.values]: "hidden" } });
    // Executa a string exatamente como o navegador executaria o <script>.
    new Function(getPreferencesScript())();
    expect(dom.root.getAttribute("data-values")).toBe("hidden");
    expect(dom.isDark()).toBe(true);
  });
});
