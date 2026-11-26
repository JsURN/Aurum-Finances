import {
  ArrowLeftRightIcon,
  CalendarRangeIcon,
  ChartColumnIcon,
  CreditCardIcon,
  HandCoinsIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  TargetIcon,
  TrendingUpIcon,
  type LucideIcon,
} from "lucide-react";

/*
 * Navegação das páginas internas (App Shell). Rotas em inglês, rótulos em pt-BR.
 * `phase` é a fase do roadmap (docs/ROADMAP.md) em que o módulo é entregue.
 */

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  phase: number;
};

export const mainNavigation = [
  {
    label: "Visão geral",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    description:
      "Saldo consolidado, fluxo do mês, próximas faturas e o andamento das metas em uma única tela.",
    phase: 3,
  },
  {
    label: "Transações",
    href: "/transactions",
    icon: ArrowLeftRightIcon,
    description:
      "Receitas, despesas e transferências categorizadas por conta, sem contar nenhum valor duas vezes.",
    phase: 6,
  },
  {
    label: "Contas bancárias",
    href: "/accounts",
    icon: LandmarkIcon,
    description: "Contas correntes, poupanças e carteiras, cada uma com o próprio saldo.",
    phase: 6,
  },
  {
    label: "Cartões de crédito",
    href: "/credit-cards",
    icon: CreditCardIcon,
    description:
      "Limites, faturas por ciclo de fechamento e compras parceladas, com o pagamento da fatura tratado como transferência.",
    phase: 7,
  },
  {
    label: "Planejamento",
    href: "/planning",
    icon: CalendarRangeIcon,
    description: "Orçamento mensal por categoria, com o previsto comparado ao realizado.",
    phase: 9,
  },
  {
    label: "A receber",
    href: "/receivables",
    icon: HandCoinsIcon,
    description:
      "Valores emprestados e despesas divididas com outras pessoas, que só viram receita quando forem recebidos.",
    phase: 9,
  },
  {
    label: "Metas e wishlist",
    href: "/goals",
    icon: TargetIcon,
    description: "Objetivos com valor-alvo, prazo e progresso, além de uma lista de desejos.",
    phase: 10,
  },
  {
    label: "Investimentos",
    href: "/investments",
    icon: TrendingUpIcon,
    description: "Reserva de emergência e carteira consolidada em uma visão única.",
    phase: 12,
  },
  {
    label: "Relatórios",
    href: "/reports",
    icon: ChartColumnIcon,
    description: "Evolução do patrimônio, gastos por categoria e comparativos entre períodos.",
    phase: 11,
  },
] as const satisfies readonly NavItem[];

export const settingsNavItem = {
  label: "Configurações",
  href: "/settings",
  icon: SettingsIcon,
} as const;

/** Rotas fora da navegação principal, usadas só nos breadcrumbs. */
export const auxiliaryRoutes = [
  { label: "Design System", href: "/design-system", parent: "Desenvolvimento" },
] as const;

export type NavHref = (typeof mainNavigation)[number]["href"];

export function getNavItem(href: NavHref): NavItem {
  const item = mainNavigation.find((entry) => entry.href === href);
  if (!item) throw new Error(`Item de navegação inexistente: ${href}`);
  return item;
}

/** Um link está ativo na própria rota e nas sub-rotas (ex.: /accounts/123). */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
