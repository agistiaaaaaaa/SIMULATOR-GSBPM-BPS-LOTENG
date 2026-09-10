import { computeProjectProgress } from '@/domain/gsbpm'
import { canExport, requiresRekomendasiBps } from '@/domain/validation'
import type { Project } from '@/domain/types'

export interface DashboardStatistics {
  total: number
  draft: number
  inProgress: number
  readyForReview: number
  needsCompletion: number
  archived: number
  survei: number
  sensus: number
  kompromin: number
  recommendationPreparationPending: number
  averageCompletion: number
  exportReady: number
}

/** Stored review status still matches current export eligibility. */
export function isProjectReadyForReview(project: Project): boolean {
  return project.status === 'ready_for_review' && canExport(project)
}

/** Stored review status is stale because export is currently blocked. */
export function isReviewStatusStale(project: Project): boolean {
  return project.status === 'ready_for_review' && !canExport(project)
}

export function isRecommendationPreparationPending(project: Project): boolean {
  return requiresRekomendasiBps(project) && !project.checklistState['de-12']
}

/**
 * Aggregate dashboard statistics from the current project list.
 * Progress comes from computeProjectProgress; export readiness from canExport.
 */
export function computeDashboardStatistics(projects: Project[]): DashboardStatistics {
  const total = projects.length
  let draft = 0
  let inProgress = 0
  let readyForReview = 0
  let needsCompletion = 0
  let archived = 0
  let survei = 0
  let sensus = 0
  let kompromin = 0
  let recommendationPreparationPending = 0
  let pctSum = 0
  let exportReady = 0

  for (const p of projects) {
    if (p.status === 'draft') draft += 1
    else if (p.status === 'in_progress') inProgress += 1
    else if (p.status === 'ready_for_review') {
      if (canExport(p)) readyForReview += 1
      else needsCompletion += 1
    } else if (p.status === 'archived') archived += 1

    if (p.jenisKegiatan === 'survei') survei += 1
    else if (p.jenisKegiatan === 'sensus') sensus += 1
    else if (p.jenisKegiatan === 'kompromin') kompromin += 1

    if (isRecommendationPreparationPending(p)) {
      recommendationPreparationPending += 1
    }

    const progress = computeProjectProgress(
      p.jenisKegiatan,
      p.klasifikasi,
      p.checklistState,
    )
    pctSum += progress.pct
    if (canExport(p)) exportReady += 1
  }

  return {
    total,
    draft,
    inProgress,
    readyForReview,
    needsCompletion,
    archived,
    survei,
    sensus,
    kompromin,
    recommendationPreparationPending,
    averageCompletion: total === 0 ? 0 : Math.round(pctSum / total),
    exportReady,
  }
}
