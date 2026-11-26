# CLAUDE.md — Aurum Finances

Instruções permanentes para agentes de IA (e pessoas) que trabalham neste repositório.

@AGENTS.md

## Produto

O Aurum Finances é uma aplicação full stack de gestão financeira pessoal, com interface em **português brasileiro**. Também é um projeto de portfólio, então a qualidade precisa ser profissional. A visão completa está em [docs/PRODUCT.md](docs/PRODUCT.md) e as fases em [docs/ROADMAP.md](docs/ROADMAP.md).

## Stack e versões

| Item         | Versão                              | Observação                                                             |
| ------------ | ----------------------------------- | ---------------------------------------------------------------------- |
| Node.js      | >= 20.9 (dev: 24 LTS, ver `.nvmrc`) |                                                                        |
| Next.js      | 16.4.6 (App Router, Turbopack)      | `cacheComponents` + `partialPrefetching` ligados                       |
| React        | 19.3.0                              |                                                                        |
| TypeScript   | 6.0.3                               | **Não atualizar para 7.x**: o `typescript-eslint` exige `<6.1`         |
| Tailwind CSS | 4.3.3                               | Config em CSS (`src/app/globals.css`), loader `@tailwindcss/turbopack` |
| ESLint       | 9.x                                 | **Não atualizar para 10**: o `eslint-plugin-react` ainda não suporta   |
| Prettier     | 3.x                                 | + `prettier-plugin-tailwindcss`                                        |

Ainda não instalados (cada um entra na sua fase): shadcn/ui, Recharts, Prisma + MySQL, Auth.js, Zod, Vitest e Playwright. Pacotes que estão em pré-release na tag `latest` (Prisma 8 RC, Auth.js v5 beta) exigem decisão registrada em ADR antes de serem instalados.

## Comandos

```bash
npm run dev           # servidor de desenvolvimento (http://localhost:3000)
npm run build         # build de produção
npm run typecheck     # next typegen + tsc --noEmit
npm run lint          # ESLint
npm run format        # Prettier (escreve)
npm run format:check  # Prettier (só verifica)
npm run check         # typecheck + lint + format:check
```

Antes de dar uma fase como concluída, `npm run check` e `npm run build` precisam passar.

## Arquitetura

O projeto é orientado a funcionalidades. Os detalhes e os ADRs estão em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

- `src/app/`: rotas, layouts e composição, sem regra de negócio.
- `src/features/<domínio>/`: components, actions, queries, schemas, lib e `index.ts` público.
- `src/components/`: UI compartilhada (`ui/` para primitivos, `brand/` para a marca).
- `src/lib/`: utilitários transversais puros.
- `src/config/`: configuração estática do site.

Direção das importações: `app → features → components / lib / config`. Uma feature não importa os internos de outra. O alias de importação é `@/*` → `src/*`.

## Regras permanentes

### Processo

- Desenvolva **apenas o escopo da fase atual**. Apresente um plano antes de implementar uma fase nova.
- **Nunca** faça commit, push ou merge sem autorização explícita.
- **Nunca** invente resultados de testes ou validações. Reporte a saída real.
- **Nunca** desabilite regras de lint, checagens de tipo ou testes para esconder erros (`eslint-disable`, `@ts-ignore`, `any` para silenciar e afins). Corrija a causa.
- Documente as decisões arquiteturais relevantes como ADR em `docs/ARCHITECTURE.md` e registre as mudanças em `docs/CHANGELOG.md`.
- Explique as decisões técnicas importantes em português brasileiro.

### Dados financeiros

- **Dinheiro nunca é ponto flutuante.** Valores são **inteiros em centavos** (`amountCents`), tanto no banco quanto no código (ADR-002). Formate com `formatCurrencyFromCents` (`src/lib/format.ts`).
- **Sem dupla contagem.** A compra no cartão é a despesa e o pagamento da fatura é uma transferência, não uma nova despesa. Parcelas e recorrências geram lançamentos derivados de uma origem única. Transferências entre contas próprias não são receita nem despesa.
- **Isolamento entre usuários.** Toda query e toda mutação filtra pelo `userId` obtido da sessão no servidor, nunca de um parâmetro vindo do cliente.
- Nunca exponha credenciais ou dados financeiros reais. Use apenas dados fictícios em exemplos, seeds e testes. O `.env` nunca é versionado, e o `.env.example` só tem placeholders.

### Código

- TypeScript strict (incluindo `noUncheckedIndexedAccess`). Evite `any`.
- Server Components por padrão. Use `"use client"` só quando houver interatividade.
- Valide toda entrada externa com Zod (a partir da fase em que o Zod for instalado).
- Componentes reutilizáveis quando fizer sentido, sem abstrações prematuras.
- Os componentes usam **apenas tokens semânticos** de cor (`bg-surface`, `text-accent`…), nunca hex. Veja [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
- Acessibilidade: HTML semântico, foco visível, contraste WCAG AA, navegação por teclado e `lang="pt-BR"`.
- Responsividade mobile-first, a partir de 360px de largura.

### Idioma

- Interface, documentação e commits em **português brasileiro**.
- Código (variáveis, funções, arquivos, rotas internas) em **inglês**.

## Ambiente

- O repositório está dentro do OneDrive. A sincronização de `node_modules/` e `.next/` pode causar erros EPERM/EBUSY no Windows. Se acontecer, pause a sincronização ou mova o projeto para fora do OneDrive.
- Finais de linha: LF (`.gitattributes` e `.editorconfig`).
