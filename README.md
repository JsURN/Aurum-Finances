# Aurum Finances

Plataforma full stack moderna de gestão financeira pessoal: receitas e despesas, contas bancárias, cartões de crédito e parcelas, planejamento mensal, metas e investimentos, com uma interface premium em português brasileiro.

> 🚧 **Em desenvolvimento.** Fase 1 (Fundação do projeto) concluída. Próxima: **2 — Design System**. Veja o [roadmap](docs/ROADMAP.md).

## Stack

| Camada    | Tecnologia                                                           |
| --------- | -------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router) + React 19                                   |
| Linguagem | TypeScript 6 (strict)                                                |
| Estilo    | Tailwind CSS 4, tokens semânticos com dark/light                     |
| Qualidade | ESLint 9, Prettier 3                                                 |
| Planejado | shadcn/ui, Recharts, MySQL, Prisma, Auth.js, Zod, Vitest, Playwright |

As versões e os motivos de cada uma estão em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#adr-003--versões-fixadas-e-incompatibilidades-conhecidas).

## Pré-requisitos

- Node.js **>= 20.9** (recomendado: 24 LTS, ver `.nvmrc`)
- npm 10+
- Git

## Como rodar

```bash
git clone https://github.com/JsURN/aurum-finances.git
cd aurum-finances
npm install
cp .env.example .env   # ainda opcional na Fase 1
npm run dev
```

Acesse <http://localhost:3000>.

## Scripts

| Script                            | Descrição                                           |
| --------------------------------- | --------------------------------------------------- |
| `npm run dev`                     | Servidor de desenvolvimento                         |
| `npm run build`                   | Build de produção                                   |
| `npm run start`                   | Servidor de produção (após o build)                 |
| `npm run lint` / `lint:fix`       | ESLint                                              |
| `npm run typecheck`               | Gera os tipos de rota do Next e roda `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier                                            |
| `npm run check`                   | typecheck + lint + format:check                     |

## Estrutura

```
src/
├─ app/          rotas, layouts e estilos globais
├─ features/     módulos por domínio (contas, cartões, metas…)
├─ components/   UI compartilhada (ui/, brand/)
├─ lib/          utilitários transversais
└─ config/       configuração do site
docs/            produto, arquitetura, design system, roadmap, changelog
```

## Documentação

- [Produto](docs/PRODUCT.md)
- [Arquitetura e ADRs](docs/ARCHITECTURE.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Roadmap](docs/ROADMAP.md)
- [Changelog](docs/CHANGELOG.md)
- [Instruções para agentes de IA](CLAUDE.md)

## Princípios de engenharia

- Valores monetários em **centavos inteiros**, nunca em ponto flutuante.
- Nenhuma despesa contada duas vezes (cartão, parcelas, transferências).
- Isolamento estrito dos dados entre usuários.
- Acessibilidade (WCAG AA), segurança e responsividade desde o início.
