import { Fragment } from "react";

import { formatCurrencyPartsFromCents, type SignDisplay } from "@/lib/format";
import { cn } from "@/lib/utils";

/*
 * Exibição de valores monetários em centavos inteiros (ADR-002).
 *
 * Ocultação de valores (ADR-008): o componente renderiza o valor e a máscara;
 * o CSS do `globals.css` mostra um ou outro conforme `data-values` no <html>.
 * - O valor real nunca vai para `title`, `aria-label`, tooltip ou outro atributo.
 * - Com a ocultação ativa, o valor fica com `display: none` (fora da árvore de
 *   acessibilidade) e leitores de tela anunciam apenas "Valor oculto".
 * - A máscara tem largura fixa, então também não revela a ordem de grandeza.
 * - É um recurso de privacidade visual, NÃO de segurança: o valor continua no HTML.
 *
 * Valores longos podem quebrar linha apenas depois dos separadores de milhar
 * (`<wbr>`), nunca no meio de um grupo, então nada é cortado nem estoura o layout.
 */

const tones = {
  default: "",
  income: "text-success",
  expense: "text-danger",
  gold: "text-gold",
  muted: "text-muted-foreground",
} as const;

export type MoneyTone = keyof typeof tones;

export type MoneyProps = {
  cents: number;
  signDisplay?: SignDisplay;
  tone?: MoneyTone;
  /** `false` só para valores ilustrativos que não pertencem ao usuário. */
  sensitive?: boolean;
  className?: string;
};

export const HIDDEN_VALUE_MASK = "R$ •••••";
export const HIDDEN_VALUE_LABEL = "Valor oculto";

export function Money({
  cents,
  signDisplay = "auto",
  tone = "default",
  sensitive = true,
  className,
}: MoneyProps) {
  const parts = formatCurrencyPartsFromCents(cents, { signDisplay });

  const value = parts.map((part, index) => (
    <Fragment key={index}>
      {part.value}
      {part.type === "group" ? <wbr /> : null}
    </Fragment>
  ));

  return (
    <span data-slot="money" className={cn("tabular-nums", tones[tone], className)}>
      {sensitive ? (
        <>
          <span data-sensitive="value">{value}</span>
          <span data-sensitive="mask" className="whitespace-nowrap">
            <span aria-hidden="true">{HIDDEN_VALUE_MASK}</span>
            <span className="sr-only">{HIDDEN_VALUE_LABEL}</span>
          </span>
        </>
      ) : (
        value
      )}
    </span>
  );
}
