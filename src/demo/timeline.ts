import type { GsbpmPhaseId, TimelineItem } from '@/domain/types'

let seq = 0
function tid(prefix: string) {
  seq += 1
  return `${prefix}-tl-${seq}`
}

export function buildSurveiTimeline(prefix: string): TimelineItem[] {
  const rows: { title: string; phaseId: GsbpmPhaseId; start: number; end: number }[] = [
    { title: 'Perencanaan & identifikasi kebutuhan', phaseId: 'specify_need', start: 1, end: 3 },
    { title: 'Perancangan metode & instrumen', phaseId: 'design', start: 3, end: 5 },
    { title: 'Persiapan & uji coba instrumen', phaseId: 'build', start: 5, end: 7 },
    { title: 'Pengumpulan data lapangan', phaseId: 'collect', start: 7, end: 11 },
    { title: 'Pengolahan data', phaseId: 'process', start: 11, end: 13 },
    { title: 'Analisis & penyusunan laporan', phaseId: 'analyse', start: 13, end: 15 },
    { title: 'Publikasi & diseminasi', phaseId: 'disseminate', start: 15, end: 16 },
    { title: 'Evaluasi kegiatan', phaseId: 'evaluate', start: 16, end: 17 },
  ]
  return rows.map((r) => ({
    id: tid(prefix),
    title: r.title,
    phaseId: r.phaseId,
    startWeek: r.start,
    endWeek: r.end,
  }))
}

export function buildKomprominTimeline(prefix: string): TimelineItem[] {
  const rows: { title: string; phaseId: GsbpmPhaseId; start: number; end: number }[] = [
    { title: 'Perencanaan & telaah ketersediaan data', phaseId: 'specify_need', start: 1, end: 2 },
    { title: 'Perancangan kompilasi & metadata', phaseId: 'design', start: 2, end: 4 },
    { title: 'Persiapan sistem ekstraksi', phaseId: 'build', start: 4, end: 5 },
    { title: 'Pengambilan data administratif', phaseId: 'collect', start: 5, end: 7 },
    { title: 'Integrasi & validasi', phaseId: 'process', start: 7, end: 9 },
    { title: 'Analisis & tabulasi', phaseId: 'analyse', start: 9, end: 11 },
    { title: 'Publikasi statistik sektoral', phaseId: 'disseminate', start: 11, end: 12 },
    { title: 'Evaluasi proses kompilasi', phaseId: 'evaluate', start: 12, end: 13 },
  ]
  return rows.map((r) => ({
    id: tid(prefix),
    title: r.title,
    phaseId: r.phaseId,
    startWeek: r.start,
    endWeek: r.end,
  }))
}

export function buildSensusTimeline(prefix: string): TimelineItem[] {
  const rows: { title: string; phaseId: GsbpmPhaseId; start: number; end: number }[] = [
    { title: 'Perencanaan & sosialisasi OPD', phaseId: 'specify_need', start: 1, end: 3 },
    { title: 'Perancangan instrumen & SOP', phaseId: 'design', start: 3, end: 5 },
    { title: 'Pelatihan petugas & uji coba', phaseId: 'build', start: 5, end: 7 },
    { title: 'Pendataan lengkap lapangan', phaseId: 'collect', start: 7, end: 14 },
    { title: 'Pengolahan & cleaning', phaseId: 'process', start: 14, end: 16 },
    { title: 'Analisis profil', phaseId: 'analyse', start: 16, end: 18 },
    { title: 'Publikasi hasil', phaseId: 'disseminate', start: 18, end: 19 },
    { title: 'Evaluasi pendataan', phaseId: 'evaluate', start: 19, end: 20 },
  ]
  return rows.map((r) => ({
    id: tid(prefix),
    title: r.title,
    phaseId: r.phaseId,
    startWeek: r.start,
    endWeek: r.end,
  }))
}
