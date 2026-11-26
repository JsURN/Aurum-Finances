import { describe, expect, it } from "vitest";

import { calculateProgress } from "@/lib/progress";

describe("calculateProgress", () => {
  it("calcula o percentual arredondando para baixo", () => {
    expect(calculateProgress(320_000, 500_000)).toEqual({
      status: "in-progress",
      percent: 64,
      barPercent: 64,
    });
    // 99,99% não deve aparecer como 100% antes de a meta ser atingida.
    expect(calculateProgress(9_999, 10_000).percent).toBe(99);
    expect(calculateProgress(1, 300).percent).toBe(0);
  });

  it("marca zero como vazio", () => {
    expect(calculateProgress(0, 10_000)).toEqual({ status: "empty", percent: 0, barPercent: 0 });
  });

  it("marca a meta atingida como completa", () => {
    expect(calculateProgress(10_000, 10_000)).toEqual({
      status: "complete",
      percent: 100,
      barPercent: 100,
    });
  });

  it("aceita progresso acima de 100% sem estourar a barra", () => {
    expect(calculateProgress(15_000, 10_000)).toEqual({
      status: "exceeded",
      percent: 150,
      barPercent: 100,
    });
  });

  it("trata a meta zero (divisão por zero) sem lançar erro", () => {
    expect(calculateProgress(0, 0)).toEqual({ status: "no-target", percent: null, barPercent: 0 });
    expect(calculateProgress(5_000, 0)).toEqual({
      status: "no-target",
      percent: null,
      barPercent: 0,
    });
  });

  it("trata valor atual negativo como vazio, com percentual pelo piso", () => {
    expect(calculateProgress(-2_500, 10_000)).toEqual({
      status: "empty",
      percent: -25,
      barPercent: 0,
    });
    expect(calculateProgress(-1, 10_000).percent).toBe(-1);
  });

  it("rejeita meta negativa", () => {
    expect(() => calculateProgress(100, -1)).toThrow(RangeError);
  });

  it("é exato com valores no limite do intervalo seguro", () => {
    const max = Number.MAX_SAFE_INTEGER;
    expect(calculateProgress(max - 1, max).percent).toBe(99);
    expect(calculateProgress(max, max).status).toBe("complete");
    // Meta de 1 centavo com valor enorme: o percentual é limitado ao intervalo seguro.
    expect(calculateProgress(max, 1).percent).toBe(max);
    expect(calculateProgress(-max, 1).percent).toBe(-max);
  });

  it("rejeita valores inválidos", () => {
    const invalid = [Number.NaN, Number.POSITIVE_INFINITY, 10.5, Number.MAX_SAFE_INTEGER + 1];
    for (const value of invalid) {
      expect(() => calculateProgress(value, 100)).toThrow(TypeError);
      expect(() => calculateProgress(100, value)).toThrow(TypeError);
    }
  });
});
