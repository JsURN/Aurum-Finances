/*
 * Dados FICTÍCIOS da página de demonstração. Nenhum valor pertence a uma
 * pessoa real. Todos os valores estão em centavos inteiros (ADR-002).
 */

import type { FlowType } from "@/components/finance/flow-indicator";

export type DemoTransaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  type: FlowType;
  cents: number;
};

export const demoTransactions: DemoTransaction[] = [
  {
    id: "t1",
    date: "05/11",
    description: "Salário — Empresa Exemplo",
    category: "Renda",
    account: "Conta corrente",
    type: "income",
    cents: 985_000,
  },
  {
    id: "t2",
    date: "07/11",
    description: "Mercado do Bairro",
    category: "Alimentação",
    account: "Cartão Aurum",
    type: "expense",
    cents: 48_732,
  },
  {
    id: "t3",
    date: "10/11",
    description: "Aluguel",
    category: "Moradia",
    account: "Conta corrente",
    type: "expense",
    cents: 210_000,
  },
  {
    id: "t4",
    date: "12/11",
    description: "Reserva de emergência",
    category: "Transferência",
    account: "Corrente → Poupança",
    type: "transfer",
    cents: 50_000,
  },
  {
    id: "t5",
    date: "18/11",
    description: "Freela de design",
    category: "Renda extra",
    account: "Conta corrente",
    type: "income",
    cents: 120_050,
  },
];

export const demoSummary = {
  balance: 2_438_055,
  income: 1_105_050,
  expenses: 621_430,
  invoice: 193_240,
  /** Valor propositalmente longo para validar o layout em 360px. */
  longValue: 1_234_567_890_123,
} as const;
