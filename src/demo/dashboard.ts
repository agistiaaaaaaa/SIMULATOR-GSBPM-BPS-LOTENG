import { computeProjectProgress } from '@/domain/gsbpm'
import type { ActivityLogItem, Project } from '@/domain/types'
import { buildDemoActivityLog } from './activity'
import { computeDashboardStatistics, type DashboardStatistics } from './statistics'

export interface DeadlineItem {
  projectId: string
  projectName: string
  label: string
  weekEnd: number
  phaseTitle: string
}

export interface DashboardBundle {
  stats: DashboardStatistics
  activities: ActivityLogItem[]
  deadlines: DeadlineItem[]
  recentlyExported: { projectId: string; name: string; at: string }[]
}

export function buildDeadlines(projects: Project[]): DeadlineItem[] {
  return projects
    .filter((p) => p.status !== 'archived')
    .map((p) => {
      const current = p.timeline.find((t) => t.phaseId === p.currentPhaseId) ?? p.timeline[p.timeline.length - 1]
      return {
        projectId: p.id,
        projectName: p.name,
        label: current?.title ?? 'Tahap berjalan',
        weekEnd: current?.endWeek ?? 16,
        phaseTitle: current?.title ?? p.currentPhaseId,
      }
    })
    .sort((a, b) => a.weekEnd - b.weekEnd)
    .slice(0, 5)
}

export function buildRecentlyExported(projects: Project[]) {
  return projects
    .filter((p) => p.status === 'ready_for_review')
    .map((p) => ({
      projectId: p.id,
      name: p.name,
      at: p.updatedAt,
    }))
    .sort((a, b) => (a.at < b.at ? 1 : -1))
}

export function buildDashboardBundle(projects: Project[]): DashboardBundle {
  return {
    stats: computeDashboardStatistics(projects),
    activities: buildDemoActivityLog(projects),
    deadlines: buildDeadlines(projects),
    recentlyExported: buildRecentlyExported(projects),
  }
}

export function projectProgressRows(projects: Project[]) {
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    ...computeProjectProgress(p.jenisKegiatan, p.klasifikasi, p.checklistState),
  }))
}
