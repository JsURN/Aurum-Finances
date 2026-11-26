# Design System — Aurum Finances

> Status: **fundação** (Fase 1). Componentes, toggle de tema e shadcn/ui chegam na Fase 2.

## Direção visual

Premium, moderna e minimalista. Fundos profundos, superfícies discretas, tipografia serifada para momentos de destaque e a cor usada com intenção: **vinho** para ação, **rosé** para ênfase e **ouro** para a marca e para valores relevantes. A ideia é evitar o visual genérico de dashboard: sem gradientes coloridos em todo card, sem sombras pesadas e sem excesso de ícones.

## Paleta da marca

| Nome       | Hex       | Uso                                        |
| ---------- | --------- | ------------------------------------------ |
| Background | `#101014` | Fundo da aplicação (tema escuro)           |
| Surface    | `#1B1B23` | Cards, painéis                             |
| Primary    | `#753951` | Ações principais (fundo de botão), seleção |
| Accent     | `#D98EAC` | Ênfase textual, foco, destaques            |
| Gold       | `#D5B578` | Marca, valores e métricas de destaque      |

## Tokens semânticos

Definidos em `src/app/globals.css`. Use sempre as classes do Tailwind geradas a partir deles (`bg-surface`, `text-muted-foreground`, `border-border`…), **nunca hex direto nos componentes**.

| Token                     | Escuro (padrão)       | Claro                 | Uso                         |
| ------------------------- | --------------------- | --------------------- | --------------------------- |
| `background`              | `#101014`             | `#F8F6F3`             | Fundo da página             |
| `foreground`              | `#F3F0EC`             | `#17161C`             | Texto principal             |
| `surface`                 | `#1B1B23`             | `#FFFFFF`             | Cards                       |
| `surface-elevated`        | `#23232D`             | `#F1EDE8`             | Popovers, hover de card     |
| `muted`                   | `#23232D`             | `#EEEAE5`             | Fundos secundários          |
| `muted-foreground`        | `#A29EAA`             | `#5F5A66`             | Texto secundário            |
| `border`                  | `#2C2C38`             | `#E2DCD5`             | Divisores, bordas           |
| `input`                   | `#34343F`             | `#D8D1C9`             | Borda de campos             |
| `ring`                    | `#D98EAC`             | `#753951`             | Anel de foco                |
| `primary` / `-foreground` | `#753951` / `#FFFFFF` | `#753951` / `#FFFFFF` | Botão principal             |
| `accent` / `-foreground`  | `#D98EAC` / `#101014` | `#9B4569` / `#FFFFFF` | Ênfase                      |
| `gold` / `-foreground`    | `#D5B578` / `#101014` | `#85662C` / `#FFFFFF` | Marca, destaques            |
| `success`                 | `#6FCF97`             | `#1D7348`             | Receitas, valores positivos |
| `danger`                  | `#F08A8A`             | `#B42332`             | Despesas, erros             |

No tema claro, `accent` e `gold` usam **variantes mais profundas** das cores da marca para manter o contraste AA sobre o fundo claro.

### Contraste (WCAG 2.x, calculado)

| Par                          | Escuro | Claro  |
| ---------------------------- | ------ | ------ |
| foreground / background      | 16.7:1 | 16.7:1 |
| muted-foreground / surface   | 6.5:1  | 6.7:1  |
| accent / background          | 7.6:1  | 5.6:1  |
| gold / background            | 9.7:1  | 5.0:1  |
| success / surface            | 9.0:1  | 5.8:1  |
| danger / surface             | 7.1:1  | 6.5:1  |
| primary-foreground / primary | 8.5:1  | 8.5:1  |

Todos atendem ao **AA (≥ 4.5:1)** para texto normal.

**Regra:** `primary` (`#753951`) **não** deve ser usado como cor de texto sobre fundo escuro (contraste insuficiente). No escuro ele serve apenas como fundo de botão, sempre com `primary-foreground`.

### Valores financeiros e cor

A cor nunca é o único indicador. Valores positivos e negativos também levam sinal (`+` / `−`) e rótulo, para atender pessoas com daltonismo.

## Tipografia

| Papel     | Fonte                                     | Token          | Uso                                    |
| --------- | ----------------------------------------- | -------------- | -------------------------------------- |
| Display   | Fraunces (serifada variável, eixo `opsz`) | `font-display` | Títulos, wordmark, valores em destaque |
| Interface | Manrope                                   | `font-sans`    | Texto corrido, rótulos, tabelas        |

- Ambas carregadas via `next/font/google` (self-hosted no build, sem layout shift).
- Números financeiros usam `tabular-nums` para alinhar colunas.
- Escala sugerida: `text-xs` (rótulos) · `text-sm` (interface) · `text-base/lg` (corpo) · `text-2xl–6xl` (display).

## Forma e espaço

- Raio base `--radius: 0.875rem`, com os derivados `rounded-sm/md/lg/xl`.
- Espaçamento na escala padrão do Tailwind (múltiplos de 4px). Gutter lateral de 16px no mobile e 24px a partir de `sm`.
- Largura máxima de conteúdo: `max-w-6xl`.
- Sombras discretas e raras. A hierarquia vem de superfície e borda.

## Temas

- Tema escuro é o padrão (classe `dark` no `<html>`).
- Tema claro: basta remover a classe `dark`, e todos os tokens trocam.
- A variante `dark:` do Tailwind está configurada por classe (`@custom-variant dark`).
- O toggle de tema e a persistência da preferência chegam na Fase 2.

## Acessibilidade

- Foco visível global (`:focus-visible` com `outline-ring`).
- `prefers-reduced-motion` respeitado globalmente.
- HTML semântico (`header`, `main`, `section` com `aria-labelledby`, `dl` para pares rótulo/valor).
- Elementos decorativos com `aria-hidden="true"`.
