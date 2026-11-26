import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  /** Ação principal (ex.: um Button). */
  action?: ReactNode;
  /** Conteúdo extra abaixo da descrição (ex.: um Badge de fase). */
  meta?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
};

/** Estado vazio: explica o que falta e, quando houver, oferece o próximo passo. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  meta,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-12 text-center sm:py-16",
        className,
      )}
    >
      {Icon ? (
        <span
          aria-hidden="true"
          className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-surface text-gold"
        >
          <Icon className="size-5" />
        </span>
      ) : null}
      <div className="flex max-w-md flex-col gap-2">
        <Heading className="font-display text-xl font-medium tracking-tight text-balance">
          {title}
        </Heading>
        {description ? (
          <div className="text-sm leading-relaxed text-pretty text-muted-foreground">
            {description}
          </div>
        ) : null}
      </div>
      {meta}
      {action ? <div className="flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
