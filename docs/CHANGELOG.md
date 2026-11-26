# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

_Nada ainda. A Fase 2 (Design System) não foi iniciada._

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
