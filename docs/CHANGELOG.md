# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [0.2.0] — 2026-11-26

Fase 2 — Design System concluída.

### Adicionado

- shadcn/ui (base Radix) com 14 componentes personalizados para os tokens do Aurum: Button, Card, Input, Label, Select, Dialog, Dropdown Menu, Tooltip, Badge, Table, Separator, Skeleton, Sheet e Tabs (ADR-006).
- Sistema de temas Claro, Escuro (padrão) e Automático, com persistência, sincronização entre abas, cor da barra do navegador coerente e sem flash nem erro de hidratação, via script inline no `<head>` (ADR-007).
- Preferências de interface (tema, sidebar recolhida, ocultação de valores) tolerantes a `localStorage` bloqueado ou corrompido (ADR-008).
- App Shell para as páginas internas (route group `(app)`): sidebar retrátil no desktop, menu mobile acessível, header, trilha de navegação, página ativa destacada e link para pular a navegação (ADR-009).
- Páginas internas em desenvolvimento: Visão geral, Transações, Contas bancárias, Cartões de crédito, Planejamento, A receber, Metas e wishlist, Investimentos e Relatórios, sem dados simulados.
- Página de Configurações com tema e ocultação de valores.
- Componentes financeiros: `Money`, `FlowIndicator`, `SummaryCard`, `ProgressBar` e `ValuesVisibilityToggle`, com ocultação de valores compartilhada (privacidade visual, não segurança).
- Estados reutilizáveis: vazio, carregando, erro e "em desenvolvimento"; `error.tsx` para as páginas internas.
- Página `/design-system` (apenas em desenvolvimento; 404 em produção) com tipografia, cores, botões, formulários, tabelas, modais, estados, componentes financeiros e prévia dos temas.
- Tokens `highlight`, `success-foreground`, `danger-foreground` e `overlay`, e aliases `card`, `popover`, `secondary` e `destructive` para o shadcn/ui.
- `formatCurrencyPartsFromCents`, `formatPercent`, `assertCents` e `calculateProgress` (aritmética com BigInt, exata até `Number.MAX_SAFE_INTEGER`).
- Vitest (testes de funções puras) e Playwright (validação de navegador), com os scripts `test`, `test:watch` e `test:browser` (ADR-010).
- Ícones com Lucide.
- Botões de acesso na landing page: "Acessar Aurum" no cabeçalho e "Acessar plataforma" abaixo da descrição, ambos com `Button` + `next/link` para `/dashboard`.
- Testes de navegador da navegação landing → dashboard → landing (`tests/browser/landing.spec.ts`), com a sidebar expandida, recolhida e no menu mobile, e pelo teclado.
- Capturas da landing page (360 e 1280 px, dois temas) em `tests/browser/screenshots.spec.ts`.

### Alterado

- `--input` mais forte nos dois temas: o contorno dos campos tinha 1,4:1–1,5:1 e agora tem >= 3:1 (WCAG 1.4.11).
- `formatCurrencyFromCents` usa o sinal de menos tipográfico (U+2212) e aceita `signDisplay`; a conversão para reais deixou de usar divisão em ponto flutuante.
- `viewport.themeColor` passou a ter uma única cor, ajustada ao tema aplicado.
- `Logo` aceita `wordmarkClassName` e exporta `HOME_LINK_LABEL`, o rótulo acessível dos links do logotipo.
- O logotipo do App Shell (sidebar expandida ou recolhida, menu mobile e header mobile) leva à landing page (`/`), não mais a `/dashboard`. A trilha de navegação continua começando em `/dashboard`, e a indicação da página ativa não mudou.
- No menu mobile, o título do diálogo ("Menu de navegação") passou a ser só para leitores de tela, separado do link do logotipo.
- Landing page: o selo "Em construção" fica oculto abaixo de 640 px, para o botão do cabeçalho caber a partir de 360 px.
- `npm run check` agora também roda os testes unitários.
- README: URL de clone corrigida para `JsURN/Aurum-Finances`.
- CLAUDE.md: stack, comandos e a observação sobre sincronização de pastas atualizados.

### Verificado

- `npm run check` (typecheck, lint, format:check e 112 testes unitários) e `npm run build` aprovados.
- 46 testes de navegador aprovados no Chromium: 360, 768, 1280 e 1920 px nos dois temas, sem scroll horizontal e sem erros de console ou de hidratação.
- A landing page mudou de forma intencional (botões de acesso); as capturas desta versão são a nova referência visual.
- `npm audit`: 0 vulnerabilidades.

## [0.1.0] — 2026-11-25

Fase 1 — Fundação do projeto concluída.

### Adicionado

- Projeto Next.js 16.4 (App Router, Turbopack) com React 19.3 e TypeScript 6.0 em modo strict (incluindo `noUncheckedIndexedAccess`).
- Tailwind CSS 4.3 com configuração em CSS e tokens semânticos para os temas escuro (padrão) e claro.
- ESLint 9 (`next/core-web-vitals` + `next/typescript` + `eslint-config-prettier`) e Prettier 3 com `prettier-plugin-tailwindcss`.
- Scripts `dev`, `build`, `start`, `lint`, `lint:fix`, `typecheck`, `format`, `format:check` e `check`.
- Estrutura orientada a funcionalidades (`src/app`, `src/features`, `src/components`, `src/lib`, `src/config`).
- Página inicial temporária com a identidade visual, página 404 em pt-BR e ícone da marca.
- Utilitário `formatCurrencyFromCents` para formatar valores em centavos inteiros.
- Documentação: `CLAUDE.md`, `AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md` (ADR-001 a 005), `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`, este changelog.
- `.env.example`, `.gitattributes`, `.editorconfig`, `.nvmrc`, `.prettierrc.json`, `.prettierignore`.

### Alterado

- `README.md` reescrito com a visão geral, a stack, o setup e os scripts.
- `.gitignore` ampliado com entradas de Next.js, Playwright, Prisma, chaves e sistema operacional.

### Verificado

- Build de produção, lint, typecheck e format:check aprovados.
- Responsividade validada em 360px, 768px e 1280px (sem scroll horizontal), nos temas escuro e claro.
- Foco visível por teclado e contraste WCAG AA dos tokens de texto.
- Revisão dos arquivos versionados: nenhuma credencial ou dado sensível.
