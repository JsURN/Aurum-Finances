# Aurum Finances

Plataforma full stack moderna de gestão financeira pessoal: receitas e despesas, contas bancárias, cartões de crédito e parcelas, planejamento mensal, metas e investimentos, com uma interface premium em português brasileiro.

> 🚧 **Em desenvolvimento.** Fase 1 (Fundação do projeto) concluída. Fase **2 — Design System** em revisão. Veja o [roadmap](docs/ROADMAP.md).

## Stack

| Camada    | Tecnologia                                                          |
| --------- | ------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router) + React 19                                  |
| Linguagem | TypeScript 6 (strict)                                               |
| Estilo    | Tailwind CSS 4, tokens semânticos com dark/light, shadcn/ui (Radix) |
| Ícones    | Lucide                                                              |
| Qualidade | ESLint 9, Prettier 3, Vitest 4, Playwright                          |
| Planejado | Recharts, MySQL, Prisma, Auth.js, Zod                               |

As versões e os motivos de cada uma estão em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#adr-003--versões-fixadas-e-incompatibilidades-conhecidas).

## Pré-requisitos

- Node.js **>= 20.9** (recomendado: 24 LTS, ver `.nvmrc`)
- npm 10+
- Git

## Como rodar

```bash
git clone https://github.com/JsURN/Aurum-Finances.git
cd Aurum-Finances
npm install
cp .env.example .env   # ainda opcional
npm run dev
```

Acesse <http://localhost:3000>. As páginas internas começam em <http://localhost:3000/dashboard>, e a vitrine do Design System (só em desenvolvimento) fica em <http://localhost:3000/design-system>.

## Scripts

| Script                            | Descrição                                           |
| --------------------------------- | --------------------------------------------------- |
| `npm run dev`                     | Servidor de desenvolvimento                         |
| `npm run build`                   | Build de produção                                   |
| `npm run start`                   | Servidor de produção (após o build)                 |
| `npm run lint` / `lint:fix`       | ESLint                                              |
| `npm run typecheck`               | Gera os tipos de rota do Next e roda `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier                                            |
| `npm run test` / `test:watch`     | Testes unitários (Vitest)                           |
| `npm run test:browser`            | Validação de navegador (Playwright, Chromium)       |
| `npm run check`                   | typecheck + lint + format:check + test              |

## Estrutura

```
src/
├─ app/          rotas, layouts e estilos globais
├─ features/     módulos por domínio (contas, cartões, metas…)
├─ components/   UI compartilhada (ui/, brand/)
├─ lib/          utilitários transversais
└─ config/       configuração do site e da navegação
tests/           unit/ (Vitest) e browser/ (Playwright)
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
