/**
 * Sample size helpers — Yamane (+ optional Z formula with finite population correction).
 * Grounded in Modul Proses Bisnis Statistik (kalkulator sampel, hal. 48 per README BPS).
 * Display-only planning aid; not a substitute for official sampling design review by BPS.
 */

export type YamaneResult = {
  method: 'yamane'
  n: number
  formula: string
  note: string
}

export type ZResult = {
  method: 'z'
  n: number
  n0: number
  formula: string
  note: string
}

export function yamaneSampleSize(populationN: number, marginError: number): YamaneResult {
  const N = Math.max(1, Math.floor(populationN))
  const e = Math.max(0.001, Math.min(0.5, marginError))
  const n = Math.ceil(N / (1 + N * e * e))
  return {
    method: 'yamane',
    n,
    formula: `n = N / (1 + N·e²) = ${N} / (1 + ${N}·${e}²)`,
    note: 'Rumus Yamane — ilustrasi perencanaan. Validasi desain sampel bersama BPS sebelum pelaksanaan.',
  }
}

/**
 * Simple random sample size with Z, proportion p, margin e, finite population correction.
 */
export function zSampleSize(
  populationN: number,
  z: number,
  p: number,
  marginError: number,
): ZResult {
  const N = Math.max(1, Math.floor(populationN))
  const e = Math.max(0.001, Math.min(0.5, marginError))
  const zVal = Math.max(0.1, z)
  const prop = Math.min(0.99, Math.max(0.01, p))
  const n0 = (zVal * zVal * prop * (1 - prop)) / (e * e)
  const n = Math.ceil(n0 / (1 + (n0 - 1) / N))
  return {
    method: 'z',
    n0: Math.ceil(n0),
    n,
    formula: `n₀ = Z²·p·(1−p)/e² → n = n₀ / (1 + (n₀−1)/N)`,
    note: 'Rumus Z dengan koreksi populasi hingga — ilustrasi perencanaan. Validasi bersama BPS.',
  }
}

export const Z_LEVELS = [
  { label: '90%', z: 1.645 },
  { label: '95%', z: 1.96 },
  { label: '99%', z: 2.576 },
] as const

export function formatSampleResultLine(r: YamaneResult | ZResult, N: number, e: number): string {
  if (r.method === 'yamane') {
    return `${r.n} unit (Yamane; N=${N}; e=${(e * 100).toFixed(1)}%)`
  }
  return `${r.n} unit (Z; N=${N}; e=${(e * 100).toFixed(1)}%; n₀=${r.n0})`
}
