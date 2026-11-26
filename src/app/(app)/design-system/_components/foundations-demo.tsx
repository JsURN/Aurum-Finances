import { Money } from "@/components/finance/money";

import { DemoLabel, DemoSection } from "./demo-section";

const colorTokens = [
  { name: "background", swatch: "bg-background", usage: "Fundo da página" },
  { name: "surface", swatch: "bg-surface", usage: "Cards e painéis" },
  { name: "surface-elevated", swatch: "bg-surface-elevated", usage: "Popovers e menus" },
  { name: "muted", swatch: "bg-muted", usage: "Fundos secundários" },
  { name: "highlight", swatch: "bg-highlight", usage: "Hover e seleção" },
  { name: "border", swatch: "bg-border", usage: "Divisores" },
  { name: "input", swatch: "bg-input", usage: "Contorno de campos" },
  { name: "primary", swatch: "bg-primary", usage: "Ação principal" },
  { name: "accent", swatch: "bg-accent", usage: "Ênfase e foco" },
  { name: "gold", swatch: "bg-gold", usage: "Marca e destaques" },
  { name: "success", swatch: "bg-success", usage: "Receitas" },
  { name: "danger", swatch: "bg-danger", usage: "Despesas e erros" },
] as const;

export function FoundationsDemo() {
  return (
    <>
      <DemoSection
        id="tipografia"
        title="Tipografia"
        description="Fraunces para títulos editoriais e valores em destaque; Manrope para a interface. Números financeiros usam algarismos tabulares."
      >
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
          <p className="font-display text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
            Display · Fraunces
          </p>
          <p className="font-display text-2xl font-medium tracking-tight">
            Título de seção · Fraunces
          </p>
          <p className="text-base leading-relaxed">
            Texto de interface em Manrope. Clareza e calma visual vêm da hierarquia tipográfica, não
            do excesso de cor.
          </p>
          <p className="text-sm text-muted-foreground">Texto secundário · muted-foreground</p>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Sobretítulo</p>
          <div className="flex flex-col gap-1 text-sm">
            <DemoLabel>Algarismos tabulares</DemoLabel>
            <p>
              <Money cents={111_111} />
            </p>
            <p>
              <Money cents={888_888} />
            </p>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        id="cores"
        title="Cores"
        description="Apenas tokens semânticos. Cada token troca de valor entre os temas; o contraste de cada par é verificado por teste automatizado."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((token) => (
            <li
              key={token.name}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <span
                aria-hidden="true"
                className={`size-10 shrink-0 rounded-md border border-border ${token.swatch}`}
              />
              <span className="flex min-w-0 flex-col">
                <code className="truncate text-sm font-medium">{token.name}</code>
                <span className="truncate text-xs text-muted-foreground">{token.usage}</span>
              </span>
            </li>
          ))}
        </ul>
      </DemoSection>
    </>
  );
}
