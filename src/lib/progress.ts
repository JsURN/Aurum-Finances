import { assertCents } from "@/lib/format";

/*
 * Progresso de um valor em direção a uma meta, em centavos inteiros.
 * A conta é feita com BigInt para não estourar nem perder precisão.
 *
 * Comportamento por caso (coberto em tests/unit/progress.test.ts):
 * - meta > 0: percent = ⌊atual × 100 ÷ meta⌋ (arredonda para baixo, então
 *   99,9% aparece como 99% e não como 100% antes de a meta ser atingida).
 * - atual ≤ 0                  → status "empty", barra em 0%.
 * - 0 < atual < meta           → status "in-progress".
 * - atual = meta               → status "complete", 100%.
 * - atual > meta               → status "exceeded"; percent passa de 100
 *                                (ex.: 150), mas `barPercent` fica em 100.
 * - meta = 0 (divisão por zero)→ status "no-target", percent = null, barra em 0%.
 * - meta < 0                   → RangeError (meta negativa não tem significado).
 * - percentual fora de ±(2^53 − 1) (meta de centavos e valor enorme) → limitado a ±(2^53 − 1).
 * - valores não inteiros, NaN, Infinity ou fora do intervalo seguro → TypeError.
 */

const ZERO = BigInt(0);
const ONE = BigInt(1);
const HUNDRED = BigInt(100);
const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);

export type ProgressStatus = "no-target" | "empty" | "in-progress" | "complete" | "exceeded";

export type Progress = {
  status: ProgressStatus;
  /** Percentual real, inteiro, podendo passar de 100. `null` quando não há meta. */
  percent: number | null;
  /** Percentual para a largura da barra, sempre entre 0 e 100. */
  barPercent: number;
};

export function calculateProgress(currentCents: number, targetCents: number): Progress {
  assertCents(currentCents);
  assertCents(targetCents);

  if (targetCents < 0) {
    throw new RangeError("A meta não pode ser negativa.");
  }
  if (targetCents === 0) {
    return { status: "no-target", percent: null, barPercent: 0 };
  }

  const current = BigInt(currentCents);
  const target = BigInt(targetCents);
  const scaled = current * HUNDRED;
  // BigInt trunca em direção a zero; para negativos queremos o piso.
  let quotient = scaled / target;
  if (scaled % target !== ZERO && scaled < ZERO) quotient -= ONE;
  // Metas minúsculas com valores enormes podem passar do intervalo seguro.
  const bounded = quotient > MAX_SAFE ? MAX_SAFE : quotient < -MAX_SAFE ? -MAX_SAFE : quotient;
  const percent = Number(bounded);

  let status: ProgressStatus;
  if (currentCents <= 0) status = "empty";
  else if (currentCents < targetCents) status = "in-progress";
  else if (currentCents === targetCents) status = "complete";
  else status = "exceeded";

  return { status, percent, barPercent: Math.min(100, Math.max(0, percent)) };
}
