# Roadmap — Aurum Finances

Legenda: ✅ concluída · 🚧 em andamento · ⏳ planejada

**Situação atual:** Fase 1 concluída (v0.1.0, 2026-11-25). Fase 2 — Design System implementada e em revisão.

| #   | Fase                          | Status | Entregas principais                                                                                 |
| --- | ----------------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| 1   | Fundação do projeto           | ✅     | Next.js, TypeScript strict, Tailwind, ESLint/Prettier, arquitetura, documentação, página temporária |
| 2   | Design System                 | 🚧     | shadcn/ui, componentes base, temas, App Shell, componentes financeiros, Vitest, Playwright          |
| 3   | Dashboard visual              | ⏳     | Layout autenticado (mock), Recharts, cards de resumo com dados fictícios                            |
| 4   | Banco de dados                | ⏳     | MySQL, Prisma (estável), schema inicial em centavos, seeds fictícios                                |
| 5   | Autenticação                  | ⏳     | Auth.js, sessão, proteção de rotas, isolamento por `userId`                                         |
| 6   | Contas e transações           | ⏳     | CRUD de contas, receitas, despesas, transferências, categorias, Zod                                 |
| 7   | Cartões de crédito e parcelas | ⏳     | Faturas por ciclo, parcelamento sem dupla contagem, pagamento de fatura                             |
| 8   | Recorrências                  | ⏳     | Regras de repetição e geração de lançamentos                                                        |
| 9   | Planejamento financeiro       | ⏳     | Orçamento mensal, previsto x realizado, valores a receber                                           |
| 10  | Metas e wishlist              | ⏳     | Metas com prazo e progresso, lista de desejos                                                       |
| 11  | Relatórios                    | ⏳     | Gráficos, filtros por período e categoria                                                           |
| 12  | Investimentos                 | ⏳     | Reservas e carteira consolidada                                                                     |
| 13  | Qualidade e segurança         | ⏳     | Playwright E2E, cobertura, headers de segurança, auditoria                                          |
| 14  | Deploy e lançamento           | ⏳     | CI/CD, ambiente de produção, monitoramento                                                          |

## Pendências da Fase 2

Itens que faltam para concluir a Fase 2. Ainda não foram implementados.

- [ ] Botões de acesso na landing page, para entrar nas páginas internas (hoje a landing não tem nenhum link para o App Shell).
- [ ] Link de retorno pelo logotipo no App Shell (hoje o logotipo leva para `/dashboard`, e não há caminho de volta para a landing).

## Definição de pronto (todas as fases)

- Escopo da fase entregue, sem funcionalidades de fases futuras.
- `npm run check` e `npm run build` passando (e os testes, a partir da fase em que forem introduzidos).
- Documentação e `CHANGELOG.md` atualizados, com ADRs para as decisões relevantes.
- Revisão de acessibilidade e responsividade nas telas novas.
