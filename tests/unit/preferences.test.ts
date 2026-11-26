import { describe, expect, it } from "vitest";

import { DEFAULT_PREFERENCES } from "@/config/preferences";
import { parsePreference, resolveTheme } from "@/lib/preferences";

describe("parsePreference", () => {
  it("aceita os valores válidos", () => {
    expect(parsePreference("theme", "light")).toBe("light");
    expect(parsePreference("theme", "dark")).toBe("dark");
    expect(parsePreference("theme", "system")).toBe("system");
    expect(parsePreference("sidebar", "collapsed")).toBe("collapsed");
    expect(parsePreference("values", "hidden")).toBe("hidden");
  });

  it("usa o padrão para valores ausentes, inválidos ou corrompidos", () => {
    const corrupted = [null, undefined, "", "Dark", " dark", "true", '{"theme":"dark"}', 1, {}];
    for (const raw of corrupted) {
      expect(parsePreference("theme", raw)).toBe(DEFAULT_PREFERENCES.theme);
      expect(parsePreference("sidebar", raw)).toBe(DEFAULT_PREFERENCES.sidebar);
      expect(parsePreference("values", raw)).toBe(DEFAULT_PREFERENCES.values);
    }
  });

  it("tem o tema escuro como padrão", () => {
    expect(DEFAULT_PREFERENCES).toEqual({ theme: "dark", sidebar: "expanded", values: "visible" });
  });
});

describe("resolveTheme", () => {
  it("mantém escolhas explícitas", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("segue o sistema operacional no modo automático", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});
