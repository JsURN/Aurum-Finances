import { describe, expect, it } from "vitest";

import {
  assertCents,
  formatCurrencyFromCents,
  formatCurrencyPartsFromCents,
  formatPercent,
} from "@/lib/format";

// O Intl pt-BR usa espaço não separável (U+00A0) entre "R$" e o número.
const NBSP = " ";
const MINUS = "−";
const brl = (text: string) => text.replace(" ", NBSP);

describe("formatCurrencyFromCents", () => {
  it("formata zero sem sinal", () => {
    expect(formatCurrencyFromCents(0)).toBe(brl("R$ 0,00"));
    expect(formatCurrencyFromCents(0, { signDisplay: "always" })).toBe(brl("R$ 0,00"));
  });

  it("trata -0 como zero", () => {
    expect(formatCurrencyFromCents(-0)).toBe(brl("R$ 0,00"));
  });

  it("formata valores positivos com separador de milhar", () => {
    expect(formatCurrencyFromCents(123_456)).toBe(brl("R$ 1.234,56"));
    expect(formatCurrencyFromCents(100_000_000)).toBe(brl("R$ 1.000.000,00"));
  });

  it("formata centavos com dois dígitos", () => {
    expect(formatCurrencyFromCents(1)).toBe(brl("R$ 0,01"));
    expect(formatCurrencyFromCents(9)).toBe(brl("R$ 0,09"));
    expect(formatCurrencyFromCents(10)).toBe(brl("R$ 0,10"));
    expect(formatCurrencyFromCents(99)).toBe(brl("R$ 0,99"));
    expect(formatCurrencyFromCents(105)).toBe(brl("R$ 1,05"));
  });

  it("formata negativos com o sinal de menos tipográfico (U+2212)", () => {
    expect(formatCurrencyFromCents(-123_456)).toBe(`${MINUS}${brl("R$ 1.234,56")}`);
    expect(formatCurrencyFromCents(-1)).toBe(`${MINUS}${brl("R$ 0,01")}`);
  });

  it("respeita signDisplay", () => {
    expect(formatCurrencyFromCents(500, { signDisplay: "always" })).toBe(`+${brl("R$ 5,00")}`);
    expect(formatCurrencyFromCents(-500, { signDisplay: "always" })).toBe(
      `${MINUS}${brl("R$ 5,00")}`,
    );
    expect(formatCurrencyFromCents(-500, { signDisplay: "never" })).toBe(brl("R$ 5,00"));
    expect(formatCurrencyFromCents(500, { signDisplay: "never" })).toBe(brl("R$ 5,00"));
  });

  it("é exato no limite do intervalo seguro de inteiros", () => {
    expect(formatCurrencyFromCents(Number.MAX_SAFE_INTEGER)).toBe(brl("R$ 90.071.992.547.409,91"));
    expect(formatCurrencyFromCents(Number.MAX_SAFE_INTEGER - 1)).toBe(
      brl("R$ 90.071.992.547.409,90"),
    );
    expect(formatCurrencyFromCents(-Number.MAX_SAFE_INTEGER)).toBe(
      `${MINUS}${brl("R$ 90.071.992.547.409,91")}`,
    );
  });

  it("rejeita valores fora do intervalo seguro", () => {
    expect(() => formatCurrencyFromCents(Number.MAX_SAFE_INTEGER + 1)).toThrow(TypeError);
    expect(() => formatCurrencyFromCents(-Number.MAX_SAFE_INTEGER - 1)).toThrow(TypeError);
    expect(() => formatCurrencyFromCents(Number.MAX_VALUE)).toThrow(TypeError);
  });

  it("rejeita valores não inteiros", () => {
    expect(() => formatCurrencyFromCents(10.5)).toThrow(TypeError);
    expect(() => formatCurrencyFromCents(0.1 + 0.2)).toThrow(TypeError);
    expect(() => formatCurrencyFromCents(-0.01)).toThrow(TypeError);
  });

  it("rejeita NaN e Infinity", () => {
    expect(() => formatCurrencyFromCents(Number.NaN)).toThrow(TypeError);
    expect(() => formatCurrencyFromCents(Number.POSITIVE_INFINITY)).toThrow(TypeError);
    expect(() => formatCurrencyFromCents(Number.NEGATIVE_INFINITY)).toThrow(TypeError);
  });

  it("rejeita tipos inválidos vindos de fora do TypeScript", () => {
    for (const invalid of ["100", null, undefined, {}, BigInt(100)]) {
      expect(() => formatCurrencyFromCents(invalid as unknown as number)).toThrow(TypeError);
    }
  });
});

describe("formatCurrencyPartsFromCents", () => {
  it("expõe o sinal e os separadores de milhar como partes", () => {
    const parts = formatCurrencyPartsFromCents(-123_456_789);
    expect(parts[0]).toEqual({ type: "sign", value: MINUS });
    expect(parts.filter((part) => part.type === "group").map((part) => part.value)).toEqual([
      ".",
      ".",
    ]);
    expect(parts.map((part) => part.value).join("")).toBe(formatCurrencyFromCents(-123_456_789));
  });
});

describe("assertCents", () => {
  it("aceita inteiros seguros e rejeita o resto", () => {
    expect(() => assertCents(0)).not.toThrow();
    expect(() => assertCents(Number.MAX_SAFE_INTEGER)).not.toThrow();
    expect(() => assertCents(1.5)).toThrow(TypeError);
    expect(() => assertCents("1")).toThrow(TypeError);
  });
});

describe("formatPercent", () => {
  it("formata percentuais inteiros", () => {
    expect(formatPercent(0)).toBe("0%");
    expect(formatPercent(64)).toBe("64%");
    expect(formatPercent(150)).toBe("150%");
  });

  it("rejeita percentuais não inteiros", () => {
    expect(() => formatPercent(12.5)).toThrow(TypeError);
    expect(() => formatPercent(Number.NaN)).toThrow(TypeError);
  });
});
