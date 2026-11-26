import type { LucideIcon } from "lucide-react";
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Money, type MoneyTone } from "./money";

/*
 * Card de resumo financeiro: rótulo, valor em destaque e um rodapé opcional
 * (ex.: um FlowIndicator ou texto de contexto).
 * - O nome acessível da seção vem só do rótulo, nunca do valor.
 * - O tamanho do valor acompanha a largura do card (container query), e valores
 *   longos quebram apenas entre grupos de milhar, sem cortar nem estourar.
 */

export type SummaryCardProps = {
  label: string;
  cents: number;
  tone?: MoneyTone;
  icon?: LucideIcon;
  /** Conteúdo abaixo do valor. */
  children?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
};

export function SummaryCard({
  label,
  cents,
  tone = "default",
  icon: Icon,
  children,
  headingLevel = 3,
  className,
}: SummaryCardProps) {
  const id = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <section
      aria-labelledby={id}
      className={cn(
        "@container flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-surface p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Heading id={id} className="text-sm font-medium text-muted-foreground">
          {label}
        </Heading>
        {Icon ? (
          <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        ) : null}
      </div>
      <p className="font-display text-[clamp(1.375rem,11cqi,1.875rem)] leading-tight font-medium tracking-tight">
        <Money cents={cents} tone={tone} />
      </p>
      {children ? <div className="min-w-0 text-sm text-muted-foreground">{children}</div> : null}
    </section>
  );
}
