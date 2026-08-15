/**
 * Verify demo progress targets — run: npx tsx scripts/qa-demo.ts
 */
import { buildVariableFieldGuides } from '../src/content/fieldGuides'
import { cariContohTopik, getContohFase, buildRichContohFase } from '../src/content/contohTopik'
import { buildDemoProjects } from '../src/demo/projects'
import { getDemoRecordCounts, summarizeProgress } from '../src/demo/seed'
import { computeDashboardStatistics } from '../src/demo/statistics'
import { yamaneSampleSize } from '../src/lib/sampleSize'

const projects = buildDemoProjects()
const summary = summarizeProgress(projects)
const counts = getDemoRecordCounts(projects)
const stats = computeDashboardStatistics(projects)

const failures: string[] = []

const expected: Record<string, number> = {
  'demo-skm-dpmptsp-2026': 98,
  'demo-umkm-koperasi-2026': 67,
  'demo-dukcapil-kompromin-2026': 42,
  'demo-padi-pertanian-2026': 100,
  'demo-sarana-pendidikan-2026': 85,
}

for (const row of summary) {
  const want = expected[row.id]
  if (want === undefined) {
    failures.push(`Unexpected project id: ${row.id}`)
    continue
  }
  // Allow ±1 rounding difference
  if (Math.abs(row.pct - want) > 1) {
    failures.push(`${row.id}: expected ~${want}%, got ${row.pct}% (${row.done}/${row.total})`)
  }
}

if (counts.projects !== 5) failures.push(`Expected 5 projects, got ${counts.projects}`)
if (counts.variables < 40) failures.push(`Too few variables: ${counts.variables}`)
if (counts.questionnaireItems < 30) failures.push(`Too few questions: ${counts.questionnaireItems}`)

{
  const y = yamaneSampleSize(10000, 0.05)
  if (y.n < 100 || y.n > 4000) failures.push(`Yamane n unexpected: ${y.n}`)
  const umkm = cariContohTopik('Pendataan UMKM Loteng')
  if (umkm.kategori !== 'umkm') failures.push(`Expected umkm topic, got ${umkm.kategori}`)
  const fase = getContohFase('produksi padi', 'design')
  if (!fase || fase.aktivitas.length === 0) failures.push('Missing pertanian design ilustrasi')
  const rich = buildRichContohFase('kepuasan pelayanan', 'specify_need', 'survei')
  if (!rich || rich.aktivitas.length < 4) {
    failures.push(`Rich contoh too thin: ${rich?.aktivitas.length ?? 0}`)
  }
}

// No empty critical fields
for (const p of projects) {
  if (!p.metadata.kegiatan.nama_kegiatan) failures.push(`${p.id}: empty MS-Keg nama`)
  if (!p.portalSdi.sirusaChecked || !p.portalSdi.romantikChecked) {
    failures.push(`${p.id}: portal SDI incomplete`)
  }
  if (p.variables.length === 0) failures.push(`${p.id}: no variables`)
  if (p.jenisKegiatan !== 'kompromin' && p.questionnaire.length === 0) {
    failures.push(`${p.id}: missing questionnaire`)
  }
  if (p.jenisKegiatan === 'kompromin' && p.questionnaire.length > 0) {
    failures.push(`${p.id}: kompromin should not have questionnaire`)
  }

  // Variable field consistency — every field must describe the same variable
  for (const variable of p.variables) {
    const label = `${p.id}/${variable.id} (${variable.name})`
    if (!variable.name.trim()) failures.push(`${label}: empty name`)
    if (!variable.definition.trim()) failures.push(`${label}: empty definition`)
    if (!variable.type) failures.push(`${label}: empty type`)
    if (!variable.scale) failures.push(`${label}: empty scale`)
    if (!variable.source?.trim()) failures.push(`${label}: empty source`)
    if (!variable.exampleValue?.trim()) failures.push(`${label}: empty exampleValue`)
    if (!variable.missingValueRule?.trim()) failures.push(`${label}: empty missingValueRule`)

    // Helpers must be derived from THIS variable (never static UMKM leak)
    const guides = buildVariableFieldGuides(variable)
    if (guides.name.examples.some((e) => /Nama Usaha/i.test(e) && variable.name !== 'Nama usaha')) {
      failures.push(`${label}: name helper leaked "Nama Usaha"`)
    }
    if (
      variable.name !== 'Nama usaha' &&
      guides.definition.examples.some((e) => /Nama resmi usaha responden/i.test(e))
    ) {
      failures.push(`${label}: definition helper leaked Nama usaha text`)
    }
    if (variable.exampleValue?.trim()) {
      const hint = guides.exampleValue.examples[0]
      if (hint !== variable.exampleValue.trim()) {
        failures.push(
          `${label}: example helper "${hint}" ≠ exampleValue "${variable.exampleValue}"`,
        )
      }
    }
    if (variable.source?.trim()) {
      const hint = guides.source.examples[0]
      if (hint !== variable.source.trim()) {
        failures.push(`${label}: source helper "${hint}" ≠ source "${variable.source}"`)
      }
    }
  }
}

// Spot-check NIB helpers (regression for reused Misal text)
{
  const umkm = projects.find((p) => p.id === 'demo-umkm-koperasi-2026')
  const nib = umkm?.variables.find((v) => v.name === 'NIB')
  if (!nib) {
    failures.push('UMKM: NIB variable missing')
  } else {
    const g = buildVariableFieldGuides(nib)
    if (/Nama Usaha|Nama resmi usaha/i.test(g.name.examples.join(' '))) {
      failures.push('NIB: name Misal still shows Nama Usaha')
    }
    if (!/Nomor Induk Berusaha/i.test(g.name.examples.join(' '))) {
      failures.push(`NIB: expected Nomor Induk Berusaha in name Misal, got ${g.name.examples[0]}`)
    }
    if (g.exampleValue.examples[0] !== '9120401234567') {
      failures.push(`NIB: example Misal should be 9120401234567, got ${g.exampleValue.examples[0]}`)
    }
  }
}

console.log('Demo projects progress:')
summary.forEach((r) => console.log(`  ${r.pct}% — ${r.name}`))
console.log('Counts:', counts)
console.log('Dashboard stats:', stats)

if (failures.length) {
  console.log('FAIL')
  failures.forEach((f) => console.log('  ✗', f))
  process.exit(1)
}
console.log('Demo QA: PASS')
