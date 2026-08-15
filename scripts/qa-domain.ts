/**
 * Domain QA scenarios — run: npx tsx scripts/qa-domain.ts
 */
import { canExport, validateProject } from '../src/domain/validation'
import { computeProjectProgress } from '../src/domain/gsbpm'
import { defaultMetadataValues } from '../src/domain/metadataSchema'
import type { Project } from '../src/domain/types'

function baseProject(overrides: Partial<Project> = {}): Project {
  const jenis = overrides.jenisKegiatan ?? 'survei'
  const name = overrides.name ?? 'Survei Kepuasan Pelayanan'
  return {
    id: 'test-1',
    name,
    description: 'Mengukur kepuasan masyarakat terhadap pelayanan publik.',
    topik: 'kepuasan',
    klasifikasi: 'sektoral',
    jenisKegiatan: jenis,
    objectives: [],
    variables: [{ id: 'v1', name: 'Skor', definition: 'Skor kepuasan', type: 'numerik' }],
    indicators: [],
    timeline: [],
    questionnaire: [{ id: 'q1', number: '1', text: 'Pertanyaan', type: 'tertutup' }],
    design: {
      caraPengumpulan: jenis,
      metodePengumpulan: 'wawancara',
      modaPengumpulan: 'capi',
      metodeSampling: 'Stratified',
      ukuranSampel: '100',
    },
    portalSdi: {
      checked: false,
      sirusaChecked: false,
      romantikChecked: false,
      notes: '',
    },
    rekomendasiBps: {
      namaKegiatan: name,
      penyelenggara: 'Dinas X',
      tujuan: 'Mengukur kepuasan',
      periode: '2026',
      catatan: '',
    },
    metadata: defaultMetadataValues(name, jenis),
    checklistState: {},
    currentPhaseId: 'specify_need',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

function fillMetadata(p: Project): Project {
  return {
    ...p,
    metadata: {
      ...p.metadata,
      kegiatan: {
        ...p.metadata.kegiatan,
        penyelenggara: 'Dinas X',
        cakupan_wilayah: 'Lombok Tengah',
        tujuan_kegiatan: 'Mengukur kepuasan',
        penanggung_jawab: 'Kepala Dinas',
      },
    },
  }
}

function fillChecklist(p: Project, pct = 85): Project {
  const progress = computeProjectProgress(p.jenisKegiatan, p.klasifikasi, p.checklistState)
  const target = Math.ceil((progress.total * pct) / 100)
  const state = { ...p.checklistState }
  // Mark items by scanning gsbpm would need import - use brute force known ids
  const ids = [
    'sn-1','sn-2','sn-3','sn-4','sn-5','sn-6','sn-7','sn-8','sn-9','sn-10','sn-11',
    'de-1','de-2','de-3','de-4','de-5','de-6','de-8','de-9','de-10','de-11','de-12','de-13','de-14',
    'bu-1','bu-2','bu-3','bu-4','bu-6','bu-7','bu-8','bu-9','bu-10','bu-11','bu-12','bu-13','bu-14',
    'co-1','co-2','co-3','co-5','co-6','co-7','co-8','co-9',
    'pr-1','pr-3','pr-4','pr-5','pr-6','pr-7','pr-8','pr-9',
    'an-1','an-2','an-4','an-5','an-6',
    'di-1','di-2','di-3',
    'ev-1','ev-2','ev-3',
  ]
  let n = 0
  for (const id of ids) {
    if (n >= target) break
    state[id] = true
    n++
  }
  return { ...p, checklistState: state }
}

const failures: string[] = []
function test(name: string, cond: boolean) {
  if (!cond) failures.push(name)
}

// Scenario 1: Survei — portal blocks export
const s1 = baseProject()
test('S1: export blocked without portal', !canExport(s1))

// Scenario 2: Portal only — still blocked
const s2 = fillMetadata(baseProject({
  portalSdi: { checked: true, sirusaChecked: true, romantikChecked: true, notes: '' },
}))
test('S2: export blocked without checklist', !canExport(s2))

// Scenario 3: Kompromin — no de-8/de-9 required
const s3 = baseProject({ jenisKegiatan: 'kompromin', klasifikasi: 'dasar', questionnaire: [] })
const s3issues = validateProject(s3)
test('S3: kompromin no sampling warning', !s3issues.some((i) => i.code === 'sampling_design'))

// Scenario 4: Sektoral requires rekomendasi
const s4 = fillMetadata(fillChecklist(baseProject({
  portalSdi: { checked: true, sirusaChecked: true, romantikChecked: true, notes: 'ok' },
}), 90))
s4.checklistState['de-12'] = false
test('S4: sektoral blocked without de-12', !canExport(s4))

// Scenario 5: Full sektoral survei export path
const s5 = fillMetadata(fillChecklist(baseProject({
  portalSdi: { checked: true, sirusaChecked: true, romantikChecked: true, notes: 'ok' },
  checklistState: { 'de-12': true },
}), 90))
test('S5: sektoral survei can export when complete', canExport(s5))

// Scenario 6: Portal bypass — sirusa only must fail
const s6 = fillMetadata(fillChecklist(baseProject({
  portalSdi: { checked: true, sirusaChecked: true, romantikChecked: false, notes: '' },
  checklistState: { 'de-12': true },
}), 90))
test('S6: partial portal blocks export', !canExport(s6))

// Scenario 7: Dasar — no rekomendasi error
const s7 = fillMetadata(fillChecklist(baseProject({
  klasifikasi: 'dasar',
  portalSdi: { checked: true, sirusaChecked: true, romantikChecked: true, notes: '' },
}), 90))
test('S7: dasar no rekomendasi error', !validateProject(s7).some((i) => i.code === 'rekomendasi_required'))
test('S7b: dasar can export when complete', canExport(s7))

console.log(failures.length === 0 ? 'Domain QA: PASS' : 'Domain QA: FAIL')
failures.forEach((f) => console.log('  ✗', f))
process.exit(failures.length === 0 ? 0 : 1)
