import { computeProjectProgress } from '@/domain/gsbpm'
import type { Project } from '@/domain/types'

export interface DashboardStatistics {
  total: number
  draft: number
  inProgress: number
  readyForReview: number
  archived: number
  survei: number
  sensus: number
  kompromin: number
  needRecommendation: number
  averageCompletion: number
  exportReadyApprox: number
}

/**
 * Aggregate dashboard statistics from the current project list.
 * Pure function — does not alter GSBPM or business rules.
 */
export function computeDashboardStatistics(projects: Project[]): DashboardStatistics {
  const total = projects.length
  let draft = 0
  let inProgress = 0
  let readyForReview = 0
  let archived = 0
  let survei = 0
  let sensus = 0
  let kompromin = 0
  let needRecommendation = 0
  let pctSum = 0
  let exportReadyApprox = 0

  for (const p of projects) {
    if (p.status === 'draft') draft += 1
    else if (p.status === 'in_progress') inProgress += 1
    else if (p.status === 'ready_for_review') readyForReview += 1
    else if (p.status === 'archived') archived += 1

    if (p.jenisKegiatan === 'survei') survei += 1
    else if (p.jenisKegiatan === 'sensus') sensus += 1
    else kompromin += 1

    if (p.klasifikasi === 'sektoral' && !p.checklistState['de-12']) {
      needRecommendation += 1
    }

    const progress = computeProjectProgress(
      p.jenisKegiatan,
      p.klasifikasi,
      p.checklistState,
    )
    pctSum += progress.pct
    if (progress.pct >= 80 && p.portalSdi.sirusaChecked && p.portalSdi.romantikChecked) {
      exportReadyApprox += 1
    }
  }

  return {
    total,
    draft,
    inProgress,
    readyForReview,
    archived,
    survei,
    sensus,
    kompromin,
    needRecommendation,
    averageCompletion: total === 0 ? 0 : Math.round(pctSum / total),
    exportReadyApprox,
  }
}
