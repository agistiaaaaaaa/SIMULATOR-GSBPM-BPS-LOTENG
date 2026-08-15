/**
 * Metadata fields aligned with Materi Proses Bisnis.pdf slides 57–59
 * (Perka BPS 5/2020 — struktur baku MS-Keg, MS-Var, MS-Ind).
 * Field labels follow PDF descriptions; full Perka schema is not reproduced here.
 */

export interface MetadataFieldDef {
  key: string
  label: string
  required: boolean
  hint?: string
  multiline?: boolean
}

export const MS_KEG_FIELDS: MetadataFieldDef[] = [
  {
    key: 'nama_kegiatan',
    label: 'Nama kegiatan statistik',
    required: true,
    hint: 'Contoh: Survei Kepuasan Pelayanan Perizinan DPMPTSP 2026',
  },
  {
    key: 'penyelenggara',
    label: 'Penyelenggara kegiatan',
    required: true,
    hint: 'Contoh: DPMPTSP Kabupaten Lombok Tengah',
  },
  {
    key: 'tahun_kegiatan',
    label: 'Tahun kegiatan',
    required: true,
    hint: 'Contoh: 2026',
  },
  {
    key: 'cakupan_wilayah',
    label: 'Cakupan wilayah',
    required: true,
    hint: 'Contoh: Kabupaten Lombok Tengah',
  },
  {
    key: 'cara_pengumpulan',
    label: 'Cara pengumpulan data',
    required: true,
    hint: 'Survei / Sensus / Kompilasi produk administrasi (kompromin)',
  },
  {
    key: 'tujuan_kegiatan',
    label: 'Tujuan kegiatan',
    required: true,
    multiline: true,
    hint: 'Tuliskan tujuan operasional yang dapat diukur',
  },
  {
    key: 'penanggung_jawab',
    label: 'Penanggung jawab kegiatan',
    required: true,
    hint: 'Nama pejabat / unit penanggung jawab di OPD',
  },
  {
    key: 'periode_pelaksanaan',
    label: 'Periode pelaksanaan',
    required: false,
    hint: 'Contoh: Januari–Desember 2026',
  },
]

export const MS_VAR_FIELDS: MetadataFieldDef[] = [
  {
    key: 'nama_variabel',
    label: 'Nama variabel',
    required: true,
    hint: 'Contoh: Skor persyaratan / NIB / Luas panen',
  },
  {
    key: 'definisi_variabel',
    label: 'Definisi variabel',
    required: true,
    multiline: true,
    hint: 'Definisi operasional yang jelas dan dapat diukur',
  },
  {
    key: 'satuan',
    label: 'Satuan',
    required: false,
    hint: 'Contoh: skor, orang, Rp, ha, ton — kosongkan jika tidak perlu',
  },
  {
    key: 'sumber_informasi',
    label: 'Sumber informasi',
    required: true,
    hint: 'Contoh: Wawancara responden / SIAK / Dapodik / OSS',
  },
  {
    key: 'metode_pengumpulan',
    label: 'Metode pengumpulan',
    required: true,
    hint: 'Contoh: Wawancara langsung / ekstraksi register administratif',
  },
  {
    key: 'referensi_standar',
    label: 'Referensi standar (SDSN / kondef)',
    required: false,
    hint: 'Rujukan Standar Data Statistik Nasional bila ada',
  },
]

export const MS_IND_FIELDS: MetadataFieldDef[] = [
  {
    key: 'nama_indikator',
    label: 'Nama indikator',
    required: true,
    hint: 'Contoh: Indeks Kepuasan Masyarakat (IKM)',
  },
  {
    key: 'definisi_indikator',
    label: 'Definisi indikator',
    required: true,
    multiline: true,
    hint: 'Jelaskan apa yang diukur oleh indikator ini',
  },
  {
    key: 'rumus_perhitungan',
    label: 'Rumus / cara perhitungan',
    required: true,
    multiline: true,
    hint: 'Contoh: Rata-rata skor unsur × 25',
  },
  {
    key: 'variabel_terkait',
    label: 'Variabel terkait',
    required: true,
    hint: 'Daftar nama variabel yang dipakai dalam rumus',
  },
  {
    key: 'satuan_indikator',
    label: 'Satuan indikator',
    required: false,
    hint: 'Contoh: indeks 0–100, %, ton/ha',
  },
]

export function defaultMetadataValues(name: string, jenis: string) {
  return {
    kegiatan: {
      nama_kegiatan: name,
      penyelenggara: '',
      tahun_kegiatan: new Date().getFullYear().toString(),
      cakupan_wilayah: '',
      cara_pengumpulan: jenis,
      tujuan_kegiatan: '',
      penanggung_jawab: '',
      periode_pelaksanaan: '',
    },
    variabel: Object.fromEntries(MS_VAR_FIELDS.map((f) => [f.key, ''])),
    indikator: Object.fromEntries(MS_IND_FIELDS.map((f) => [f.key, ''])),
  }
}

export function metadataSectionComplete(
  section: Record<string, string>,
  fields: MetadataFieldDef[],
): { complete: number; total: number } {
  const required = fields.filter((f) => f.required)
  const complete = required.filter((f) => (section[f.key] ?? '').trim().length > 0).length
  return { complete, total: required.length }
}
