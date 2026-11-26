# src/features

Cada subpasta representa um **domínio de negócio** (ex.: `accounts`, `transactions`, `credit-cards`, `goals`). As pastas são criadas na fase em que o domínio é implementado, nunca antes.

## Estrutura de uma feature

```
src/features/<feature>/
├─ components/   componentes React específicos do domínio
├─ actions/      Server Actions (mutações), com validação Zod e checagem de userId
├─ queries/      leituras no banco, sempre filtradas por userId
├─ schemas/      schemas Zod (entrada e saída)
├─ lib/          regras de negócio puras e testáveis
└─ index.ts      API pública da feature (o que outras camadas podem importar)
```

Crie somente as subpastas necessárias.

## Regras

- `src/app` importa de `features`. Uma feature **não** importa internos de outra feature, apenas o `index.ts` público dela.
- O código compartilhado entre features vai para `src/lib` (lógica) ou `src/components` (UI).
- Toda leitura e escrita de dados do usuário recebe o `userId` da sessão no servidor, nunca do cliente.
- Valores monetários são inteiros em centavos (ver ADR-002 em `docs/ARCHITECTURE.md`).
