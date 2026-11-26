import { TriangleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ErrorStateProps = {
  title?: string;
  description?: ReactNode;
  /** Ação de recuperação (ex.: botão "Tentar novamente"). */
  action?: ReactNode;
  /** Use `true` quando o erro aparecer depois do carregamento, para ser anunciado. */
  live?: boolean;
  headingLevel?: 2 | 3;
  className?: string;
};

/**
 * Estado de erro. Nunca mostre a mensagem técnica do erro para a pessoa
 * usuária: ela pode conter detalhes internos ou dados sensíveis.
 */
export function ErrorState({
  title = "Não foi possível carregar esta seção",
  description = "Tente novamente em instantes. Se o problema continuar, recarregue a página.",
  action,
  live = false,
  headingLevel = 2,
  className,
}: ErrorStateProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div
      role={live ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl border border-danger/40 px-6 py-12 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-12 items-center justify-center rounded-full border border-danger/40 text-danger"
      >
        <TriangleAlertIcon className="size-5" />
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <Heading className="font-display text-xl font-medium tracking-tight text-balance">
          {title}
        </Heading>
        <div className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {description}
        </div>
      </div>
      {action ? <div className="flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
