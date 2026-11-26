import { ArrowDownRightIcon, ArrowLeftRightIcon, ArrowUpRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Money } from "./money";

/*
 * Indicador de receita, despesa ou transferência. A cor nunca é o único sinal:
 * cada tipo tem ícone, rótulo e sinal (+ / −) próprios.
 * `cents` é sempre o valor absoluto do lançamento; o sinal vem do tipo.
 * Transferências entre contas próprias não são receita nem despesa, então
 * aparecem sem sinal e em tom neutro.
 */

const flows = {
  income: { label: "Receita", icon: ArrowUpRightIcon, tone: "income", sign: 1 },
  expense: { label: "Despesa", icon: ArrowDownRightIcon, tone: "expense", sign: -1 },
  transfer: { label: "Transferência", icon: ArrowLeftRightIcon, tone: "muted", sign: 0 },
} as const;

export type FlowType = keyof typeof flows;

export type FlowIndicatorProps = {
  type: FlowType;
  /** Valor absoluto em centavos (inteiro, >= 0). */
  cents: number;
  /** Rótulo visível; por padrão, o nome do tipo ("Receita", "Despesa"…). */
  label?: string;
  /** Esconde o rótulo visualmente (ex.: em tabelas), mantendo-o para leitores de tela. */
  hideLabel?: boolean;
  className?: string;
};

export function FlowIndicator({
  type,
  cents,
  label,
  hideLabel = false,
  className,
}: FlowIndicatorProps) {
  const flow = flows[type];
  const Icon = flow.icon;
  const signed = flow.sign === 0 ? Math.abs(cents) : flow.sign * Math.abs(cents);

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 text-sm", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full border",
          type === "income" && "border-success/35 text-success",
          type === "expense" && "border-danger/35 text-danger",
          type === "transfer" && "border-border text-muted-foreground",
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <span className={cn("min-w-0 text-muted-foreground", hideLabel && "sr-only")}>
        {label ?? flow.label}
      </span>
      <Money
        cents={signed}
        signDisplay={flow.sign === 0 ? "never" : "always"}
        tone={flow.tone}
        className="font-semibold"
      />
    </span>
  );
}
