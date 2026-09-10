import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft2,
  ArrowRight2,
  Hierarchy,
  DocumentText,
  TickSquare,
  ExportSquare,
  MagicStar,
  Book1,
  InfoCircle,
  PresentionChart,
} from 'iconsax-react'
import { useAppStore } from '@/store/appStore'
import { Card, Badge, ProgressBar } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { computeProjectProgress } from '@/domain/gsbpm'
import { cn, jenisLabel } from '@/lib/utils'
import { klasifikasiLabel } from '@/lib/projectMeta'

type TabId = 'sorotan' | 'slide' | 'script' | 'faq'

const highlights = [
  {
    id: 'recommend',
    title: 'Rekomendasi jenis kegiatan',
    body: 'Tunjukkan bagaimana asisten memilih Survei / Sensus / Kompromin berdasarkan ketersediaan data (Specify Need 1.5 & Design 2.3).',
    icon: MagicStar,
    tabHint: 'Buka Asisten atau kartu rekomendasi di workspace.',
  },
  {
    id: 'portal',
    title: 'Portal rujukan statistik',
    body: 'Tekankan kewajiban cek sirusa & romantik (serta portal SDI bila relevan) sebelum pengumpulan baru — validasi ekspor memblokir jika sirusa/romantik belum lengkap (Specify Need 1.5).',
    icon: TickSquare,
    tabHint: 'Di workspace → Alur kerja → kartu portal rujukan.',
  },
  {
    id: 'gsbpm',
    title: 'Alur GSBPM',
    body: 'Navigasi empat tahap antarmuka membungkus delapan fase GSBPM 5.2. Subproses sampling dilewati otomatis untuk sensus/kompromin.',
    icon: Hierarchy,
    tabHint: 'Tab Alur kerja — pilih fase di sidebar kiri.',
  },
  {
    id: 'metadata',
    title: 'Metadata MS-Keg / Var / Ind',
    body: 'Tampilkan form metadata sesuai arah Perka BPS 5/2020 sebagai draf — bukan katalog Perka penuh.',
    icon: DocumentText,
    tabHint: 'Tab Metadata pada workspace proyek.',
  },
  {
    id: 'export',
    title: 'Ekspor draf DOCX',
    body: 'Ekspor hanya aktif setelah persyaratan wajib terpenuhi. Dokumen tetap berstatus draf untuk validasi BPS.',
    icon: ExportSquare,
    tabHint: 'Tab Ekspor — atau tombol unduh di header proyek.',
  },
]

const slides = [
  {
    n: 1,
    title: 'Judul',
    body: 'StatPlan · Perencanaan Statistik OPD · BPS Lombok Tengah',
  },
  {
    n: 2,
    title: 'Apa ini',
    body: 'Workspace GSBPM 5.2 untuk OPD menyusun perencanaan statistik. Bukan LMS pelatihan, bukan database lapangan.',
  },
  {
    n: 3,
    title: 'Tiga jenis kegiatan',
    body: 'Survei · Sensus · Kompilasi produk administrasi (Kompromin) — dipilih lewat rekomendasi rule-based yang dapat diaudit.',
  },
  {
    n: 4,
    title: 'Fitur inti',
    body: 'Rekomendasi jenis · Checklist GSBPM · Variabel · Instrumen · Metadata MS-Keg/Var/Ind · Ekspor draf DOCX.',
  },
  {
    n: 5,
    title: 'Demo live',
    body: 'Tampilkan satu proyek OPD di workspace: alur kerja → variabel → metadata → ekspor.',
  },
  {
    n: 6,
    title: 'Metadata',
    body: 'MS-Keg / MS-Var / MS-Ind mengikuti arah Perka BPS 5/2020 sebagai draf perencanaan.',
  },
  {
    n: 7,
    title: 'Batasan',
    body: 'Client-side · localStorage · dokumen draf · lima proyek demo bersifat contoh ilustratif (bukan standar resmi BPS).',
  },
  {
    n: 8,
    title: 'Validasi BPS',
    body: 'Keluaran tetap draf hingga divalidasi BPS. Jangan masukkan data pribadi responden ke workspace.',
  },
  {
    n: 9,
    title: 'Hosting',
    body: 'Deploy Vercel → domain target simulator.bpsloteng.net (CNAME). Lihat HOSTING.md / Pengaturan → Hosting.',
  },
]

const scriptSteps = [
  {
    aksi: 'Beranda',
    ucap: 'Ini daftar proyek OPD. Progress dihitung dari checklist wajib.',
  },
  {
    aksi: 'Buka SKM DPMPTSP (Survei ~98%)',
    ucap: 'Contoh survei sektoral hampir siap review.',
  },
  {
    aksi: 'Tab Alur kerja',
    ucap: 'Delapan fase GSBPM. Centang mengikuti jenis kegiatan.',
  },
  {
    aksi: 'Kartu portal rujukan',
    ucap: 'Sirusa & Romantik wajib sebelum ekspor — cegah duplikasi.',
  },
  {
    aksi: 'Asisten / rekomendasi',
    ucap: 'Survei / Sensus / Kompromin dipilih dari aturan, bukan tebak-tebakan.',
  },
  {
    aksi: 'Tab Variabel → NIB (proyek UMKM)',
    ucap: 'Setiap variabel: nama, definisi, tipe, skala, sumber, contoh, missing. Helper Misal mengikuti variabel yang sedang dibuka.',
  },
  {
    aksi: 'Tab Instrumen',
    ucap: 'Survei/Sensus: pertanyaan selaras variabel. Kompromin: tanpa kuesioner — data dari administrasi.',
  },
  {
    aksi: 'Tab Metadata',
    ucap: 'MS-Keg / Var / Ind sebagai draf arah Perka 5/2020.',
  },
  {
    aksi: 'Tab Ekspor',
    ucap: 'Tombol aktif hanya jika syarat wajib terpenuhi. File = draf Word.',
  },
  {
    aksi: 'Ganti proyek (UMKM / Dukcapil / Padi / Pendidikan)',
    ucap: 'Tunjukkan branching Survei · Sensus · Kompromin.',
  },
]

const faqs = [
  {
    q: 'Apakah ini sistem resmi BPS?',
    a: 'Belum. Demonstrasi perencanaan untuk BPS Kabupaten Lombok Tengah.',
  },
  {
    q: 'Apakah data responden disimpan di server?',
    a: 'Tidak. Progress tersimpan di browser (localStorage). Jangan isi data pribadi nyata.',
  },
  {
    q: 'Apakah rekomendasi aplikasi = putusan BPS?',
    a: 'Tidak. Aturan aplikasi membantu perencanaan; rekomendasi resmi ke BPS tetap proses formal.',
  },
  {
    q: 'Kenapa kompromin tanpa kuesioner?',
    a: 'Sumbernya produk administrasi, bukan pengumpulan primer lewat instrumen.',
  },
  {
    q: 'Apakah metadata “lengkap” = katalog Perka penuh?',
    a: 'Tidak. Form draf di aplikasi; validasi BPS tetap diperlukan.',
  },
]

const demoProjectsBrief = [
  { jenis: 'Survei', nama: 'SKM Perizinan DPMPTSP' },
  { jenis: 'Sensus', nama: 'Pendataan UMKM' },
  { jenis: 'Kompromin', nama: 'Integrasi Kependudukan Dukcapil' },
  { jenis: 'Survei', nama: 'Survei Produksi Padi' },
  { jenis: 'Kompromin', nama: 'Sarpras Pendidikan' },
]

export function PresentationPage() {
  const navigate = useNavigate()
  const projects = useAppStore((s) => s.projects)
  const loadDemoData = useAppStore((s) => s.loadDemoData)
  const [tab, setTab] = useState<TabId>('slide')
  const [step, setStep] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)
  const [projectIndex, setProjectIndex] = useState(0)

  const sample = projects[projectIndex] ?? projects[0]
  const highlight = highlights[step]
  const Icon = highlight.icon
  const slide = slides[slideIndex]

  const progress = useMemo(
    () =>
      sample
        ? computeProjectProgress(sample.jenisKegiatan, sample.klasifikasi, sample.checklistState)
        : { pct: 0, done: 0, total: 0 },
    [sample],
  )

  if (projects.length === 0) {
    return (
      <Card className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-lg font-semibold">Belum ada proyek untuk presentasi</h1>
        <p className="mt-2 text-sm text-ink-700">Muat data demo terlebih dahulu.</p>
        <Button className="mt-6" variant="gold" onClick={() => loadDemoData()}>
          Muat data demo
        </Button>
      </Card>
    )
  }

  const tabs: { id: TabId; label: string; icon: typeof PresentionChart }[] = [
    { id: 'slide', label: 'Materi slide', icon: PresentionChart },
    { id: 'script', label: 'Naskah demo', icon: Book1 },
    { id: 'sorotan', label: 'Sorotan fitur', icon: MagicStar },
    { id: 'faq', label: 'FAQ', icon: InfoCircle },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-600">
          Mode presentasi
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Materi Presentasi StatPlan
        </h1>
        <p className="mt-2 text-sm text-ink-700">
          Naskah demo, slide, dan FAQ untuk demonstrasi ke BPS Lombok Tengah. Keluaran aplikasi
          berstatus <span className="font-medium text-ink-900">draf</span>; lima proyek demo =
          contoh ilustratif.
        </p>
      </div>

      {/* Handout singkat */}
      <Card className="border-ink-900/10 bg-gradient-to-br from-ink-50 to-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-600">Handout singkat</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-800">
          <strong>StatPlan</strong> membantu OPD merancang kegiatan statistik mengikuti{' '}
          <strong>GSBPM 5.2</strong>: memilih jenis kegiatan (Survei / Sensus / Kompromin),
          mengisi checklist, menyusun variabel & instrumen, melengkapi metadata MS-Keg / Var / Ind,
          lalu mengekspor <strong>draf</strong> dokumen. Portal Sirusa / Romantik dicek sebelum
          pengumpulan baru. Semua keluaran bersifat draf hingga divalidasi BPS.
        </p>
      </Card>

      {/* Proyek aktif */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge tone="brand">{jenisLabel(sample.jenisKegiatan)}</Badge>
              <Badge tone="gold">{klasifikasiLabel(sample.klasifikasi)}</Badge>
            </div>
            <h2 className="text-lg font-semibold">{sample.name}</h2>
            <p className="mt-1 text-xs text-ink-600">{sample.rekomendasiBps.penyelenggara}</p>
            <div className="mt-4 max-w-sm">
              <div className="mb-1 flex justify-between text-xs text-ink-600">
                <span>Progres</span>
                <span>{progress.pct}%</span>
              </div>
              <ProgressBar value={progress.pct} premium={progress.pct >= 80} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={projectIndex <= 0}
              onClick={() => setProjectIndex((i) => Math.max(0, i - 1))}
            >
              Proyek sebelumnya
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={projectIndex >= projects.length - 1}
              onClick={() => setProjectIndex((i) => Math.min(projects.length - 1, i + 1))}
            >
              Proyek berikutnya
            </Button>
            <Button
              size="sm"
              variant="gold"
              onClick={() => navigate(`/app/projects/${sample.id}`)}
            >
              Buka workspace
            </Button>
          </div>
        </div>
      </Card>

      {/* Tab materi */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const TabIcon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition',
                tab === t.id
                  ? 'bg-ink-900 text-white'
                  : 'bg-white text-ink-700 ring-1 ring-border hover:bg-ink-50',
              )}
            >
              <TabIcon size={14} variant="Bold" color="currentColor" />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'slide' ? (
        <Card>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-600">
            Slide {slide.n} / {slides.length}
          </div>
          <h3 className="font-display text-2xl font-semibold tracking-tight">{slide.title}</h3>
          <p className="mt-4 text-base leading-relaxed text-ink-800">{slide.body}</p>
          <div className="mt-6 flex flex-wrap justify-between gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowLeft2 size={14} variant="Bold" color="currentColor" />}
              disabled={slideIndex <= 0}
              onClick={() => setSlideIndex((s) => Math.max(0, s - 1))}
            >
              Slide sebelumnya
            </Button>
            <Button
              size="sm"
              rightIcon={<ArrowRight2 size={14} variant="Bold" color="currentColor" />}
              disabled={slideIndex >= slides.length - 1}
              onClick={() => setSlideIndex((s) => Math.min(slides.length - 1, s + 1))}
            >
              Slide berikutnya
            </Button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {slides.map((s, i) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setSlideIndex(i)}
                className={cn(
                  'rounded-xl px-3 py-2 text-left text-xs font-medium transition',
                  i === slideIndex
                    ? 'bg-ink-900 text-white'
                    : 'bg-ink-50 text-ink-700 hover:bg-ink-100',
                )}
              >
                {s.n}. {s.title}
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === 'script' ? (
        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 font-semibold">Naskah demo live (±10–12 menit)</h3>
            <ol className="space-y-3">
              {scriptSteps.map((row, i) => (
                <li
                  key={row.aksi}
                  className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm"
                >
                  <div className="flex gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[11px] font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-medium text-ink-900">{row.aksi}</div>
                      <p className="mt-0.5 text-ink-700">“{row.ucap}”</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <h3 className="mb-2 font-semibold">Lima proyek demo (contoh ilustratif)</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {demoProjectsBrief.map((p) => (
                <li
                  key={p.nama}
                  className="flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2 text-sm"
                >
                  <Badge tone="brand">{p.jenis}</Badge>
                  <span className="text-ink-800">{p.nama}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}

      {tab === 'sorotan' ? (
        <>
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-900 text-gold-400">
                <Icon size={22} variant="Bold" color="currentColor" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-600">
                  Sorotan {step + 1} / {highlights.length}
                </div>
                <h3 className="text-xl font-semibold">{highlight.title}</h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-ink-700">{highlight.body}</p>
            <p className="mt-3 rounded-xl bg-ink-50 px-3 py-2 text-xs text-ink-600">
              {highlight.tabHint}
            </p>
            <div className="mt-6 flex flex-wrap justify-between gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ArrowLeft2 size={14} variant="Bold" color="currentColor" />}
                disabled={step <= 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Langkah sebelumnya
              </Button>
              <Button
                size="sm"
                rightIcon={<ArrowRight2 size={14} variant="Bold" color="currentColor" />}
                disabled={step >= highlights.length - 1}
                onClick={() => setStep((s) => Math.min(highlights.length - 1, s + 1))}
              >
                Langkah berikutnya
              </Button>
            </div>
          </Card>
          <div className="grid gap-2 sm:grid-cols-5">
            {highlights.map((h, i) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  'rounded-xl px-3 py-2 text-left text-xs font-medium transition',
                  i === step
                    ? 'bg-ink-900 text-white'
                    : 'bg-white text-ink-700 ring-1 ring-border hover:bg-ink-50',
                )}
              >
                {i + 1}. {h.title}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {tab === 'faq' ? (
        <Card>
          <h3 className="mb-4 font-semibold">FAQ reviewer</h3>
          <ul className="space-y-4">
            {faqs.map((f) => (
              <li key={f.q} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="text-sm font-medium text-ink-900">{f.q}</div>
                <p className="mt-1 text-sm text-ink-700">{f.a}</p>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  )
}
