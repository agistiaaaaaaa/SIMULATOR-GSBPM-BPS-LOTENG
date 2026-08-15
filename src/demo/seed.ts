import { computeProjectProgress } from '@/domain/gsbpm'
import type { Project } from '@/domain/types'
import { buildDemoActivityLog } from './activity'
import { buildDashboardBundle } from './dashboard'
import { buildDemoProjects } from './projects'

export const DEMO_SEED_VERSION = 4
export const DEMO_FLAG_KEY = 'bps-statplan-demo-flag'
export const ONBOARDING_KEY = 'bps-statplan-onboarding-done'

export interface DemoDatabase {
  version: number
  seededAt: string
  locale: 'id-ID'
  organization: string
  projects: Project[]
  /** PostgreSQL-ready conceptual schema note (documentation only) */
  schemaHint: {
    tables: string[]
  }
}

export function createDemoDatabase(): DemoDatabase {
  const projects = buildDemoProjects()
  return {
    version: DEMO_SEED_VERSION,
    seededAt: new Date().toISOString(),
    locale: 'id-ID',
    organization: 'BPS Kabupaten Lombok Tengah — StatPlan Demo',
    projects,
    schemaHint: {
      tables: [
        'projects',
        'variables',
        'indicators',
        'questionnaire_items',
        'timeline_items',
        'metadata_sections',
        'checklist_states',
        'activity_logs',
      ],
    },
  }
}

export function getDemoProjects(): Project[] {
  return createDemoDatabase().projects
}

export function getDemoRecordCounts(projects: Project[] = getDemoProjects()) {
  const variables = projects.reduce((n, p) => n + p.variables.length, 0)
  const indicators = projects.reduce((n, p) => n + p.indicators.length, 0)
  const questions = projects.reduce((n, p) => n + p.questionnaire.length, 0)
  const timelineItems = projects.reduce((n, p) => n + p.timeline.length, 0)
  const activities = buildDemoActivityLog(projects).length
  return {
    projects: projects.length,
    variables,
    indicators,
    questionnaireItems: questions,
    timelineItems,
    activities,
  }
}

export function exportDemoJson(projects: Project[]): string {
  const db = createDemoDatabase()
  db.projects = projects.length ? projects : db.projects
  db.seededAt = new Date().toISOString()
  return JSON.stringify(db, null, 2)
}

export function importDemoJson(raw: string): Project[] {
  const parsed = JSON.parse(raw) as { projects?: Project[] }
  if (!parsed.projects || !Array.isArray(parsed.projects) || parsed.projects.length === 0) {
    throw new Error('Berkas demo tidak valid: tidak ada proyek.')
  }
  return parsed.projects
}

export function isDemoSeeded(): boolean {
  try {
    return localStorage.getItem(DEMO_FLAG_KEY) === String(DEMO_SEED_VERSION)
  } catch {
    return false
  }
}

export function markDemoSeeded() {
  try {
    localStorage.setItem(DEMO_FLAG_KEY, String(DEMO_SEED_VERSION))
  } catch {
    /* ignore */
  }
}

export function markDemoCleared() {
  try {
    localStorage.setItem(DEMO_FLAG_KEY, 'cleared')
  } catch {
    /* ignore */
  }
}

export function clearDemoFlag() {
  try {
    localStorage.removeItem(DEMO_FLAG_KEY)
  } catch {
    /* ignore */
  }
}

export function shouldAutoSeed(): boolean {
  try {
    return localStorage.getItem(DEMO_FLAG_KEY) === null
  } catch {
    return true
  }
}

/** True when demo projects should be refreshed to the latest seed content. */
export function shouldRefreshDemoSeed(): boolean {
  try {
    const flag = localStorage.getItem(DEMO_FLAG_KEY)
    if (flag === null || flag === 'cleared') return false
    return flag !== String(DEMO_SEED_VERSION)
  } catch {
    return false
  }
}

export function isOnboardingDone(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === '1'
  } catch {
    return false
  }
}

export function markOnboardingDone() {
  try {
    localStorage.setItem(ONBOARDING_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function resetOnboarding() {
  try {
    localStorage.removeItem(ONBOARDING_KEY)
  } catch {
    /* ignore */
  }
}

export function summarizeProgress(projects: Project[]) {
  return projects.map((p) => {
    const progress = computeProjectProgress(
      p.jenisKegiatan,
      p.klasifikasi,
      p.checklistState,
    )
    return {
      id: p.id,
      name: p.name,
      jenis: p.jenisKegiatan,
      status: p.status,
      pct: progress.pct,
      done: progress.done,
      total: progress.total,
    }
  })
}

export { buildDashboardBundle }
