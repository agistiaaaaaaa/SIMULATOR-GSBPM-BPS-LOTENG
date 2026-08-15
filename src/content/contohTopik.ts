/**
 * Topic illustration library — Demo Example for OPD planning aid.
 * Keyword matching (non-AI). Expands each GSBPM activity in the active phase.
 * Not official BPS standard content.
 */
import { getPhase } from '@/domain/gsbpm'
import type { GsbpmPhaseId, JenisKegiatan } from '@/domain/types'

export type TopikKategori =
  | 'umkm'
  | 'kependudukan'
  | 'pendidikan'
  | 'kesehatan'
  | 'pertanian'
  | 'pelayanan'
  | 'umum'

export interface ContohAktivitas {
  label: string
  contoh: string
}

export interface ContohFase {
  phaseId: GsbpmPhaseId
  ringkas: string
  aktivitas: ContohAktivitas[]
  outputContoh?: string
}

export interface ContohTopik {
  kategori: TopikKategori
  label: string
  keywords: string[]
  fase: ContohFase[]
}

function f(
  phaseId: GsbpmPhaseId,
  ringkas: string,
  aktivitas: ContohAktivitas[],
  outputContoh?: string,
): ContohFase {
  return { phaseId, ringkas, aktivitas, outputContoh }
}

const umum: ContohTopik = {
  kategori: 'umum',
  label: 'Umum / lintas sektor',
  keywords: [],
  fase: [
    f(
      'specify_need',
      'Rumuskan masalah kebijakan dan indikator yang dibutuhkan.',
      [
        {
          label: 'Identifikasi kebutuhan',
          contoh: 'OPD butuh indikator X untuk evaluasi program tahun berjalan.',
        },
        {
          label: 'Konsultasi stakeholder',
          contoh: 'Rapat dengan unit teknis + BPS untuk konfirmasi output & jadwal.',
        },
        {
          label: 'Cek portal rujukan',
          contoh: 'Periksa Sirusa/Romantik/SDI sebelum merancang pengumpulan baru.',
        },
      ],
      'Daftar kebutuhan data prioritas',
    ),
    f(
      'design',
      'Rancang variabel, cara pengumpulan, dan (jika survei) sampel.',
      [
        {
          label: 'Variabel',
          contoh: 'Susun nama + definisi operasional + satuan tiap variabel.',
        },
        {
          label: 'Cara pengumpulan',
          contoh: 'Pilih Survei / Sensus / Kompromin sesuai ketersediaan data.',
        },
        {
          label: 'Sampling',
          contoh: 'Untuk survei: tentukan kerangka & hitung n (kalkulator Yamane di Perancangan).',
        },
      ],
      'Dokumen desain + daftar variabel',
    ),
    f(
      'build',
      'Bangun instrumen atau pemetaan sumber administratif.',
      [
        {
          label: 'Instrumen',
          contoh: 'Survei/Sensus: draft kuesioner. Kompromin: pemetaan field register.',
        },
        {
          label: 'Uji coba',
          contoh: 'Uji keterbacaan pertanyaan pada 5–10 responden uji.',
        },
      ],
      'Instrumen siap uji / siap pakai',
    ),
    f(
      'collect',
      'Kumpulkan data sesuai moda yang dipilih.',
      [
        {
          label: 'Pengumpulan',
          contoh: 'Jadwalkan petugas, pantau response rate, dokumentasikan kendala lapangan.',
        },
      ],
      'Dataset mentah',
    ),
    f(
      'process',
      'Bersihkan, kode, dan validasi data.',
      [
        {
          label: 'Editing/coding',
          contoh: 'Cek missing, outlier, konsistensi antar variabel.',
        },
      ],
      'Dataset bersih',
    ),
    f(
      'analyse',
      'Hitung indikator dan susun temuan.',
      [
        {
          label: 'Analisis',
          contoh: 'Tabulasi silang / ringkasan indikator sesuai tujuan kegiatan.',
        },
      ],
      'Tabel & narasi hasil',
    ),
    f(
      'disseminate',
      'Sebarkan hasil ke pengguna data.',
      [
        {
          label: 'Diseminasi',
          contoh: 'Infografis ringkas + catatan metodologi + metadata.',
        },
      ],
      'Produk statistik rilis',
    ),
    f(
      'evaluate',
      'Evaluasi proses untuk siklus berikutnya.',
      [
        {
          label: 'Evaluasi',
          contoh: 'Catat apa yang berhasil/gagal (respon, kualitas, jadwal).',
        },
      ],
      'Catatan evaluasi siklus',
    ),
  ],
}

function specialize(
  kategori: TopikKategori,
  label: string,
  keywords: string[],
  overlays: Partial<
    Record<GsbpmPhaseId, { ringkas?: string; aktivitas: ContohAktivitas[]; outputContoh?: string }>
  >,
): ContohTopik {
  const fase = umum.fase.map((base) => {
    const o = overlays[base.phaseId]
    if (!o) return base
    return {
      ...base,
      ringkas: o.ringkas ?? base.ringkas,
      aktivitas: [...o.aktivitas, ...base.aktivitas].slice(0, 6),
      outputContoh: o.outputContoh ?? base.outputContoh,
    }
  })
  return { kategori, label, keywords, fase }
}

export const CONTOH_TOPIK: ContohTopik[] = [
  specialize(
    'pelayanan',
    'Pelayanan publik / SKM',
    ['skm', 'kepuasan', 'pelayanan', 'perizinan', 'dpmptsp'],
    {
      specify_need: {
        ringkas: 'Ukur kualitas layanan perizinan untuk perbaikan SOP.',
        aktivitas: [
          {
            label: 'Kebutuhan',
            contoh: 'Indikator Indeks Kepuasan Masyarakat (IKM) layanan perizinan.',
          },
          {
            label: 'Stakeholder',
            contoh: 'DPMPTSP + unit front office + sampel pengguna layanan.',
          },
        ],
        outputContoh: 'Kerangka SKM 9 unsur (ilustrasi praktik)',
      },
      design: {
        aktivitas: [
          {
            label: 'Variabel',
            contoh: 'Skor 1–4 untuk unsur persyaratan, prosedur, waktu, biaya, dll.',
          },
          {
            label: 'Sampling',
            contoh: 'Sampel antrian pengguna dalam periode survei.',
          },
        ],
      },
      analyse: {
        aktivitas: [
          {
            label: 'IKM',
            contoh:
              'Rata-rata tertimbang unsur × 25 (skala 0–100) — konfirmasi rumus resmi.',
          },
        ],
      },
    },
  ),
  specialize('umkm', 'UMKM / usaha', ['umkm', 'usaha', 'nib', 'koperasi', 'dagang'], {
    specify_need: {
      ringkas: 'Petakan pelaku usaha untuk pembinaan dan perizinan.',
      aktivitas: [
        {
          label: 'Kebutuhan',
          contoh: 'Jumlah UMKM terdata, skala usaha, status NIB per kecamatan.',
        },
      ],
    },
    design: {
      aktivitas: [
        {
          label: 'Variabel',
          contoh: 'Nama usaha, NIB, jenis usaha, omzet, tenaga kerja.',
        },
        {
          label: 'Cakupan',
          contoh: 'Sensus unit usaha di wilayah target atau sampel strata kecamatan.',
        },
      ],
    },
    build: {
      aktivitas: [
        {
          label: 'Instrumen',
          contoh: 'Form singkat identitas usaha + legalitas + ketenagakerjaan.',
        },
      ],
    },
  }),
  specialize(
    'kependudukan',
    'Kependudukan',
    ['penduduk', 'kependudukan', 'dukcapil', 'kk', 'nik', 'siak'],
    {
      specify_need: {
        ringkas: 'Manfaatkan register kependudukan untuk statistik sektoral.',
        aktivitas: [
          {
            label: 'Kebutuhan',
            contoh: 'Jumlah penduduk, KK, struktur umur, rasio jenis kelamin.',
          },
          {
            label: 'Sumber',
            contoh: 'Prioritaskan SIAK/Dukcapil (kompromin) sebelum survei baru.',
          },
        ],
      },
      design: {
        aktivitas: [
          {
            label: 'Kompromin',
            contoh: 'PKS/LADU dengan Dukcapil; pemetaan field SIAK → variabel statistik.',
          },
        ],
      },
      build: {
        aktivitas: [
          {
            label: 'Dummy table',
            contoh: 'Rancangan tabel agregat penduduk per desa/kecamatan.',
          },
        ],
      },
    },
  ),
  specialize(
    'pendidikan',
    'Pendidikan / sarpras',
    ['pendidikan', 'sekolah', 'siswa', 'guru', 'dapodik', 'npsn'],
    {
      specify_need: {
        ringkas: 'Kompilasi sarana-prasarana dan peserta didik.',
        aktivitas: [
          {
            label: 'Kebutuhan',
            contoh:
              'Rasio murid–guru, kondisi bangunan, akses internet satuan pendidikan.',
          },
        ],
      },
      design: {
        aktivitas: [
          {
            label: 'Sumber',
            contoh: 'Dapodik + verifikasi dinas pendidikan (kompromin).',
          },
        ],
      },
    },
  ),
  specialize('pertanian', 'Pertanian / padi', ['padi', 'pertanian', 'petani', 'panen', 'gabah', 'tanam'], {
    specify_need: {
      ringkas: 'Estimasi produksi dan produktivitas padi musim tanam.',
      aktivitas: [
        {
          label: 'Kebutuhan',
          contoh: 'Luas tanam/panen, produksi gabah, produktivitas (ton/ha).',
        },
      ],
    },
    design: {
      aktivitas: [
        {
          label: 'Sampling',
          contoh: 'Stratifikasi kecamatan penghasil; hitung n dengan Yamane/Z.',
        },
        {
          label: 'Variabel',
          contoh: 'Luas tanam, luas panen, produksi, varietas, irigasi.',
        },
      ],
    },
  }),
  specialize('kesehatan', 'Kesehatan', ['kesehatan', 'puskesmas', 'pasien', 'imunisasi', 'gizi'], {
    specify_need: {
      ringkas: 'Pantau layanan dan cakupan program kesehatan dasar.',
      aktivitas: [
        {
          label: 'Kebutuhan',
          contoh: 'Kunjungan, cakupan imunisasi, atau kepuasan layanan puskesmas.',
        },
      ],
    },
    design: {
      aktivitas: [
        {
          label: 'Sumber',
          contoh: 'Cek register puskesmas/e-Puskesmas dulu; survei hanya jika gap data.',
        },
      ],
    },
  }),
  umum,
]

export function cariContohTopik(topik: string): ContohTopik {
  const t = topik.toLowerCase()
  for (const c of CONTOH_TOPIK) {
    if (c.kategori === 'umum') continue
    if (c.keywords.some((kw) => t.includes(kw))) return c
  }
  return umum
}

export function getContohFase(topik: string, phaseId: GsbpmPhaseId): ContohFase | undefined {
  return cariContohTopik(topik).fase.find((x) => x.phaseId === phaseId)
}

export function catatanJenis(jenis: JenisKegiatan): string {
  if (jenis === 'kompromin') {
    return 'Jenis kegiatan Kompromin: prioritaskan pemetaan sumber administratif & PKS/LADU; kuesioner lapangan biasanya tidak diperlukan.'
  }
  if (jenis === 'sensus') {
    return 'Jenis kegiatan Sensus: cakup seluruh unit; kerangka/bobot sampel tidak diperlukan, fokus kelengkapan cakupan.'
  }
  return 'Jenis kegiatan Survei: siapkan kerangka sampel, metode sampling, dan hitung ukuran sampel (kalkulator tersedia di tab Perancangan).'
}

function topicFlavor(pack: ContohTopik, activity: string): string {
  const a = activity.toLowerCase()
  const k = pack.kategori
  if (k === 'pelayanan') {
    if (a.includes('kebutuhan') || a.includes('identifikasi'))
      return `Contoh: rumuskan kebutuhan IKM layanan perizinan untuk perbaikan antrean & SOP (${pack.label}).`
    if (a.includes('sampel') || a.includes('kerangka'))
      return 'Contoh: kerangka sampel dari antrian/pengguna layanan dalam periode survei.'
    if (a.includes('kuesioner') || a.includes('instrumen'))
      return 'Contoh: butir skor 1–4 untuk unsur pelayanan (persyaratan, prosedur, waktu, biaya, …).'
  }
  if (k === 'umkm') {
    if (a.includes('kebutuhan') || a.includes('identifikasi'))
      return 'Contoh: petakan jumlah UMKM, status NIB, dan skala usaha per kecamatan.'
    if (a.includes('variabel'))
      return 'Contoh variabel: nama usaha, NIB, jenis usaha, omzet, tenaga kerja.'
  }
  if (k === 'kependudukan') {
    if (a.includes('portal') || a.includes('ketersediaan') || a.includes('administrasi'))
      return 'Contoh: cek SIAK/Dukcapil di portal rujukan sebelum merancang pengumpulan baru.'
    if (a.includes('perjanjian') || a.includes('pks') || a.includes('ladu'))
      return 'Contoh: siapkan PKS/LADU dengan Dukcapil untuk ekstraksi agregat penduduk.'
  }
  if (k === 'pertanian') {
    if (a.includes('sampel') || a.includes('kerangka'))
      return 'Contoh: strata kecamatan penghasil padi; hitung n dengan kalkulator Yamane.'
    if (a.includes('variabel'))
      return 'Contoh variabel: luas tanam, luas panen, produksi gabah, varietas, irigasi.'
  }
  if (k === 'pendidikan') {
    if (a.includes('administrasi') || a.includes('sumber') || a.includes('ketersediaan'))
      return 'Contoh: manfaatkan Dapodik + verifikasi dinas sebelum survei baru.'
  }
  if (k === 'kesehatan') {
    if (a.includes('kebutuhan'))
      return 'Contoh: cakupan imunisasi / kunjungan / kepuasan layanan puskesmas.'
  }
  return `Ilustrasi untuk “${activity}” pada topik ${pack.label}: dokumentasikan bukti kerja, penanggung jawab, dan keluaran yang diharapkan.`
}

/**
 * Build illustration for EVERY visible activity in the phase (README depth ask).
 * Deterministic templates — not LLM.
 */
export function buildRichContohFase(
  topik: string,
  phaseId: GsbpmPhaseId,
  jenis: JenisKegiatan,
): ContohFase | null {
  const phase = getPhase(phaseId)
  if (!phase) return null
  const pack = cariContohTopik(topik)
  const base = getContohFase(topik, phaseId)
  const curated = base?.aktivitas ?? []

  const aktivitas: ContohAktivitas[] = []
  for (const sp of phase.subProcesses) {
    if (sp.skipWhen?.includes(jenis)) continue
    for (const act of sp.activities) {
      const hit = curated.find(
        (c) =>
          act.toLowerCase().includes(c.label.toLowerCase()) ||
          c.contoh.toLowerCase().includes(act.toLowerCase().slice(0, 12)),
      )
      aktivitas.push({
        label: `${sp.code} · ${act.length > 56 ? `${act.slice(0, 54)}…` : act}`,
        contoh: hit?.contoh ?? topicFlavor(pack, act),
      })
    }
    for (const c of sp.checklist.slice(0, 2)) {
      if (c.jenis && !c.jenis.includes(jenis)) continue
      aktivitas.push({
        label: `Checklist ${sp.code}`,
        contoh: `Siapkan bukti: “${c.label}”. ${topicFlavor(pack, c.label)}`,
      })
    }
  }

  const seen = new Set<string>()
  const unique = aktivitas.filter((a) => {
    if (seen.has(a.label)) return false
    seen.add(a.label)
    return true
  })

  return {
    phaseId,
    ringkas: base?.ringkas ?? phase.purpose,
    aktivitas: unique.slice(0, 24),
    outputContoh: base?.outputContoh ?? phase.subProcesses[0]?.outputs[0],
  }
}
