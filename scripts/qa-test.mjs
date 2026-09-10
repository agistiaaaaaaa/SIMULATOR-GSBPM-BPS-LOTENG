/**
 * Domain QA harness — run: node scripts/qa-test.mjs
 */
import { readFileSync } from 'fs'
import { pathToFileURL } from 'url'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Build won't output domain as ESM; inline critical checks via dynamic import from ts not available.
// We duplicate minimal test data and import from dist if built, else run logic checks manually.

const failures = []
function assert(cond, msg) {
  if (!cond) failures.push(msg)
}

// --- Static file checks ---
const gsbpm = readFileSync(join(root, 'src/domain/gsbpm.ts'), 'utf8')
assert(gsbpm.includes("id: '3.6'") && gsbpm.includes("id: '3.7'"), 'Build 3.6/3.7 must be split')
assert(gsbpm.includes("id: '5.6'") && gsbpm.includes("id: '5.7'") && gsbpm.includes("id: '5.8'"), 'Process 5.6-5.8 must be split')
assert(gsbpm.includes("klasifikasi: ['sektoral']"), 'de-12 must filter by sektoral')
assert(!gsbpm.includes("id: 'de-7'"), 'de-7 dummy table at design must be removed')

const validation = readFileSync(join(root, 'src/domain/validation.ts'), 'utf8')
assert(validation.includes('MIN_CHECKLIST_PCT = 80'), '80% export gate expected')

const dashboard = readFileSync(join(root, 'src/features/dashboard/DashboardPage.tsx'), 'utf8')
assert(
  dashboard.includes('buildAttentionItems') && dashboard.includes('sortProjectsForDashboard'),
  'Dashboard must use validation-backed attention helpers',
)
assert(
  !dashboard.includes("Rekomendasi BPS belum dicentang (Design 2.5)"),
  'Dashboard must not keep heuristic rekomendasi attention copy',
)
assert(
  !dashboard.includes('Tidak ada isu kritis pada proyek aktif.'),
  'Dashboard empty attention copy must not overclaim completion',
)

const attentionHelper = readFileSync(join(root, 'src/lib/projectAttention.ts'), 'utf8')
assert(
  attentionHelper.includes('validateProject(project)') &&
    attentionHelper.includes("status === 'archived'"),
  'Attention helper must read validateProject and skip archived projects',
)

assert(
  !dashboard.includes('Aktivitas terbaru') &&
    !dashboard.includes('Tugas & tenggat') &&
    !dashboard.includes('relativeDayLabel') &&
    !dashboard.includes('Kemarin'),
  'Dashboard must not present synthetic activity or relative fake timestamps',
)
assert(
  !dashboard.includes('Ringkasan operasional') && !dashboard.includes('Aksi cepat'),
  'Dashboard must not use operational-system eyebrow or duplicate quick-action grid',
)
assert(
  dashboard.includes('Proyek yang baru diperbarui') &&
    dashboard.includes('Rencana minggu GSBPM') &&
    dashboard.includes('Belum ada rencana waktu pada proyek aktif.'),
  'Dashboard must use truthful updatedAt and relative-week sections',
)

const dashboardHelper = readFileSync(join(root, 'src/demo/dashboard.ts'), 'utf8')
assert(
  !dashboardHelper.includes('buildDemoActivityLog') &&
    !dashboardHelper.includes('?? 16') &&
    !dashboardHelper.includes('Tahap berjalan'),
  'Dashboard helper must not generate synthetic activity or week-16 deadline fallbacks',
)
assert(
  dashboardHelper.includes('buildRecentlyUpdatedProjects') &&
    dashboardHelper.includes('buildPlanningWeeks'),
  'Dashboard helper must derive recent projects and planning weeks from persisted state',
)

const workspace = readFileSync(join(root, 'src/features/workspace/ProjectWorkspacePage.tsx'), 'utf8')
assert(!workspace.includes('sampleSize'), 'Yamane sample must be removed')
assert(!workspace.includes("'risks'"), 'Risks tab must be removed')

const landing = readFileSync(join(root, 'src/features/landing/LandingPage.tsx'), 'utf8')
if (/<Link[^>]*>[\s\S]*?<Button/.test(landing)) {
  failures.push('LandingPage: nested interactive elements (Link wrapping Button) — invalid HTML/a11y')
}

const css = readFileSync(join(root, 'src/index.css'), 'utf8')
if (workspace.includes('brand-soft') && !css.includes('brand-soft') && !css.includes('--color-brand-soft')) {
  failures.push('Workspace uses brand-soft/gold-soft but tokens not defined in index.css')
}

// --- GSBPM sub-process code uniqueness ---
const codes = [...gsbpm.matchAll(/code: '(\d+\.\d+)'/g)].map((m) => m[1])
const dupCodes = codes.filter((c, i) => codes.indexOf(c) !== i)
assert(dupCodes.length === 0, `Duplicate sub-process codes: ${dupCodes.join(', ')}`)

// --- Checklist id uniqueness ---
const checklistIds = [...gsbpm.matchAll(/id: '([a-z]+-\d+[a-z]*)'/g)].map((m) => m[1])
const dupIds = checklistIds.filter((id, i) => checklistIds.indexOf(id) !== i)
assert(dupIds.length === 0, `Duplicate checklist ids: ${dupIds.join(', ')}`)

console.log('QA static checks:', failures.length === 0 ? 'PASS' : 'FAIL')
failures.forEach((f) => console.log('  ✗', f))
process.exit(failures.length === 0 ? 0 : 1)
