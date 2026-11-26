import { siteConfig } from "@/config/site";

const currencyFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
});

/**
 * Formata um valor monetário armazenado em centavos inteiros (ADR-002).
 * Valores monetários nunca devem circular como `number` fracionário.
 */
export function formatCurrencyFromCents(cents: number): string {
  if (!Number.isSafeInteger(cents)) {
    throw new TypeError("O valor monetário deve ser um inteiro em centavos.");
  }
  return currencyFormatter.format(cents / 100);
}
