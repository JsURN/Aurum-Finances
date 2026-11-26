# Design System — Aurum Finances

> Status: **Fase 2 em revisão.** Tokens, temas, componentes base (shadcn/ui + Radix), App Shell e componentes financeiros implementados. A vitrine fica em `/design-system`, disponível apenas em desenvolvimento.

## Direção visual

Premium, moderna e minimalista. Fundos profundos, superfícies discretas, tipografia serifada para momentos de destaque e a cor usada com intenção: **vinho** para ação, **rosé** para ênfase e foco, **ouro** para a marca e para valores relevantes. A ideia é evitar o visual genérico de dashboard: sem gradientes coloridos em todo card, sem sombras pesadas, sem bordas desnecessárias e sem excesso de ícones.

- Cards sem sombra: a hierarquia vem da superfície (`surface`) e de uma borda discreta.
- Sombras só em camadas que flutuam (menus, modais, painéis).
- Animações curtas (150–300 ms), só de opacidade, escala sutil e deslize. Todas são desligadas com `prefers-reduced-motion`.
- Ícones: apenas [Lucide](https://lucide.dev), em `size-4` (interface) ou `size-[1.125rem]` (navegação), sempre com `aria-hidden="true"` quando acompanham texto.

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

| Token                       | Escuro (padrão)       | Claro                 | Uso                                     |
| --------------------------- | --------------------- | --------------------- | --------------------------------------- |
| `background`                | `#101014`             | `#F8F6F3`             | Fundo da página                         |
| `foreground`                | `#F3F0EC`             | `#17161C`             | Texto principal                         |
| `surface`                   | `#1B1B23`             | `#FFFFFF`             | Cards                                   |
| `surface-elevated`          | `#23232D`             | `#F1EDE8`             | Popovers, menus                         |
| `muted`                     | `#23232D`             | `#EEEAE5`             | Fundos secundários, trilho de progresso |
| `muted-foreground`          | `#A29EAA`             | `#5F5A66`             | Texto secundário                        |
| `highlight` / `-foreground` | `#2C2430` / `#F3F0EC` | `#F3E8EC` / `#17161C` | Hover e seleção (menus, listas, nav)    |
| `border`                    | `#2C2C38`             | `#E2DCD5`             | Divisores (decorativos)                 |
| `input`                     | `#75707F`             | `#8A828F`             | Contorno de campos (>= 3:1)             |
| `ring`                      | `#D98EAC`             | `#753951`             | Anel de foco                            |
| `primary` / `-foreground`   | `#753951` / `#FFFFFF` | `#753951` / `#FFFFFF` | Botão principal                         |
| `accent` / `-foreground`    | `#D98EAC` / `#101014` | `#9B4569` / `#FFFFFF` | Ênfase, página ativa                    |
| `gold` / `-foreground`      | `#D5B578` / `#101014` | `#85662C` / `#FFFFFF` | Marca, destaques, progresso             |
| `success` / `-foreground`   | `#6FCF97` / `#101014` | `#1D7348` / `#FFFFFF` | Receitas, metas atingidas               |
| `danger` / `-foreground`    | `#F08A8A` / `#101014` | `#B42332` / `#FFFFFF` | Despesas, erros, ações destrutivas      |
| `overlay`                   | preto 72%             | grafite 45%           | Fundo de modais e do menu mobile        |

No tema claro, `accent` e `gold` usam **variantes mais profundas** das cores da marca para manter o contraste AA sobre o fundo claro.

### Aliases do shadcn/ui

Os componentes do shadcn/ui esperam alguns nomes próprios. Eles são **aliases** dos tokens acima (definidos em `@theme inline`), sem cores novas:

| Alias do shadcn | Aponta para        |
| --------------- | ------------------ |
| `card`          | `surface`          |
| `popover`       | `surface-elevated` |
| `secondary`     | `muted`            |
| `destructive`   | `danger`           |

**Atenção:** no shadcn, `accent` é a cor de hover de menus. No Aurum, `accent` é o **rosé de ênfase**. Hover e seleção usam `highlight`. Ao adicionar um componente novo com o CLI, troque `bg-accent`/`text-accent-foreground` de hover por `bg-highlight`/`text-highlight-foreground`.

### Contraste (WCAG 2.x)

Verificado automaticamente em `tests/unit/design-tokens.test.ts`, que lê o `globals.css` e falha se algum par cair abaixo do mínimo: **4.5:1** para texto (critério 1.4.3) e **3:1** para contorno de componentes e foco (critério 1.4.11).

| Par                               | Escuro | Claro  |
| --------------------------------- | ------ | ------ |
| foreground / background           | 16.7:1 | 16.7:1 |
| muted-foreground / surface        | 6.5:1  | 6.7:1  |
| muted-foreground / highlight      | 5.7:1  | 5.6:1  |
| accent / background               | 7.6:1  | 5.6:1  |
| accent / highlight                | 6.0:1  | 5.1:1  |
| gold / background                 | 9.7:1  | 4.9:1  |
| success / surface                 | 9.0:1  | 5.8:1  |
| danger / surface                  | 7.1:1  | 6.5:1  |
| primary-foreground / primary      | 8.5:1  | 8.5:1  |
| tooltip (background / foreground) | 16.7:1 | 16.7:1 |
| input / surface (contorno)        | 3.6:1  | 3.7:1  |
| input / surface-elevated          | 3.2:1  | 3.2:1  |
| ring / surface (foco)             | 6.9:1  | 8.5:1  |

**Regras:**

- `primary` (`#753951`) **não** deve ser usado como cor de texto sobre fundo escuro. No escuro ele serve apenas como fundo de botão, sempre com `primary-foreground`.
- `border` é decorativo (divisores). Para o contorno de controles interativos, use `input`.

### Valores financeiros e cor

A cor nunca é o único indicador. Valores positivos e negativos levam sinal (`+` / `−`, com o sinal de menos tipográfico U+2212), ícone e rótulo, para atender pessoas com daltonismo.

## Tipografia

| Papel     | Fonte                                     | Token          | Uso                                    |
| --------- | ----------------------------------------- | -------------- | -------------------------------------- |
| Display   | Fraunces (serifada variável, eixo `opsz`) | `font-display` | Títulos, wordmark, valores em destaque |
| Interface | Manrope                                   | `font-sans`    | Texto corrido, rótulos, tabelas        |

- Ambas carregadas via `next/font/google` (self-hosted no build, sem layout shift).
- Números financeiros usam `tabular-nums` para alinhar colunas.
- Escala: `text-xs` (rótulos) · `text-sm` (interface) · `text-base/lg` (corpo) · `text-2xl–6xl` (display). Títulos de página: `PageHeader` (`text-3xl sm:text-4xl`).

## Forma e espaço

- Raio base `--radius: 0.875rem`, com os derivados `rounded-xs/sm/md/lg/xl`. Controles usam `rounded-md`; cards e modais, `rounded-xl`.
- Espaçamento na escala padrão do Tailwind (múltiplos de 4px). Gutter lateral de 16px no mobile, 24px a partir de `sm` e 32px a partir de `lg`.
- Largura máxima: `max-w-6xl` na landing e `max-w-7xl` nas páginas internas.
- Alvos de toque: botões com no mínimo 36px (`sm`) e 40px no tamanho padrão.

## Temas

- Três opções: **Escuro** (padrão), **Claro** e **Automático** (segue o sistema operacional, inclusive quando ele muda com a página aberta).
- A escolha fica no `localStorage` (`aurum:theme`) e é sincronizada entre abas.
- **Sem flash:** um script inline no `<head>` aplica o tema antes da primeira pintura (ADR-007). O HTML do servidor sai com o tema escuro; o script corrige se necessário.
- **Barra do navegador:** a `<meta name="theme-color">` acompanha o tema aplicado (não só o do sistema).
- Alternância no header (menu Claro / Escuro / Automático) e em **Configurações → Aparência**.
- A variante `dark:` do Tailwind continua configurada por classe. Prefira tokens: a variante só é necessária para trocar elementos (ex.: ícone de sol/lua).
- `.light` e `.dark` podem ser usadas num trecho da página para forçar um tema (usado na prévia lado a lado da vitrine).

## Preferências de interface

| Preferência | Chave           | Valores                     | Padrão     | Atributo no `<html>` |
| ----------- | --------------- | --------------------------- | ---------- | -------------------- |
| Tema        | `aurum:theme`   | `light` · `dark` · `system` | `dark`     | classe `dark`        |
| Sidebar     | `aurum:sidebar` | `expanded` · `collapsed`    | `expanded` | `data-sidebar`       |
| Valores     | `aurum:values`  | `visible` · `hidden`        | `visible`  | `data-values`        |

- Valores ausentes, inválidos ou corrompidos caem no padrão.
- Com `localStorage` bloqueado ou indisponível, a aplicação funciona com os padrões e a escolha vale só durante a sessão (fica em memória).
- Variantes do Tailwind para estilizar pelo estado: `sidebar-collapsed:`, `sidebar-expanded:` e `values-hidden:`. Como o estado vem de um atributo aplicado antes da pintura, nada pisca na hidratação.

## Componentes

### Primitivos (`src/components/ui/`)

Gerados com o CLI do shadcn/ui (base Radix) e personalizados com os tokens do Aurum. Textos internos em pt-BR ("Fechar").

| Componente                      | Notas                                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `Button`                        | Variantes `default`, `secondary`, `outline`, `ghost`, `destructive` (contornado), `link`. `asChild` para links. |
| `Card`                          | Sem sombra. `CardTitle` é neutro: coloque o `<h2>`/`<h3>` adequado dentro dele.                                 |
| `Input`                         | `text-base` no mobile (evita zoom do iOS). Erro via `aria-invalid` + `aria-describedby`.                        |
| `Label`                         | Associado por `htmlFor`.                                                                                        |
| `Select`                        | Radix: teclado, typeahead, foco devolvido ao gatilho.                                                           |
| `Dialog`                        | Foco preso, Esc fecha, foco volta ao gatilho. Sempre com `DialogTitle` e `DialogDescription`.                   |
| `Sheet`                         | Painel lateral (Radix Dialog). Usado no menu mobile.                                                            |
| `DropdownMenu`                  | Itens com setas, typeahead e grupos de rádio (menu de tema).                                                    |
| `Tooltip`                       | Abre no hover e no foco. **Nunca** coloque valores financeiros nele.                                            |
| `Badge`                         | `default`, `secondary`, `outline`, `gold`, `success`, `danger`.                                                 |
| `Table`                         | Rolagem horizontal própria. `scrollLabel` torna a área focável e nomeada.                                       |
| `Separator`, `Skeleton`, `Tabs` | `Skeleton` é decorativo (`aria-hidden`); o anúncio fica com `LoadingState`.                                     |

### App Shell (`src/components/layout/`)

- `AppShell`: link para pular a navegação, sidebar, header e `<main id="content">`.
- `AppSidebar`: a partir de 1024px. Expandida (256px) ou recolhida (72px, com tooltip nos itens). Estado persistido.
- `MobileNav`: abaixo de 1024px, `Sheet` com foco preso; fecha ao navegar e ao alargar a janela.
- `AppHeader`: menu mobile, trilha (`Breadcrumbs`), ocultação de valores e tema.
- `Breadcrumbs`: trilha completa a partir de 640px; no mobile, só a página atual.
- `PageHeader`: o único `<h1>` da página.
- A página ativa recebe `aria-current="page"`, barra lateral rosé e peso de fonte maior (não depende só de cor).

### Financeiros (`src/components/finance/`)

| Componente               | Uso                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `Money`                  | Valor em centavos inteiros. `signDisplay`, `tone`. Quebra só entre grupos de milhar. |
| `FlowIndicator`          | Receita (+), despesa (−) ou transferência (sem sinal), com ícone e rótulo.           |
| `SummaryCard`            | Rótulo + valor em destaque + rodapé. Tamanho do valor acompanha a largura do card.   |
| `ProgressBar`            | Meta (`goal`) ou limite (`limit`), com status textual e `role="progressbar"`.        |
| `ValuesVisibilityToggle` | Liga/desliga a ocultação (`aria-pressed`). Variante ícone (header) ou botão.         |

### Estados (`src/components/feedback/`)

`EmptyState`, `LoadingState` (`role="status"`, anunciado uma vez), `ErrorState` (`live` para anunciar erros que surgem depois do carregamento; nunca exibe a mensagem técnica) e `InDevelopment` (páginas cujo módulo ainda não existe, com a fase do roadmap e sem dados simulados).

## Ocultação de valores financeiros

A ocultação serve para usar o Aurum em público sem expor números na tela. **Ela é apenas visual e não é um mecanismo de segurança ou de controle de acesso:** os valores continuam no HTML e qualquer pessoa com acesso ao navegador pode exibi-los de novo.

Como funciona (ADR-008):

1. Cada `Money` renderiza o valor e uma máscara (`R$ •••••`, largura fixa, sem revelar a ordem de grandeza).
2. O CSS mostra um ou outro conforme `data-values` no `<html>`. Com a ocultação ativa, o valor fica com `display: none` e sai também da árvore de acessibilidade: leitores de tela anunciam apenas **"Valor oculto"**.
3. O script do `<head>` aplica a preferência antes da primeira pintura, então não há flash de valores no carregamento nem na hidratação.

Regras para quem cria componentes:

- Valor monetário só aparece via `Money`. Nunca em `title`, `aria-label`, `aria-valuetext`, tooltip ou texto solto.
- O nome acessível de cards e seções vem do rótulo, nunca do valor.
- A `ProgressBar` expõe em `aria-valuetext` só o percentual e o status. **Percentuais continuam visíveis** com a ocultação ativa, porque não são valores monetários.

## Acessibilidade

- `lang="pt-BR"`, HTML semântico e landmarks (`header`, `nav` nomeadas, `main`).
- Link "Pular para o conteúdo" como primeiro elemento focável.
- Foco visível global (`:focus-visible` com `outline-ring`, offset de 2px), com contraste >= 3:1 nos dois temas.
- Modais e menus com gerenciamento de foco do Radix.
- `prefers-reduced-motion` respeitado globalmente.
- Elementos decorativos com `aria-hidden="true"`.

## Página de demonstração (`/design-system`)

Recurso interno de desenvolvimento: tipografia, cores, botões, formulários, tabelas, modais, estados, componentes financeiros e a prévia dos temas lado a lado. Usa apenas dados fictícios.

- Disponível só com `npm run dev` (<http://localhost:3000/design-system>), e também linkada em **Configurações** no desenvolvimento.
- Em produção responde **404**, tem `noindex` e não aparece em nenhuma navegação.

## Testes e validação

| Comando                | O que verifica                                                                                                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run test`         | Vitest (Node): formatação monetária, progresso, preferências, script do `<head>`, contraste dos tokens, navegação.                                                                                                     |
| `npm run test:browser` | Playwright (Chromium): App Shell em 360/768/1280/1920 px nos dois temas, ausência de scroll horizontal, navegação, sidebar, menu mobile, teclado, temas, preferências, ocultação de valores e valores longos em 360px. |

Para reproduzir a validação de navegador:

```bash
npx playwright install chromium   # uma vez
npm run test:browser              # faz o build, sobe `next start` (3100) e usa `next dev` (3000)
```

- Se já houver um `npm run dev` rodando na porta 3000, ele é reaproveitado (o Next 16 não permite dois `next dev` no mesmo diretório).
- Capturas do App Shell são salvas em `test-results/screenshots/`. Relatórios em `playwright-report/`. Nenhum dos dois é versionado.
