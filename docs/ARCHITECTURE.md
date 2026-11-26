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
├─ app/                  rotas, layouts, metadata e estilos globais (composição apenas)
│  ├─ page.tsx           landing page (rota `/`)
│  └─ (app)/             páginas internas com o App Shell (/dashboard, /settings…)
│     └─ design-system/  vitrine do Design System (só em desenvolvimento)
├─ features/             módulos de domínio (ver src/features/README.md)
├─ components/
│  ├─ ui/                primitivos de UI (shadcn/ui + Radix, personalizados)
│  ├─ brand/             logo e elementos de marca
│  ├─ layout/            App Shell: sidebar, menu mobile, header, trilha, PageHeader
│  ├─ finance/           Money, FlowIndicator, SummaryCard, ProgressBar, ocultação de valores
│  ├─ feedback/          estados vazio, carregando, erro e "em desenvolvimento"
│  └─ preferences/       script do <head>, sincronização, hooks e controles de tema
├─ lib/                  utilitários transversais (formatação, progresso, preferências)
└─ config/               configuração estática (site, navegação, preferências)
tests/
├─ unit/                 Vitest (funções puras, ambiente Node)
└─ browser/              Playwright (validação de navegador)
docs/                    documentação do produto e da engenharia
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

### ADR-006 — shadcn/ui sobre Radix, com tokens do Aurum

- **Status:** aceito (Fase 2)
- **Contexto:** a Fase 2 precisa de primitivos acessíveis (modal, menu, select, abas) sem reinventar gerenciamento de foco e teclado. O shadcn/ui copia o código dos componentes para o projeto, o que permite personalizá-los por completo.
- **Decisão:**
  - shadcn/ui com base **Radix** (pacote unificado `radix-ui@1.8.1`), e não Base UI: o Radix é mais maduro em Select e Dialog, e o `@base-ui/react` traz peer de `date-fns`.
  - O CLI roda via `npx shadcn@4.23.1` e **não** é dependência. O `components.json` foi escrito à mão (sem `shadcn init`, que reescreve o `globals.css`). Cada `add` passa por `--dry-run` e revisão do diff.
  - Os nomes que o shadcn espera (`card`, `popover`, `secondary`, `destructive`) são **aliases** dos tokens existentes. Hover e seleção usam o token novo `highlight`, porque `accent` no Aurum é o rosé de ênfase.
  - Textos internos em pt-BR, foco pelo anel global (`:focus-visible`), sem variantes `dark:` (os tokens resolvem o tema).
  - Componentes que o escopo não pede ficam de fora (Sidebar, Breadcrumb e Progress do shadcn): o App Shell e a `ProgressBar` são próprios e menores.
- **Consequências:** atualizar um componente pelo CLI exige reaplicar as personalizações (o diff mostra o que mudou). Na instalação, o CLI adicionou ao `package.json` um pacote npm de terceiros chamado `cn` e importou dele; isso foi revertido e substituído por `src/lib/utils.ts` (`clsx` + `tailwind-merge`). Revise sempre o `package.json` depois de um `shadcn add`.

### ADR-007 — Tema sem dependência, aplicado por script inline

- **Status:** aceito (Fase 2)
- **Contexto:** o tema precisa de três opções (Claro, Escuro, Automático), persistência, sincronização entre abas, cor da barra do navegador coerente e nenhum flash nem erro de hidratação. O `next-themes` resolve parte disso, mas dispara o aviso de `<script>` do React 19 e não cobre as outras preferências de interface.
- **Decisão:** seguir o guia oficial do Next 16.4 ("Preventing flash before hydration"):
  - Uma função autocontida (`applyPreferences`, em `src/lib/preferences-script.ts`) lê o `localStorage`, valida os valores e aplica classe e atributos no `<html>` e a `meta theme-color`.
  - Ela roda **como script inline no `<head>`** (serializada com `toString()`), antes da primeira pintura, e **no cliente** pelo `PreferencesSync`, quando algo muda nesta aba, em outra aba (evento `storage`) ou no sistema operacional, e após o remount do Strict Mode.
  - O React lê as preferências com `useSyncExternalStore`, com snapshot do servidor `null`. Assim, a hidratação nunca diverge. O que é visual (ícone de sol/lua, máscara de valores) é resolvido por CSS a partir dos atributos.
  - O HTML do servidor sai com o tema escuro (padrão). `suppressHydrationWarning` fica só no `<html>`.
  - `localStorage` bloqueado ou com valores corrompidos não quebra nada: vale o padrão, e as escolhas ficam em memória durante a sessão.
  - A `viewport.themeColor` passou a ter uma única cor (a do padrão), ajustada pelo script. Antes ela seguia só o tema do sistema, o que ficaria errado com a escolha manual.
- **Consequências:** nenhuma dependência nova e as rotas continuam estáticas (o tema não é lido no servidor, então não há `cookies()` no layout). A função do script não pode usar imports nem helpers; isso é coberto por teste que executa a string gerada.

### ADR-008 — Preferências de UI como atributos no `<html>` e ocultação de valores

- **Status:** aceito (Fase 2)
- **Contexto:** sidebar recolhida e ocultação de valores também precisam persistir sem flash. A ocultação precisa valer para todos os componentes financeiros, inclusive Server Components, sem expor valores a tecnologias assistivas.
- **Decisão:**
  - Tema, sidebar e ocultação usam o mesmo mecanismo (ADR-007), refletidos como classe `dark`, `data-sidebar` e `data-values` no `<html>`. Variantes do Tailwind (`sidebar-collapsed:`, `values-hidden:`) estilizam a partir deles.
  - `Money` renderiza o valor e a máscara, e o CSS exibe um ou outro. O valor oculto recebe `display: none`, o que o remove também da árvore de acessibilidade; leitores de tela anunciam só "Valor oculto". Valores nunca vão para `title`, `aria-label`, `aria-valuetext` nem tooltips.
  - Percentuais (ex.: da `ProgressBar`) não são considerados valores monetários e continuam visíveis.
  - **A ocultação é privacidade visual, não segurança.** Os valores continuam no HTML. Isso está dito na interface (Configurações) e na documentação.
- **Consequências:** `Money`, `SummaryCard` e `ProgressBar` seguem como Server Components. Esconder valores de verdade (não enviá-los ao cliente) seria outra funcionalidade, a ser avaliada junto com autenticação.

### ADR-009 — Route groups e App Shell

- **Status:** aceito (Fase 2)
- **Decisão:** as páginas internas ficam no route group `src/app/(app)/`, com layout próprio (`AppShell`), e a landing continua em `src/app/page.tsx`, sem o shell. Rotas em inglês (`/dashboard`, `/credit-cards`…), rótulos em pt-BR, definidos em `src/config/navigation.ts`. Módulos não implementados mostram `InDevelopment` com a fase do roadmap, sem dados simulados. A página `/design-system` chama `notFound()` fora de `NODE_ENV=development`. A landing leva a `/dashboard` pelos botões de acesso, e o logotipo do shell leva de volta a `/`.
- **Consequências:** na Fase 5, a proteção por sessão se aplica ao grupo `(app)` inteiro. Todas as rotas atuais são estáticas, então o `usePathname` da navegação resolve no prerender sem `<Suspense>`. Quando surgir uma rota com parâmetro dinâmico sem `generateStaticParams`, a navegação vai precisar de um `<Suspense>` (ver a documentação de `usePathname` com Cache Components). Ícones (funções) não podem ser passados de Server para Client Components; por isso a `NavList` (cliente) lê a configuração diretamente.

### ADR-010 — Vitest e Playwright

- **Status:** aceito (Fase 2)
- **Decisão:**
  - **Vitest 4.1** (`^4.1.12`), em ambiente Node, para funções puras (`tests/unit/`). O Vitest 5 exige Node >= 22.12, incompatível com o `engines` do projeto (>= 20.9).
  - **Playwright** (`@playwright/test`, só Chromium) para a validação de navegador, versionada em `tests/browser/`. A Fase 13 amplia isso para testes E2E completos.
  - A configuração do Vitest é `vitest.config.mts`: o projeto não usa `"type": "module"`, e um `.ts` com ESM era carregado como CommonJS.
  - `npm run check` passa a incluir `npm run test`. O `test:browser` fica fora do `check`, porque faz build e sobe servidores.
- **Consequências:** `test-results/` e `playwright-report/` ficam fora do Git, do Prettier e do ESLint. No Windows, rode o Vitest a partir de um caminho com a letra do drive em maiúscula (`C:\…`): com `c:\…`, o Vitest 4 carrega dois módulos do runner e falha com "Vitest failed to find the current suite".

## Segurança (diretrizes)

- O `userId` vem sempre da sessão no servidor. Toda query filtra por ele.
- Toda entrada externa é validada com Zod antes de chegar ao banco.
- Os segredos ficam apenas em variáveis de ambiente, e o `.env` está no `.gitignore`.
- Header `x-powered-by` desabilitado. Headers de segurança (CSP etc.) entram na Fase 13.
