import { useId } from "react";

import { formatPercent } from "@/lib/format";
import { calculateProgress, type ProgressStatus } from "@/lib/progress";
import { cn } from "@/lib/utils";

import { Money } from "./money";

/*
 * Barra de progresso de um valor em relação a uma meta ou limite.
 *
 * Acessibilidade e ocultação de valores:
 * - `role="progressbar"` com `aria-valuenow` (0–100) e um `aria-valuetext`
 *   que contém APENAS o percentual e o status, nunca valores monetários.
 * - Os valores aparecem em componentes `Money`, que respeitam a ocultação.
 * - O percentual não é um valor monetário e continua visível com a ocultação
 *   ativa (decisão registrada no ADR-008).
 *
 * `kind`:
 * - "goal": passar de 100% é bom (meta superada).
 * - "limit": passar de 100% é ruim (orçamento ou limite ultrapassado).
 */

export type ProgressBarProps = {
  label: string;
  currentCents: number;
  targetCents: number;
  kind?: "goal" | "limit";
  showValues?: boolean;
  className?: string;
};

function describe(status: ProgressStatus, kind: "goal" | "limit"): string | null {
  switch (status) {
    case "no-target":
      return "Sem meta definida";
    case "complete":
      return kind === "goal" ? "Meta atingida" : "Limite atingido";
    case "exceeded":
      return kind === "goal" ? "Meta superada" : "Limite ultrapassado";
    default:
      return null;
  }
}

export function ProgressBar({
  label,
  currentCents,
  targetCents,
  kind = "goal",
  showValues = true,
  className,
}: ProgressBarProps) {
  const id = useId();
  const progress = calculateProgress(currentCents, targetCents);
  const statusText = describe(progress.status, kind);
  const percentText = progress.percent === null ? null : formatPercent(progress.percent);
  const valueText = [percentText, statusText].filter(Boolean).join(" · ");

  const overLimit = kind === "limit" && progress.status === "exceeded";
  const reached = progress.status === "complete" || progress.status === "exceeded";

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span id={`${id}-label`} className="min-w-0 text-sm font-medium">
          {label}
        </span>
        <span
          className={cn(
            "text-sm tabular-nums",
            overLimit ? "font-semibold text-danger" : "text-muted-foreground",
            kind === "goal" && reached && "font-semibold text-success",
          )}
        >
          {valueText}
        </span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={`${id}-label`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.barPercent}
        aria-valuetext={valueText}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            overLimit ? "bg-danger" : kind === "goal" && reached ? "bg-success" : "bg-gold",
          )}
          style={{ width: `${progress.barPercent}%` }}
        />
      </div>
      {showValues ? (
        <p className="text-sm text-muted-foreground">
          <Money cents={currentCents} className="text-foreground" /> de{" "}
          <Money cents={targetCents} />
        </p>
      ) : null}
    </div>
  );
}
