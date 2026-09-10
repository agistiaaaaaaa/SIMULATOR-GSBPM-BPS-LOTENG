import type { Project } from '@/domain/types'
import { canExport } from '@/domain/validation'
import { computeProjectProgress } from '@/domain/gsbpm'
import { jenisLabel, statusLabel } from '@/lib/utils'

export type SearchHitKind = 'project' | 'variable' | 'metadata' | 'questionnaire'

export interface SearchHit {
  id: string
  kind: SearchHitKind
  title: string
  subtitle: string
  projectId: string
  projectName: string
  href: string
}

export function searchWorkspace(projects: Project[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []

  const hits: SearchHit[] = []

  for (const p of projects) {
    const blob = [p.name, p.description, p.topik, p.rekomendasiBps.penyelenggara]
      .join(' ')
      .toLowerCase()
    if (blob.includes(q)) {
      hits.push({
        id: `p-${p.id}`,
        kind: 'project',
        title: p.name,
        subtitle: `${jenisLabel(p.jenisKegiatan)} · ${statusLabel(p.status)}`,
        projectId: p.id,
        projectName: p.name,
        href: `/app/projects/${p.id}`,
      })
    }

    for (const v of p.variables) {
      const t = `${v.name} ${v.definition} ${v.source ?? ''}`.toLowerCase()
      if (t.includes(q)) {
        hits.push({
          id: `v-${p.id}-${v.id}`,
          kind: 'variable',
          title: v.name,
          subtitle: v.definition,
          projectId: p.id,
          projectName: p.name,
          href: `/app/projects/${p.id}?tab=variables`,
        })
      }
    }

    const metaEntries = [
      ...Object.entries(p.metadata.kegiatan).map(([k, val]) => ['MS-Keg', k, val] as const),
      ...Object.entries(p.metadata.variabel).map(([k, val]) => ['MS-Var', k, val] as const),
      ...Object.entries(p.metadata.indikator).map(([k, val]) => ['MS-Ind', k, val] as const),
    ]
    for (const [section, key, val] of metaEntries) {
      if (val.toLowerCase().includes(q) || key.toLowerCase().includes(q)) {
        hits.push({
          id: `m-${p.id}-${section}-${key}`,
          kind: 'metadata',
          title: `${section}: ${key.replaceAll('_', ' ')}`,
          subtitle: val.slice(0, 120),
          projectId: p.id,
          projectName: p.name,
          href: `/app/projects/${p.id}?tab=metadata`,
        })
      }
    }

    for (const item of p.questionnaire) {
      const t = `${item.number} ${item.text}`.toLowerCase()
      if (t.includes(q)) {
        hits.push({
          id: `q-${p.id}-${item.id}`,
          kind: 'questionnaire',
          title: `P${item.number}. ${item.text.slice(0, 80)}`,
          subtitle: item.type,
          projectId: p.id,
          projectName: p.name,
          href: `/app/projects/${p.id}?tab=instruments`,
        })
      }
    }
  }

  return hits.slice(0, 40)
}

export function projectOwner(project: Project) {
  return (
    project.rekomendasiBps.penyelenggara ||
    project.metadata.kegiatan.penanggung_jawab ||
    project.metadata.kegiatan.penyelenggara ||
    'OPD penyelenggara'
  )
}

export function projectOpd(project: Project) {
  return (
    project.metadata.kegiatan.penyelenggara ||
    project.rekomendasiBps.penyelenggara ||
    'OPD Kabupaten Lombok Tengah'
  )
}

export function klasifikasiLabel(k: string) {
  switch (k) {
    case 'dasar':
      return 'Statistik dasar'
    case 'sektoral':
      return 'Statistik sektoral'
    case 'khusus':
      return 'Statistik khusus'
    default:
      return k
  }
}

export function exportStatusLabel(project: Project) {
  if (canExport(project)) {
    return 'Siap diekspor'
  }
  const pct = computeProjectProgress(
    project.jenisKegiatan,
    project.klasifikasi,
    project.checklistState,
  ).pct
  if (!project.portalSdi.sirusaChecked || !project.portalSdi.romantikChecked) {
    return 'Belum siap diekspor · portal belum lengkap'
  }
  if (pct < 80) return `Belum siap diekspor · checklist ${pct}% (min. 80%)`
  return 'Belum siap diekspor'
}

export function methodLabel(project: Project) {
  const cara = project.design.caraPengumpulan || project.jenisKegiatan
  const moda = project.design.modaPengumpulan
  if (cara === 'kompromin') return 'Kompilasi produk administrasi'
  if (moda) return `${jenisLabel(cara)} · ${moda.toUpperCase()}`
  return jenisLabel(cara)
}
