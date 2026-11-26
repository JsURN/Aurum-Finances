import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { formatCurrencyFromCents } from "@/lib/format";

/*
 * Landing page (rota `/`), fora do App Shell.
 * Apresenta a identidade visual e leva às páginas internas (`/dashboard`).
 * Todos os valores abaixo são fictícios e estão em centavos inteiros (ADR-002).
 */

const APP_ENTRY_HREF = "/dashboard";

const previewSummary = [
  { label: "Receitas do mês", cents: 985_000, tone: "text-success", sign: "+" },
  { label: "Despesas do mês", cents: 621_430, tone: "text-danger", sign: "−" },
  { label: "Fatura do cartão", cents: 193_240, tone: "text-gold", sign: "" },
] as const;

const plannedModules = [
  { title: "Contas e transações", description: "Receitas, despesas e saldos por conta." },
  { title: "Cartões de crédito", description: "Faturas, limites e compras parceladas." },
  { title: "Planejamento mensal", description: "Orçamento por categoria e recorrências." },
  { title: "Metas e wishlist", description: "Objetivos com prazo e progresso visível." },
  { title: "A receber", description: "Valores emprestados e cobranças de terceiros." },
  { title: "Investimentos", description: "Reservas e carteira em uma visão única." },
] as const;

export default function HomePage() {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          {/* Escondido abaixo de 640px para caber ao lado do botão a partir de 360px. */}
          <p className="hidden rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
            Em construção
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={APP_ENTRY_HREF}>Acessar Aurum</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-16 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:pt-16">
        <section aria-labelledby="hero-title" className="flex flex-col gap-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
            Finanças pessoais
          </p>
          <h1
            id="hero-title"
            className="font-display text-4xl leading-[1.05] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Seu dinheiro, com <em className="text-accent not-italic">clareza</em> e intenção.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {siteConfig.description}
          </p>
          <div>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={APP_ENTRY_HREF}>
                Acessar plataforma
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        <aside
          aria-labelledby="preview-title"
          className="rounded-xl border border-border bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="preview-title" className="text-sm font-medium text-muted-foreground">
              Saldo consolidado
            </h2>
            <span className="text-xs text-muted-foreground">Valores ilustrativos</span>
          </div>
          <p className="mt-3 font-display text-4xl font-medium tracking-tight tabular-nums sm:text-5xl">
            {formatCurrencyFromCents(2_438_055)}
          </p>

          <dl className="mt-8 divide-y divide-border border-t border-border">
            {previewSummary.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                <dd className={`text-sm font-semibold tabular-nums ${item.tone}`}>
                  {item.sign}
                  {formatCurrencyFromCents(item.cents)}
                </dd>
              </div>
            ))}
          </dl>
        </aside>

        <section aria-labelledby="modules-title" className="lg:col-span-2">
          <h2
            id="modules-title"
            className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
          >
            O que está a caminho
          </h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {plannedModules.map((module) => (
              <li key={module.title} className="bg-background p-6">
                <h3 className="font-medium text-foreground">{module.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {module.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border">
        <p className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          {siteConfig.name} · Projeto em desenvolvimento. Nenhum dado real é exibido nesta página.
        </p>
      </footer>
    </div>
  );
}
