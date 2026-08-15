import type { ActivityLogItem, Project } from '@/domain/types'

/** Realistic activity history for demonstration (client-side seed). */
export function buildDemoActivityLog(projects: Project[]): ActivityLogItem[] {
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
  const daysAgo = (d: number, hour = 9) => {
    const x = new Date()
    x.setDate(x.getDate() - d)
    x.setHours(hour, 15 + (d % 3) * 7, 0, 0)
    return x.toISOString()
  }

  const rows: Omit<ActivityLogItem, 'id'>[] = [
    {
      projectId: 'demo-skm-dpmptsp-2026',
      action: 'Ekspor dokumen',
      detail: 'Draf perencanaan .docx dihasilkan untuk tinjauan BPS',
      at: daysAgo(0, 14),
      actor: 'DPMPTSP Loteng',
    },
    {
      projectId: 'demo-dukcapil-kompromin-2026',
      action: 'Metadata diperbarui',
      detail: 'MS-Keg dan MS-Var dilengkapi (cakupan wilayah & sumber SIAK)',
      at: daysAgo(0, 11),
      actor: 'Disdukcapil Loteng',
    },
    {
      projectId: 'demo-sarana-pendidikan-2026',
      action: 'Checklist diselesaikan',
      detail: 'Fase Analyse mencapai 85% item wajib',
      at: daysAgo(0, 9),
      actor: 'Dinas Pendidikan Loteng',
    },
    {
      projectId: 'demo-umkm-koperasi-2026',
      action: 'Kuesioner dilengkapi',
      detail: '12 butir instrumen pendataan UMKM difinalisasi',
      at: daysAgo(1, 16),
      actor: 'Dinas Koperasi & UKM',
    },
    {
      projectId: 'demo-padi-pertanian-2026',
      action: 'Rekomendasi BPS',
      detail: 'Pengajuan rekomendasi kegiatan statistik ditandai selesai',
      at: daysAgo(1, 10),
      actor: 'Dinas Pertanian Loteng',
    },
    {
      projectId: 'demo-skm-dpmptsp-2026',
      action: 'Portal SDI dicek',
      detail: 'Konfirmasi sirusa & romantik — tidak ada duplikasi kegiatan 2026',
      at: daysAgo(2, 13),
      actor: 'DPMPTSP Loteng',
    },
    {
      projectId: 'demo-umkm-koperasi-2026',
      action: 'Proyek dibuat',
      detail: 'Pendataan lengkap UMKM disiapkan sebagai sensus sektoral',
      at: daysAgo(3, 8),
      actor: 'Dinas Koperasi & UKM',
    },
    {
      projectId: 'demo-padi-pertanian-2026',
      action: 'Publikasi disiapkan',
      detail: 'Output statistik produksi padi siap tahap evaluasi',
      at: daysAgo(3, 15),
      actor: 'Dinas Pertanian Loteng',
    },
  ]

  return rows.map((r, i) => ({
    id: `act-${i + 1}`,
    ...r,
    projectName: r.projectId ? byId[r.projectId]?.name : undefined,
  }))
}
