import { describe, expect, it } from "vitest";

import { getNavItem, isActivePath, mainNavigation } from "@/config/navigation";

describe("isActivePath", () => {
  it("marca a própria rota e as sub-rotas", () => {
    expect(isActivePath("/accounts", "/accounts")).toBe(true);
    expect(isActivePath("/accounts/123", "/accounts")).toBe(true);
  });

  it("não confunde rotas com o mesmo prefixo", () => {
    expect(isActivePath("/accounts-archive", "/accounts")).toBe(false);
    expect(isActivePath("/", "/accounts")).toBe(false);
  });
});

describe("navegação principal", () => {
  it("tem os nove módulos, com rotas únicas", () => {
    expect(mainNavigation).toHaveLength(9);
    const hrefs = mainNavigation.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("encontra um item pela rota", () => {
    expect(getNavItem("/credit-cards").label).toBe("Cartões de crédito");
  });
});
