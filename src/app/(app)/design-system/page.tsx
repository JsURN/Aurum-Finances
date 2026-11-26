import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";

import { ControlsDemo } from "./_components/controls-demo";
import { DataDemo } from "./_components/data-demo";
import { FinanceDemo } from "./_components/finance-demo";
import { FoundationsDemo } from "./_components/foundations-demo";
import { OverlaysDemo } from "./_components/overlays-demo";
import { ThemesDemo } from "./_components/themes-demo";

/*
 * Página interna de desenvolvimento: vitrine do Design System.
 * Existe só com `next dev`. Em produção (`next build`), responde 404 e não
 * aparece em nenhuma navegação. Todos os dados são fictícios.
 */

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const sections = [
  { id: "tipografia", label: "Tipografia" },
  { id: "cores", label: "Cores" },
  { id: "botoes", label: "Botões" },
  { id: "formularios", label: "Formulários" },
  { id: "tabelas", label: "Tabelas" },
  { id: "modais", label: "Modais" },
  { id: "financeiros", label: "Financeiros" },
  { id: "estados", label: "Estados" },
  { id: "temas", label: "Temas" },
] as const;

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <>
      <PageHeader
        eyebrow="Desenvolvimento"
        title="Design System"
        description="Componentes, tokens e estados do Aurum Finances. Recurso interno, disponível apenas em desenvolvimento."
      />

      <nav aria-label="Seções do Design System">
        <ul className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="inline-flex h-8 items-center rounded-full border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-highlight hover:text-foreground"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <FoundationsDemo />
      <ControlsDemo />
      <DataDemo />
      <OverlaysDemo />
      <FinanceDemo />
      <ThemesDemo />
    </>
  );
}
