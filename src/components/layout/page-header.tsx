import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  /** Texto curto acima do título (ex.: o nome da área). */
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
};

/** Título da página interna. Cada página tem exatamente um <h1>. */
export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-2">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <div className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
            {description}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
