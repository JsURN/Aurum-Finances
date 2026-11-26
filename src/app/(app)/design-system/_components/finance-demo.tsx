import { CreditCardIcon, InboxIcon, RotateCwIcon, WalletIcon } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { FlowIndicator } from "@/components/finance/flow-indicator";
import { Money } from "@/components/finance/money";
import { ProgressBar } from "@/components/finance/progress-bar";
import { SummaryCard } from "@/components/finance/summary-card";
import { ValuesVisibilityToggle } from "@/components/finance/values-visibility-toggle";
import { Button } from "@/components/ui/button";

import { demoSummary } from "./demo-data";
import { DemoLabel, DemoSection } from "./demo-section";

export function FinanceDemo() {
  return (
    <>
      <DemoSection
        id="financeiros"
        title="Componentes financeiros"
        description="Valores em centavos inteiros, sempre com sinal e rótulo além da cor. Valores fictícios."
      >
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            A ocultação vale para todos os componentes desta página e do app. É privacidade visual,
            não segurança.
          </p>
          <ValuesVisibilityToggle variant="button" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Saldo consolidado" cents={demoSummary.balance} icon={WalletIcon}>
            Em 3 contas
          </SummaryCard>
          <SummaryCard label="Receitas do mês" cents={demoSummary.income} tone="income">
            <FlowIndicator type="income" cents={120_050} label="Última" />
          </SummaryCard>
          <SummaryCard label="Despesas do mês" cents={demoSummary.expenses} tone="expense">
            <FlowIndicator type="expense" cents={48_732} label="Última" />
          </SummaryCard>
          <SummaryCard
            label="Fatura do cartão"
            cents={demoSummary.invoice}
            tone="gold"
            icon={CreditCardIcon}
          >
            Fecha em 28/11
          </SummaryCard>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryCard label="Valor longo (teste de layout)" cents={demoSummary.longValue}>
            Quebra apenas entre grupos de milhar.
          </SummaryCard>
          <SummaryCard label="Maior valor suportado" cents={Number.MAX_SAFE_INTEGER} tone="gold">
            Number.MAX_SAFE_INTEGER centavos.
          </SummaryCard>
        </div>

        <div className="grid gap-6 rounded-xl border border-border bg-surface p-5 sm:p-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <DemoLabel>Valores</DemoLabel>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex justify-between gap-4">
                <span className="text-muted-foreground">Positivo</span>
                <Money cents={123_456} />
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted-foreground">Negativo</span>
                <Money cents={-123_456} tone="expense" />
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted-foreground">Zero</span>
                <Money cents={0} tone="muted" />
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted-foreground">Com sinal</span>
                <Money cents={50_000} signDisplay="always" tone="income" />
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <DemoLabel>Indicadores</DemoLabel>
            <div className="flex flex-col gap-3">
              <FlowIndicator type="income" cents={985_000} />
              <FlowIndicator type="expense" cents={210_000} />
              <FlowIndicator type="transfer" cents={50_000} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 rounded-xl border border-border bg-surface p-5 sm:p-6 lg:grid-cols-2">
          <ProgressBar label="Reserva de emergência" currentCents={320_000} targetCents={500_000} />
          <ProgressBar label="Viagem" currentCents={0} targetCents={800_000} />
          <ProgressBar label="Notebook novo" currentCents={650_000} targetCents={650_000} />
          <ProgressBar label="Curso de inglês" currentCents={180_000} targetCents={120_000} />
          <ProgressBar
            label="Orçamento: alimentação"
            currentCents={118_000}
            targetCents={100_000}
            kind="limit"
          />
          <ProgressBar label="Meta sem valor-alvo" currentCents={25_000} targetCents={0} />
        </div>
      </DemoSection>

      <DemoSection
        id="estados"
        title="Estados"
        description="Vazio, carregando e erro. O carregamento é anunciado uma única vez para leitores de tela."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState
            icon={InboxIcon}
            headingLevel={3}
            title="Nenhum lançamento por aqui"
            description="Quando houver lançamentos neste período, eles aparecem nesta lista."
          />
          <ErrorState
            headingLevel={3}
            title="Não foi possível carregar"
            action={
              <Button variant="outline" disabled>
                <RotateCwIcon aria-hidden="true" />
                Tentar novamente
              </Button>
            }
          />
        </div>
        <LoadingState label="Carregando resumo de demonstração…" />
        <LoadingState variant="list" label="Carregando lista de demonstração…" />
      </DemoSection>
    </>
  );
}
