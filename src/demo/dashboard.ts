import { computeProjectProgress, GSBPM_PHASES } from '@/domain/gsbpm'
import type { Project } from '@/domain/types'
import {
  computeDashboardStatistics,
  isProjectReadyForReview,
  type DashboardStatistics,
} from './statistics'

const RECENT_LIMIT = 7
const PLANNING_LIMIT = 5

export interface RecentProjectItem {
  projectId: string
  projectName: string
  updatedAt: string
}

export interface PlanningWeekItem {
  projectId: string
  projectName: string
  phaseTitle: string
  planTitle: string
  startWeek: number
  endWeek: number
  updatedAt: string
  href: string
}

export interface DashboardBundle {
  stats: DashboardStatistics
  recentlyUpdated: RecentProjectItem[]
  planningWeeks: PlanningWeekItem[]
  readyForReviewProjects: { projectId: string; name: string; updatedAt: string }[]
}

function hasValidTimestamp(iso: string | undefined): boolean {
  if (!iso) return false
  return Number.isFinite(Date.parse(iso))
}

function asPositiveWeek(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null
  return value
}

function gsbpmPhaseTitle(phaseId: string): string | null {
  const phase = GSBPM_PHASES.find((item) => item.id === phaseId)
  return phase?.titleId ?? null
}

export function planningWeekLabel(startWeek: number, endWeek: number): string {
  if (startWeek === endWeek) return `Rencana minggu ke-${startWeek}`
  return `Rencana minggu ke-${startWeek}–${endWeek}`
}

export function buildRecentlyUpdatedProjects(
  projects: Project[],
  limit = RECENT_LIMIT,
): RecentProjectItem[] {
  return [...projects]
    .filter((project) => project.status !== 'archived' && hasValidTimestamp(project.updatedAt))
    .sort((a, b) => {
      if (a.updatedAt !== b.updatedAt) return a.updatedAt < b.updatedAt ? 1 : -1
      return a.id.localeCompare(b.id)
    })
    .slice(0, limit)
    .map((project) => ({
      projectId: project.id,
      projectName: project.name,
      updatedAt: project.updatedAt,
    }))
}

export function buildPlanningWeeks(
  projects: Project[],
  limit = PLANNING_LIMIT,
): PlanningWeekItem[] {
  const items: PlanningWeekItem[] = []

  for (const project of projects) {
    if (project.status === 'archived') continue
    if (isProjectReadyForReview(project)) continue
    if (!Array.isArray(project.timeline) || project.timeline.length === 0) continue
    if (!project.currentPhaseId) continue

    const current = project.timeline.find(
      (entry) => entry && entry.phaseId === project.currentPhaseId,
    )
    if (!current) continue

    const startWeek = asPositiveWeek(current.startWeek)
    const endWeek = asPositiveWeek(current.endWeek)
    if (startWeek === null || endWeek === null) continue

    const phaseTitle = gsbpmPhaseTitle(current.phaseId)
    if (!phaseTitle) continue

    items.push({
      projectId: project.id,
      projectName: project.name,
      phaseTitle,
      planTitle: current.title,
      startWeek,
      endWeek,
      updatedAt: hasValidTimestamp(project.updatedAt) ? project.updatedAt : '',
      href: `/app/projects/${project.id}?tab=timeline`,
    })
  }

  return items
    .sort((a, b) => {
      if (a.endWeek !== b.endWeek) return a.endWeek - b.endWeek
      if (a.updatedAt !== b.updatedAt) return a.updatedAt < b.updatedAt ? 1 : -1
      return a.projectId.localeCompare(b.projectId)
    })
    .slice(0, limit)
}

export function buildReadyForReviewProjects(projects: Project[]) {
  return projects
    .filter(isProjectReadyForReview)
    .map((p) => ({
      projectId: p.id,
      name: p.name,
      updatedAt: p.updatedAt,
    }))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export function buildDashboardBundle(projects: Project[]): DashboardBundle {
  return {
    stats: computeDashboardStatistics(projects),
    recentlyUpdated: buildRecentlyUpdatedProjects(projects),
    planningWeeks: buildPlanningWeeks(projects),
    readyForReviewProjects: buildReadyForReviewProjects(projects),
  }
}

export function projectProgressRows(projects: Project[]) {
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    ...computeProjectProgress(p.jenisKegiatan, p.klasifikasi, p.checklistState),
  }))
}
