# Produto — Aurum Finances

## Visão

O Aurum Finances quer ser o lugar onde uma pessoa entende **para onde vai o seu dinheiro e para onde ela quer que ele vá**. Ele junta contas, cartões, planejamento, metas e investimentos em uma interface premium, calma e objetiva, sem a poluição visual de planilhas e sem a aparência genérica de dashboards.

## Público-alvo

Pessoas físicas no Brasil que:

- usam mais de uma conta bancária e um ou mais cartões de crédito;
- fazem compras parceladas e têm despesas recorrentes;
- querem planejar o mês e acompanhar metas;
- emprestam dinheiro ou dividem despesas com terceiros.

## Princípios

1. **Precisão acima de tudo.** Os valores são exatos (centavos inteiros) e nenhuma despesa é contada duas vezes.
2. **Privacidade.** Os dados de cada usuário ficam isolados, e nada sensível vai para logs ou para o cliente sem necessidade.
3. **Clareza.** Cada tela responde a uma pergunta (ex.: "quanto posso gastar até o fim do mês?").
4. **Calma visual.** Interface minimalista, com hierarquia tipográfica forte e cor usada com intenção.
5. **Acessível e responsivo.** Funciona bem no celular, no teclado e com leitores de tela.

## Módulos planejados

| Módulo                   | Descrição                                                     |
| ------------------------ | ------------------------------------------------------------- |
| Dashboard                | Saldo consolidado, fluxo do mês, próximas faturas e metas.    |
| Receitas e despesas      | Lançamentos categorizados por conta.                          |
| Contas bancárias         | Corrente, poupança, carteira e saldos.                        |
| Cartões de crédito       | Limites, faturas por ciclo de fechamento, compras parceladas. |
| Recorrências             | Lançamentos que se repetem (assinaturas, salário, aluguel).   |
| Planejamento mensal      | Orçamento por categoria, previsto x realizado.                |
| A receber                | Valores emprestados e divisões com terceiros.                 |
| Metas e wishlist         | Objetivos com valor-alvo, prazo e progresso.                  |
| Investimentos e reservas | Reserva de emergência e carteira consolidada.                 |
| Relatórios               | Gráficos de evolução, categorias e comparativos.              |

## Regras de negócio essenciais (para fases futuras)

- **Compra no cartão** = despesa na data da compra, alocada a uma fatura. **Pagamento da fatura** = transferência da conta para o cartão, não uma nova despesa.
- **Compra parcelada** = uma compra de origem que gera N parcelas, uma em cada fatura. O total da compra é contado uma única vez.
- **Transferência entre contas próprias** não altera o patrimônio e não entra em receitas/despesas.
- **Valores a receber** não são receita até serem efetivamente recebidos.

## Fora de escopo (por enquanto)

- Integração bancária automática (Open Finance).
- Múltiplas moedas (somente BRL no início).
- Contas compartilhadas entre usuários.
