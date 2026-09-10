/**
 * Operational how-to for OPD — display only; does not alter GSBPM/validation rules.
 */
import { canExport, validateProject } from '@/domain/validation'
import type { Project } from '@/domain/types'

export type WorkspaceTabId =
  | 'workflow'
  | 'checklist'
  | 'design'
  | 'variables'
  | 'instruments'
  | 'timeline'
  | 'metadata'
  | 'activity'
  | 'export'

/** Ordered SOP shown on Help page — self-serve without a presenter. */
export const HOW_TO_STEPS: {
  step: number
  title: string
  body: string
  where: string
}[] = [
  {
    step: 1,
    title: 'Buka atau buat proyek',
    body: 'Di Beranda, buka proyek demo atau buat proyek baru. Isi nama, topik, dan deskripsi kebutuhan. Sistem akan menyarankan Survei, Sensus, atau Kompromin beserta alasannya.',
    where: 'Beranda · Proyek baru · Asisten',
  },
  {
    step: 2,
    title: 'Cek portal rujukan statistik',
    body: 'Pada tab Alur kerja, centang bahwa Anda sudah memeriksa sirusa.web.bps.go.id dan romantik.bps.go.id (serta portal SDI bila relevan). Ini wajib sebelum ekspor — untuk mencegah duplikasi kegiatan.',
    where: 'Workspace → Alur kerja → kartu portal',
  },
  {
    step: 3,
    title: 'Kerjakan checklist GSBPM',
    body: 'Centang item wajib di Alur kerja atau tab Checklist. Progres dihitung dari item yang relevan dengan jenis kegiatan Anda. Target minimal 80% untuk bisa mengekspor draf.',
    where: 'Workspace → Alur kerja / Checklist',
  },
  {
    step: 4,
    title: 'Tetapkan perancangan pengumpulan',
    body: 'Di tab Perancangan, pilih cara (Survei/Sensus/Kompromin), metode, dan moda. Untuk survei, isi sampling dan hitung n dengan kalkulator Yamane/Z. Untuk kompromin, fokus pada sumber administratif — bukan kuesioner lapangan. Lihat juga panel Contoh ilustrasi di Alur kerja sesuai topik.',
    where: 'Workspace → Perancangan · Alur kerja (Contoh ilustrasi)',
  },
  {
    step: 5,
    title: 'Susun variabel (dan indikator)',
    body: 'Isi nama, definisi, tipe, skala, sumber, contoh nilai, dan aturan missing untuk setiap variabel. Indikator di bawah daftar variabel menunjukkan rumus yang memakai variabel terkait (contoh demo bersifat ilustratif).',
    where: 'Workspace → Variabel',
  },
  {
    step: 6,
    title: 'Susun instrumen (jika perlu)',
    body: 'Survei/Sensus: tambah pertanyaan yang selaras dengan variabel. Kompromin: tidak ada kuesioner — yang ditampilkan adalah pemetaan variabel ke sumber administrasi.',
    where: 'Workspace → Instrumen',
  },
  {
    step: 7,
    title: 'Tinjau timeline & lengkapi metadata',
    body: 'Timeline menampilkan rencana minggu kerja per fase (contoh perencanaan). Lalu lengkapi MS-Keg, MS-Var, dan MS-Ind pada tab Metadata. Field bertanda * wajib untuk ekspor.',
    where: 'Workspace → Timeline · Metadata',
  },
  {
    step: 8,
    title: 'Sektoral: siapkan rekomendasi ke BPS',
    body: 'Jika klasifikasi sektoral, lengkapi draf rekomendasi di Alur kerja (Design 2.5) dan centang checklist terkait. Ini syarat ekspor untuk kegiatan sektoral.',
    where: 'Workspace → Alur kerja → rekomendasi BPS',
  },
  {
    step: 9,
    title: 'Ekspor draf Word',
    body: 'Buka tab Ekspor. Jika ada persyaratan merah, klik item tersebut untuk loncat ke tab yang perlu dilengkapi. Setelah lolos, unduh .docx. File berstatus draf — validasi akhir bersama BPS.',
    where: 'Workspace → Ekspor',
  },
]

export interface NextStepItem {
  id: string
  title: string
  detail: string
  tab: WorkspaceTabId
  priority: 'wajib' | 'disarankan' | 'selesai'
}

/**
 * Next actions derived from current validation — same rules as export gate.
 */
export function getProjectNextSteps(project: Project): NextStepItem[] {
  const issues = validateProject(project)
  const errors = issues.filter((i) => i.severity === 'error')
  const warnings = issues.filter((i) => i.severity === 'warning')

  if (canExport(project) && errors.length === 0) {
    const steps: NextStepItem[] = [
      {
        id: 'export-ready',
        title: 'Unduh draf perencanaan',
        detail:
          'Persyaratan wajib sudah terpenuhi. Buka tab Ekspor lalu unduh file Word (.docx). Dokumen tetap berstatus draf.',
        tab: 'export',
        priority: 'selesai',
      },
    ]
    for (const w of warnings.slice(0, 2)) {
      steps.push({
        id: w.code,
        title: 'Perbaikan disarankan',
        detail: w.message,
        tab: (w.tab as WorkspaceTabId) || 'export',
        priority: 'disarankan',
      })
    }
    return steps
  }

  const fromErrors: NextStepItem[] = errors.map((e) => ({
    id: e.code,
    title: 'Wajib dilengkapi',
    detail: e.message,
    tab: (e.tab as WorkspaceTabId) || 'workflow',
    priority: 'wajib' as const,
  }))

  const fromWarnings: NextStepItem[] = warnings.slice(0, 3).map((w) => ({
    id: w.code,
    title: 'Disarankan',
    detail: w.message,
    tab: (w.tab as WorkspaceTabId) || 'workflow',
    priority: 'disarankan' as const,
  }))

  const combined = [...fromErrors, ...fromWarnings]
  if (combined.length > 0) return combined.slice(0, 5)

  return [
    {
      id: 'start-portal',
      title: 'Mulai dari portal rujukan',
      detail:
        'Buka tab Alur kerja, centang pemeriksaan Sirusa dan Romantik, lalu lanjutkan checklist fase.',
      tab: 'workflow',
      priority: 'wajib',
    },
  ]
}

/** Short intro copy under each workspace tab title. */
export const TAB_GUIDES: Record<
  WorkspaceTabId,
  { title: string; body: string }
> = {
  workflow: {
    title: 'Cara kerja tab ini',
    body: 'Pilih fase GSBPM di kiri, kerjakan checklist subproses, centang portal rujukan, dan (jika sektoral) isi draf rekomendasi ke BPS. Ini tab utama untuk kemajuan proyek.',
  },
  checklist: {
    title: 'Cara kerja tab ini',
    body: 'Semua item wajib digabung per fase. Centang yang sudah selesai. Item yang tidak relevan dengan jenis kegiatan Anda tidak ditampilkan. Target ekspor: minimal 80%.',
  },
  design: {
    title: 'Cara kerja tab ini',
    body: 'Tetapkan cara, metode, dan moda pengumpulan. Survei: isi sampling dan gunakan kalkulator Yamane/Z. Kompromin: fokus sumber administratif. Mengubah cara pengumpulan menyesuaikan jenis kegiatan dan checklist.',
  },
  variables: {
    title: 'Cara kerja tab ini',
    body: 'Setiap variabel wajib punya nama dan definisi. Lengkapi tipe, skala, sumber, contoh, dan aturan missing. Indikator di bawah bersifat ringkasan rumus (pada demo sering sudah terisi).',
  },
  instruments: {
    title: 'Cara kerja tab ini',
    body: 'Survei/Sensus: susun pertanyaan yang selaras variabel. Kompromin: tidak ada kuesioner — dokumentasikan pemetaan variabel ke sumber data administrasi.',
  },
  timeline: {
    title: 'Cara kerja tab ini',
    body: 'Tampilan rencana waktu per fase (minggu ke-berapa). Pada versi demo ini bersifat ilustratif untuk perencanaan — tidak mengubah validasi ekspor.',
  },
  metadata: {
    title: 'Cara kerja tab ini',
    body: 'Lengkapi MS-Keg (wajib ekspor), lalu MS-Var dan MS-Ind. Field bertanda * harus terisi. Ini draf arah Perka BPS 5/2020 — bukan katalog Perka penuh.',
  },
  activity: {
    title: 'Cara kerja tab ini',
    body: 'StatPlan menyimpan waktu pembuatan dan perubahan terakhir di perangkat ini — bukan log setiap aktivitas. Tidak perlu diisi manual dan tidak memengaruhi ekspor.',
  },
  export: {
    title: 'Cara kerja tab ini',
    body: 'Lihat daftar persyaratan. Perbaiki yang berwarna error, lalu unduh draf Word. File diproses di perangkat Anda dan tetap perlu validasi BPS.',
  },
}
