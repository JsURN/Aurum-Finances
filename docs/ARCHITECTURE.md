# Arquitetura — Aurum Finances

## Visão geral

O Aurum é um monólito full stack em **Next.js (App Router)**. Server Components e Server Actions concentram o acesso a dados no servidor, e a UI é renderizada majoritariamente no servidor, com ilhas de interatividade no cliente.

```
Navegador ──► Next.js (App Router)
               ├─ Server Components  → leitura (queries)
               ├─ Server Actions     → mutações (Zod + userId da sessão)
               └─ Prisma ORM ──► MySQL          (Fase 4)
               Auth.js → sessão / userId        (Fase 5)
```

## Estrutura de diretórios

```
src/
├─ app/              rotas, layouts, metadata e estilos globais (composição apenas)
├─ features/         módulos de domínio (ver src/features/README.md)
├─ components/
│  ├─ ui/            primitivos de UI (shadcn/ui, Fase 2)
│  └─ brand/         logo e elementos de marca
├─ lib/              utilitários transversais e puros (formatação, etc.)
└─ config/           configuração estática (nome do site, locale, moeda)
docs/                documentação do produto e da engenharia
```

### Regras de dependência

```
app  ──►  features  ──►  components · lib · config
```

- `app` não contém regra de negócio: compõe as features.
- Uma feature só expõe o que está no seu `index.ts`. Importar `features/x/lib/...` de dentro de `features/y` é proibido.
- `components` e `lib` não importam de `features`.

## Decisões arquiteturais (ADRs)

### ADR-001 — Arquitetura orientada a funcionalidades

- **Status:** aceito (Fase 1)
- **Contexto:** o produto tem muitos domínios (contas, cartões, metas…), e uma organização por tipo técnico (`components/`, `services/` globais) se espalha rápido demais.
- **Decisão:** agrupar o código por domínio em `src/features/<domínio>`, deixando o compartilhamento real em `components/` e `lib/`. Pastas de features são criadas só quando a feature é implementada.
- **Consequências:** é fácil localizar e remover uma funcionalidade inteira, as fronteiras entre domínios ficam explícitas, e mantê-las exige disciplina de importação.

### ADR-002 — Dinheiro em centavos inteiros

- **Status:** aceito (Fase 1, implementação na Fase 4)
- **Contexto:** ponto flutuante (`0.1 + 0.2 !== 0.3`) é inaceitável para valores financeiros. O `Decimal` do Prisma vira objeto no JS e é fácil convertê-lo por engano para `number`.
- **Decisão:** guardar todos os valores monetários como **inteiros em centavos** (colunas `amountCents`; `Int` ou `BigInt` conforme a faixa esperada) e fazer a aritmética só com inteiros. A conversão para exibição acontece apenas na borda, via `formatCurrencyFromCents` (`src/lib/format.ts`), que rejeita valores não inteiros.
- **Consequências:** somas exatas e serialização simples. Divisões (parcelas) exigem uma regra explícita de distribuição do resto (ex.: a diferença em centavos vai para a primeira parcela), que será definida na Fase 7.

### ADR-003 — Versões fixadas e incompatibilidades conhecidas

- **Status:** aceito (Fase 1)
- **Contexto:** em 2026-11, algumas tags `latest` do npm eram incompatíveis entre si ou estavam em pré-release.
- **Decisão:**
  - **TypeScript 6.0.x** (não 7.x): o `typescript-eslint`, usado pelo `eslint-config-next`, exige `typescript <6.1`.
  - **ESLint 9.x** (não 10): o `eslint-plugin-react` aceita até `^9.7`. O npm marca o 9.x como deprecated, mas ele é o único compatível hoje. Reavaliar quando o `eslint-config-next` suportar o 10.
  - **Prisma:** a tag `latest` aponta para `8.0.0-rc`. Na Fase 4, usar a última estável 7.x com versão exata.
  - **Auth.js:** a v5 continua em beta. A decisão (v5 beta fixada ou alternativa) será tomada em ADR na Fase 5.
  - Next, React e Tailwind fixados em versão exata. Ferramentas de desenvolvimento com `^` dentro da major compatível.
- **Consequências:** builds reproduzíveis. Atualizações de major são feitas de propósito, em PR próprio.

### ADR-004 — Tokens semânticos e tema

- **Status:** aceito (Fase 1)
- **Decisão:** as cores são definidas como CSS variables semânticas (`--background`, `--surface`, `--primary`, `--accent`, `--gold`…) em `src/app/globals.css` e expostas ao Tailwind v4 via `@theme inline`. O tema escuro (padrão) é ativado pela classe `.dark` no `<html>`, e o claro fica em `:root`. Os nomes seguem a convenção do shadcn/ui para facilitar a Fase 2.
- **Consequências:** trocar de tema não exige mudar componentes. Componentes com hex hard-coded são considerados bug.

### ADR-005 — Template oficial do Next.js 16.4

- **Status:** aceito (Fase 1)
- **Decisão:** seguir a configuração gerada pelo `create-next-app@16.4.6`: Tailwind via loader `@tailwindcss/turbopack` (sem PostCSS), `cacheComponents` e `partialPrefetching` ligados (serão o padrão na próxima major). O `AGENTS.md` com o bloco gerenciado pelo Next fica versionado.
- **Consequências:** com Cache Components, o acesso a dados dinâmicos em Server Components precisa de `<Suspense>` ou `"use cache"` explícitos, o que deve ser levado em conta nas fases de dados (4+).

## Segurança (diretrizes)

- O `userId` vem sempre da sessão no servidor. Toda query filtra por ele.
- Toda entrada externa é validada com Zod antes de chegar ao banco.
- Os segredos ficam apenas em variáveis de ambiente, e o `.env` está no `.gitignore`.
- Header `x-powered-by` desabilitado. Headers de segurança (CSP etc.) entram na Fase 13.
