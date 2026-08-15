import {
  GSBPM_PHASES,
  isChecklistVisible,
  isSubProcessVisible,
} from '@/domain/gsbpm'
import type { JenisKegiatan, Klasifikasi } from '@/domain/types'

/** Collect required checklist item ids visible for a given activity type. */
export function getRequiredChecklistIds(
  jenis: JenisKegiatan,
  klasifikasi: Klasifikasi,
): string[] {
  const ids: string[] = []
  for (const phase of GSBPM_PHASES) {
    for (const sp of phase.subProcesses) {
      if (!isSubProcessVisible(sp.skipWhen, jenis)) continue
      for (const item of sp.checklist) {
        if (!isChecklistVisible(item, jenis, klasifikasi)) continue
        if (!item.required) continue
        ids.push(item.id)
      }
    }
  }
  return ids
}

/**
 * Build checklist state targeting an approximate completion percentage.
 * Marks items in GSBPM order (early phases first) for a realistic progression.
 */
export function buildChecklistAtPct(
  jenis: JenisKegiatan,
  klasifikasi: Klasifikasi,
  targetPct: number,
  extras: string[] = [],
): Record<string, boolean> {
  const ids = getRequiredChecklistIds(jenis, klasifikasi)
  const target = Math.min(
    ids.length,
    Math.max(0, Math.round((ids.length * Math.min(100, Math.max(0, targetPct))) / 100)),
  )
  const state: Record<string, boolean> = {}
  ids.forEach((id, i) => {
    state[id] = i < target
  })
  for (const id of extras) {
    state[id] = true
  }
  return state
}
