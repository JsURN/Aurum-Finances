import type { ReactNode } from "react";

type DemoSectionProps = {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

/** Seção da página de demonstração, com âncora para o sumário. */
export function DemoSection({ id, title, description, children }: DemoSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex scroll-mt-24 flex-col gap-6 border-t border-border pt-10"
    >
      <div className="flex flex-col gap-2">
        <h2 id={`${id}-title`} className="font-display text-2xl font-medium tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Rótulo pequeno para agrupar exemplos dentro de uma seção. */
export function DemoLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
      {children}
    </h3>
  );
}
