import { siteConfig } from "@/config/site";

/*
 * Formatação de valores monetários em centavos inteiros (ADR-002).
 *
 * A conversão para reais é feita com inteiros (BigInt) e o valor decimal é
 * passado ao Intl como string exata, então nenhum centavo se perde por ponto
 * flutuante, mesmo perto de Number.MAX_SAFE_INTEGER.
 *
 * Comportamento por caso (coberto em tests/unit/format.test.ts):
 * - 0                  → "R$ 0,00" (sem sinal, mesmo com signDisplay "always")
 * - positivo           → "R$ 1.234,56"; com signDisplay "always" → "+R$ 1.234,56"
 * - negativo           → "−R$ 1.234,56" (sinal de menos tipográfico U+2212)
 * - |valor| ≤ 2^53 − 1 → formatado com exatidão
 * - não inteiro, NaN, ±Infinity, fora do intervalo seguro ou não-number
 *                      → lança TypeError (erro de programação, nunca exibido)
 */

export const MINUS_SIGN = "−";
export const PLUS_SIGN = "+";

export type SignDisplay = "auto" | "always" | "never";

export type CurrencyFormatOptions = {
  /** "auto": sinal só em negativos; "always": também "+" em positivos; "never": valor absoluto. */
  signDisplay?: SignDisplay;
};

export type CurrencyPart = { type: "sign" | Intl.NumberFormatPartTypes; value: string };

const currencyFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
});

const percentFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "percent",
  maximumFractionDigits: 0,
});

/** Garante que o valor é um inteiro seguro em centavos. */
export function assertCents(value: unknown): asserts value is number {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new TypeError("O valor monetário deve ser um inteiro em centavos.");
  }
}

const ZERO = BigInt(0);
const HUNDRED = BigInt(100);

/** Converte centavos inteiros para a string decimal exata ("1234.56"), sem sinal. */
function centsToDecimalString(absoluteCents: bigint): `${number}` {
  const reais = absoluteCents / HUNDRED;
  const cents = (absoluteCents % HUNDRED).toString().padStart(2, "0");
  return `${reais}.${cents}` as `${number}`;
}

/**
 * Formata em partes (para componentes que precisam, por exemplo, permitir
 * quebra de linha só entre os grupos de milhar).
 */
export function formatCurrencyPartsFromCents(
  cents: number,
  { signDisplay = "auto" }: CurrencyFormatOptions = {},
): CurrencyPart[] {
  assertCents(cents);

  const big = BigInt(cents);
  const absolute = big < ZERO ? -big : big;
  const parts: CurrencyPart[] = currencyFormatter.formatToParts(centsToDecimalString(absolute));

  let sign = "";
  if (signDisplay !== "never" && big < ZERO) sign = MINUS_SIGN;
  if (signDisplay === "always" && big > ZERO) sign = PLUS_SIGN;

  return sign ? [{ type: "sign", value: sign }, ...parts] : parts;
}

/** Formata um valor monetário armazenado em centavos inteiros (ADR-002). */
export function formatCurrencyFromCents(cents: number, options?: CurrencyFormatOptions): string {
  return formatCurrencyPartsFromCents(cents, options)
    .map((part) => part.value)
    .join("");
}

/** Formata um percentual inteiro (64 → "64%"). */
export function formatPercent(percent: number): string {
  if (!Number.isSafeInteger(percent)) {
    throw new TypeError("O percentual deve ser um número inteiro.");
  }
  return percentFormatter.format(percent / 100);
}
