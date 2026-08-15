/**
 * Short fill-help (display-only). Shown on demand via ⓘ popover.
 * Variable helpers must be built per-variable — never reuse another variable's examples.
 */

import type { VariableDef } from '@/domain/types'

export interface GuidedFieldSpec {
  label: string
  hint?: string
  /** Muted "Misal:" line under input — must match the variable being edited */
  examples: string[]
  tips: string
  gsbpm: string
}

/** Neutral templates only — never UMKM-specific. Contextualized via buildVariableFieldGuides. */
export const VARIABLE_FIELD_GUIDES = {
  name: {
    label: 'Nama variabel',
    hint: 'Wajib',
    examples: ['Usia responden'],
    tips: 'Pakai nama singkat yang sama di instrumen & metadata.',
    gsbpm: 'GSBPM 5.2 · Design 2.2',
  },
  category: {
    label: 'Kategori',
    hint: 'Opsional',
    examples: ['Identitas', 'Wilayah'],
    tips: 'Kelompokkan konsep (opsional), mis. Identitas / Wilayah.',
    gsbpm: 'GSBPM 5.2 · Design 2.2',
  },
  definition: {
    label: 'Definisi',
    hint: 'Konsep definisi',
    examples: ['Definisi operasional yang dapat diukur.'],
    tips: 'Harus operasional: jelas diukur, tanpa istilah kabur.',
    gsbpm: 'GSBPM 5.2 · Specify Need 1.4',
  },
  type: {
    label: 'Tipe data',
    examples: ['Kategorik', 'Numerik'],
    tips: 'Kode/pilihan → kategorik; angka terukur → numerik.',
    gsbpm: 'GSBPM 5.2 · Design 2.2',
  },
  scale: {
    label: 'Skala',
    examples: ['Nominal', 'Ordinal', 'Rasio'],
    tips: 'Jenis kelamin = nominal; skor Likert = ordinal; usia = rasio.',
    gsbpm: 'GSBPM 5.2 · Design 2.2',
  },
  unit: {
    label: 'Satuan',
    examples: ['Rp', '%', 'Orang'],
    tips: 'Isi jika numerik bertuan; kosongkan untuk kategorik/teks.',
    gsbpm: 'GSBPM 5.2 · Design 2.2',
  },
  source: {
    label: 'Sumber',
    examples: ['Wawancara'],
    tips: 'Tuliskan asal data: wawancara, register, OSS, dll.',
    gsbpm: 'GSBPM 5.2 · Design 2.3',
  },
  exampleValue: {
    label: 'Contoh nilai',
    examples: ['Sesuai tipe & opsi instrumen'],
    tips: 'Samakan dengan opsi kuesioner / kode kategori.',
    gsbpm: 'GSBPM 5.2 · Design 2.2',
  },
  missingValueRule: {
    label: 'Aturan nilai hilang',
    examples: ['99 = Tidak Tahu'],
    tips: 'Kode missing jangan bentrok dengan nilai valid.',
    gsbpm: 'GSBPM 5.2 · Design 2.2',
  },
} as const satisfies Record<string, GuidedFieldSpec>

export type VariableFieldKey = keyof typeof VARIABLE_FIELD_GUIDES

function clip(text: string, max = 72): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function firstPhrase(text: string): string {
  const raw = text.trim()
  if (!raw) return ''
  const phrase = raw.split(/[.(;]/)[0]?.trim() ?? raw
  return clip(phrase, 64)
}

function defaultExampleForType(type: VariableDef['type']): string {
  switch (type) {
    case 'kategorik':
      return 'Kode / kategori terpilih'
    case 'numerik':
      return 'Nilai terukur valid'
    case 'tanggal':
      return 'YYYY-MM-DD'
    case 'teks':
      return 'Teks sesuai konsep definisi'
  }
}

/**
 * Builds field guides for ONE variable so Misal/tips never leak from another variable.
 */
export function buildVariableFieldGuides(
  variable: VariableDef,
): Record<VariableFieldKey, GuidedFieldSpec> {
  const name = variable.name.trim()
  const definition = variable.definition.trim()
  const example = variable.exampleValue?.trim()
  const source = variable.source?.trim()
  const unit = variable.unit?.trim()
  const missing = variable.missingValueRule?.trim()
  const category = variable.category?.trim()

  const nameExample = (() => {
    if (!name) return VARIABLE_FIELD_GUIDES.name.examples[0]
    // Short codes (NIB, NPSN, …) → readable phrase from this variable's definition
    if (name.length <= 8 && definition) {
      const phrase = firstPhrase(definition)
      if (phrase && phrase.toLowerCase() !== name.toLowerCase()) return phrase
    }
    return name
  })()

  const definitionExample = definition
    ? clip(definition)
    : VARIABLE_FIELD_GUIDES.definition.examples[0]

  const exampleHint = example || defaultExampleForType(variable.type)

  const scaleHint =
    variable.scale === 'nominal'
      ? 'Nominal'
      : variable.scale === 'ordinal'
        ? 'Ordinal'
        : variable.scale === 'interval'
          ? 'Interval'
          : variable.scale === 'rasio'
            ? 'Rasio'
            : VARIABLE_FIELD_GUIDES.scale.examples.join(' · ')

  const typeHint =
    variable.type === 'kategorik'
      ? 'Kategorik'
      : variable.type === 'numerik'
        ? 'Numerik'
        : variable.type === 'teks'
          ? 'Teks'
          : 'Tanggal'

  return {
    name: {
      ...VARIABLE_FIELD_GUIDES.name,
      examples: [nameExample],
    },
    category: {
      ...VARIABLE_FIELD_GUIDES.category,
      examples: [category || VARIABLE_FIELD_GUIDES.category.examples.join(' · ')],
    },
    definition: {
      ...VARIABLE_FIELD_GUIDES.definition,
      examples: [definitionExample],
    },
    type: {
      ...VARIABLE_FIELD_GUIDES.type,
      examples: [typeHint],
    },
    scale: {
      ...VARIABLE_FIELD_GUIDES.scale,
      examples: [scaleHint],
    },
    unit: {
      ...VARIABLE_FIELD_GUIDES.unit,
      examples: [unit || VARIABLE_FIELD_GUIDES.unit.examples.join(' · ')],
    },
    source: {
      ...VARIABLE_FIELD_GUIDES.source,
      examples: [source || VARIABLE_FIELD_GUIDES.source.examples[0]],
    },
    exampleValue: {
      ...VARIABLE_FIELD_GUIDES.exampleValue,
      examples: [exampleHint],
    },
    missingValueRule: {
      ...VARIABLE_FIELD_GUIDES.missingValueRule,
      examples: [missing || VARIABLE_FIELD_GUIDES.missingValueRule.examples[0]],
    },
  }
}

export const QUESTION_FIELD_GUIDES = {
  number: {
    label: 'No.',
    examples: ['1', 'P1'],
    tips: 'Nomor konsisten.',
    gsbpm: 'GSBPM 5.2 · Build 3.1',
  },
  text: {
    label: 'Teks pertanyaan',
    hint: 'Wajib',
    examples: ['Bagaimana tingkat kepuasan Anda?'],
    tips: 'Satu pertanyaan = satu konsep.',
    gsbpm: 'GSBPM 5.2 · Build 3.1',
  },
  type: {
    label: 'Tipe',
    examples: ['Tertutup', 'Terbuka', 'Skala'],
    tips: 'Tertutup = pilihan.',
    gsbpm: 'GSBPM 5.2 · Build 3.1',
  },
  options: {
    label: 'Opsi jawaban',
    hint: 'Pisahkan dengan |',
    examples: ['Ya | Tidak | Tidak tahu'],
    tips: 'Samakan dengan variabel.',
    gsbpm: 'GSBPM 5.2 · Build 3.1',
  },
} as const satisfies Record<string, GuidedFieldSpec>
