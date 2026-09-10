import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight2,
  Category,
  ShieldTick,
  MagicStar,
  Hierarchy,
  PresentionChart,
  Edit2,
  ExportSquare,
  Link1,
} from 'iconsax-react'
import { BrandLockup } from '@/components/branding/BrandLockup'
import { Button } from '@/components/ui/Button'
import { Badge, Card } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { HOW_TO_STEPS } from '@/content/howToWork'
import { getDemoProjects, isDemoProject } from '@/demo'
import { GSBPM_PHASES, SDI_STAGES } from '@/domain/gsbpm'
import type { GsbpmPhaseId } from '@/domain/types'
import { jenisLabel } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'

const steps = [
  'Jelaskan kebutuhan data Anda',
  'Dapatkan rekomendasi jenis kegiatan',
  'Kerjakan checklist per tahap',
  'Unduh draf dokumen perencanaan',
]

const demoProjects = getDemoProjects()

const heroStats = [
  { label: 'Fase GSBPM', value: String(GSBPM_PHASES.length) },
  { label: 'Proyek demo OPD', value: String(demoProjects.length) },
  {
    label: 'Jenis kegiatan',
    value: String(new Set(demoProjects.map((project) => project.jenisKegiatan)).size),
  },
]

const workspaceTopics = HOW_TO_STEPS.filter((item) =>
  [3, 5, 6, 7].includes(item.step),
).map((item) => item.title)

const statPlanSteps = [
  {
    number: '01',
    title: 'Jelaskan kebutuhan',
    icon: Edit2,
    description:
      'Mulai dari nama kegiatan, topik, konteks kebutuhan, cakupan, dan ketersediaan data untuk membentuk ruang kerja perencanaan.',
    cues: ['Nama kegiatan', 'Topik & konteks', 'Cakupan data'],
  },
  {
    number: '02',
    title: 'Dapatkan rekomendasi',
    icon: MagicStar,
    description:
      'Aturan deterministik memeriksa karakteristik kegiatan lalu menyarankan Survei, Sensus, atau Kompromin beserta alasan dan rujukannya.',
    cues: ['Survei', 'Sensus', 'Kompromin'],
  },
  {
    number: '03',
    title: 'Kerjakan checklist',
    icon: Hierarchy,
    description:
      'Ikuti fase GSBPM dan lengkapi komponen perencanaan yang relevan di dalam workspace secara bertahap.',
    cues: workspaceTopics,
  },
  {
    number: '04',
    title: 'Hasilkan dokumen',
    icon: ExportSquare,
    description:
      'Setelah persyaratan wajib lolos pemeriksaan aplikasi, unduh draf Word. Ruang kerja proyek juga dapat dibagikan melalui tautan.',
    cues: ['Draf Word (.docx)', 'Checklist & metadata', 'Tautan berbagi'],
  },
]

function assetUrl(path: string) {
  const base = import.meta.env.BASE_URL
  const normalized = path.replace(/^\//, '')
  return `${base}${normalized}`
}

function SectionBackdrop({
  src,
  mobileSrc,
  tone,
  priority,
}: {
  src: string
  mobileSrc?: string
  tone: 'navy' | 'paper' | 'hero'
  priority?: boolean
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <picture>
        {mobileSrc ? (
          <source media="(max-width: 767px)" srcSet={assetUrl(mobileSrc)} />
        ) : null}
        <img
          src={assetUrl(src)}
          alt=""
          className={
            tone === 'hero'
              ? 'h-full w-full object-cover object-[center_22%] md:scale-105 md:object-[72%_40%]'
              : 'h-full w-full scale-105 object-cover'
          }
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'low'}
          loading={priority ? 'eager' : 'lazy'}
        />
      </picture>
      {tone === 'hero' ? (
        <>
          {/* Mobile: keep landscape visible; darken only the lower copy band */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/25 via-ink-950/15 to-ink-950/88 md:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink-950 via-ink-950/75 to-transparent md:hidden" />
          {/* Desktop: dark left for copy, open right for landscape */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-ink-950/92 via-ink-950/55 to-[#06131d]/22 md:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/25 md:block" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_12%,rgba(0,147,221,0.14),transparent_50%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eb891b]/45 to-transparent" />
        </>
      ) : tone === 'navy' ? (
        <>
          <div className="absolute inset-0 bg-ink-950/84" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/35 via-ink-950/55 to-ink-950/88" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bps-orange/40 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-white/88" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-50/80 via-white/82 to-ink-50/92" />
        </>
      )}
    </div>
  )
}

const outputGroups = [
  {
    label: 'Perencanaan',
    icon: Edit2,
    description: 'Komponen terstruktur yang disusun dan diperbarui di dalam workspace proyek.',
    items: ['Tujuan & desain kegiatan', 'Variabel & indikator', 'Instrumen jika diperlukan', 'Timeline per fase'],
  },
  {
    label: 'Dokumentasi & metadata',
    icon: ShieldTick,
    description: 'Catatan yang membantu pemeriksaan kelengkapan dan penelusuran rencana.',
    items: ['Checklist GSBPM', 'Pemeriksaan portal rujukan', 'MS-Keg · MS-Var · MS-Ind', 'Draf rekomendasi sektoral'],
  },
  {
    label: 'Dokumen kerja',
    icon: ExportSquare,
    description: 'Representasi dokumen dari isi proyek setelah pemeriksaan wajib terpenuhi.',
    items: ['Ekspor Word (.docx)', 'Ringkasan validasi', 'Draf perencanaan untuk ditinjau'],
  },
  {
    label: 'Berbagi & peninjauan',
    icon: Link1,
    description: 'Cara membawa salinan rencana ke perangkat lain untuk ditinjau lebih lanjut.',
    items: ['Tautan berbagi workspace', 'Impor sebagai salinan proyek', 'Tanpa sinkronisasi cloud real-time'],
  },
]

export function LandingPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const projects = useAppStore((s) => s.projects)
  const loadDemoData = useAppStore((s) => s.loadDemoData)
  const recent = projects.slice(0, 3)
  const [selectedPhaseId, setSelectedPhaseId] = useState<GsbpmPhaseId>(
    GSBPM_PHASES[0].id,
  )
  const [demoLoadIntent, setDemoLoadIntent] = useState<{
    projectId?: string
    projectName?: string
  } | null>(null)
  const selectedPhase =
    GSBPM_PHASES.find((phase) => phase.id === selectedPhaseId) ?? GSBPM_PHASES[0]

  function openDemoProject(projectId: string, projectName: string) {
    if (projects.some((project) => project.id === projectId)) {
      navigate(`/app/projects/${projectId}`)
      return
    }
    if (!projects.some(isDemoProject)) {
      loadDemoData()
      navigate(`/app/projects/${projectId}`)
      return
    }
    setDemoLoadIntent({ projectId, projectName })
  }

  function openDemoWorkspace() {
    const hasDemo = projects.some(isDemoProject)
    if (hasDemo) {
      navigate('/app')
      return
    }
    loadDemoData()
    navigate('/app')
  }

  function confirmDemoLoad() {
    const targetId = demoLoadIntent?.projectId
    loadDemoData()
    setDemoLoadIntent(null)
    navigate(targetId ? `/app/projects/${targetId}` : '/app')
  }

  return (
    <div className="landing-page relative min-h-dvh overflow-hidden bg-ink-950 text-white">
      <div className="relative flex min-h-dvh flex-col">
        <SectionBackdrop
          src="/landing/hero-bps.png"
          mobileSrc="/landing/hero-mobile-bps.png"
          tone="hero"
          priority
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-8%] top-10 hidden h-[28rem] w-[28rem] rounded-full bg-[#0093dd]/12 blur-3xl md:block" />
          <div className="absolute bottom-10 left-1/3 hidden h-56 w-56 rounded-full bg-[#eb891b]/10 blur-3xl md:block" />
        </div>

        <header className="relative z-20 pt-[env(safe-area-inset-top)] md:bg-transparent">
          {/* Mobile app bar — brand + one action */}
          <div className="border-b border-white/10 bg-ink-950/35 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <img
                  src={`${import.meta.env.BASE_URL}branding/bps-logo.svg`}
                  alt=""
                  aria-hidden
                  className="h-8 w-auto shrink-0 object-contain drop-shadow-sm"
                />
                <span className="h-6 w-px shrink-0 bg-white/25" aria-hidden />
                <img
                  src={`${import.meta.env.BASE_URL}branding/statplan-logo.png`}
                  alt=""
                  aria-hidden
                  className="h-9 w-9 shrink-0 rounded-[22%] shadow-md ring-1 ring-white/15"
                />
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-[15px] font-semibold tracking-tight text-white">
                    StatPlan
                  </div>
                  <div className="truncate text-[10px] font-medium text-white/55">BPS Loteng</div>
                </div>
              </div>
              <button
                type="button"
                aria-label="Buka Dashboard"
                onClick={() => navigate('/app')}
                className="focus-ring inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-bps-blue px-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgb(0_147_221/0.35)] transition active:scale-[0.97]"
              >
                <Category size={18} variant="Bold" color="currentColor" aria-hidden />
                Masuk
              </button>
            </div>
          </div>

          {/* Desktop / tablet bar */}
          <div className="relative mx-auto hidden h-16 max-w-6xl items-center justify-between gap-3 px-6 md:flex">
            <BrandLockup size="sm" inverted compact className="min-w-0" />
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="landing-ghost-dark min-h-11 border border-white/10 text-white"
                onClick={() => navigate('/app/presentation')}
              >
                Mode presentasi
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="landing-btn-blue min-h-11 px-3.5"
                aria-label="Buka Dashboard"
                onClick={() => navigate('/app')}
              >
                Buka Dashboard
              </Button>
            </div>
          </div>
        </header>

        <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sm:justify-center sm:px-6 sm:pb-16 sm:pt-12 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-20 lg:pt-14">
          {/* Mobile: leave upper band open so Lombok photo reads as the hero plane */}
          <div className="min-h-[34vh] flex-1 sm:hidden" aria-hidden />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' }}
            className="max-w-xl pb-2 sm:pb-0"
          >
            <p className="landing-kicker mb-2.5 text-bps-orange sm:mb-4">
              BPS Kabupaten Lombok Tengah
            </p>
            <h1 className="font-display text-[2.45rem] font-semibold leading-[0.96] tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]">
              StatPlan
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/82 sm:mt-4 sm:text-lg">
              Perencanaan kegiatan statistik dari kebutuhan data hingga draf dokumen, dipandu
              GSBPM.
            </p>
            <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-3">
              <Button
                variant="gold"
                size="lg"
                className="landing-shine min-h-12 w-full sm:w-auto"
                rightIcon={
                  <ArrowRight2 size={18} variant="Bold" color="currentColor" aria-hidden />
                }
                onClick={() => navigate('/app/new')}
              >
                Mulai proyek baru
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="landing-ghost-dark min-h-12 w-full border border-white/25 text-white sm:w-auto"
                onClick={openDemoWorkspace}
              >
                Lihat demo
              </Button>
            </div>
            <p className="mt-3 max-w-lg text-[11px] leading-relaxed text-white/50 sm:text-xs">
              Demo menambah contoh tanpa mengubah proyek Anda.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.12 }}
            className="mt-10 hidden lg:mt-0 lg:block"
          >
            <div className="float-soft rounded-[1.75rem] border border-white/12 bg-ink-950/45 p-6 shadow-(--shadow-lift) backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  Alur ringkas StatPlan · ilustrasi
                </div>
                <span className="rounded-full bg-bps-orange/15 px-2.5 py-0.5 text-[10px] font-semibold text-bps-orange ring-1 ring-bps-orange/20">
                  Navigasi 4 tahap
                </span>
              </div>
              <p className="mb-5 text-xs leading-relaxed text-white/55">
                Delapan fase GSBPM dikelompokkan ke empat tahap navigasi. Penyederhanaan UX,
                bukan struktur fase resmi.
              </p>
              <div className="space-y-3">
                {SDI_STAGES.map((stage, i) => {
                  const mappedPhases = stage.phases
                    .map((phaseId) => GSBPM_PHASES.find((phase) => phase.id === phaseId))
                    .filter((phase): phase is (typeof GSBPM_PHASES)[number] => Boolean(phase))

                  return (
                    <div
                      key={stage.id}
                      className="rounded-2xl border border-white/10 bg-ink-900/55 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bps-orange/15 text-xs font-semibold text-bps-orange ring-1 ring-bps-orange/20">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{stage.title}</div>
                          <div className="mt-1 text-xs leading-relaxed text-white/45">
                            {mappedPhases
                              .map((phase) => `${phase.code}. ${phase.titleId}`)
                              .join(' · ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-white/50">
                <Hierarchy size={16} variant="Bold" color="currentColor" aria-hidden />
                Empat tahap navigasi memetakan seluruh 8 fase GSBPM 5.2.
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Mobile-only: stats + steps under the fold */}
      <section
        aria-label="Ringkasan StatPlan"
        className="relative z-10 border-t border-white/10 bg-ink-950 px-4 py-10 sm:px-6 lg:hidden"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-3 gap-2.5">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-2.5 py-3 text-center"
              >
                <div className="font-display text-xl font-semibold text-bps-orange sm:text-2xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[10px] font-medium uppercase leading-tight tracking-wide text-white/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <ol className="mt-6 space-y-2.5">
            {steps.map((s, i) => (
              <li
                key={s}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3.5 text-sm text-white/80"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bps-orange/15 text-xs font-semibold text-bps-orange ring-1 ring-bps-orange/25">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Desktop extras that used to sit in the hero column */}
      <section className="relative z-10 hidden border-t border-white/10 bg-ink-950/80 px-6 py-12 lg:block">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <div className="grid max-w-md grid-cols-3 gap-3">
              {heroStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur-sm"
                >
                  <div className="font-display text-2xl font-semibold text-bps-orange">
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium uppercase leading-tight tracking-wide text-white/55">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 px-3.5 py-3 text-sm text-white/75 backdrop-blur-sm"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bps-orange/15 text-xs font-semibold text-bps-orange ring-1 ring-bps-orange/25">
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/50">
            StatPlan adalah simulator pembelajaran. Keluaran berstatus draf dan bukan
            persetujuan resmi BPS.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="gsbpm-heading"
        className="relative z-10 overflow-hidden border-y border-white/10"
      >
        <SectionBackdrop src="/landing/gsbpm-process.png" tone="navy" />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="landing-kicker mb-3 text-bps-orange">
                Kerangka proses statistik
              </p>
              <h2
                id="gsbpm-heading"
                className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Apa itu GSBPM?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
                GSBPM (Generic Statistical Business Process Model) adalah kerangka untuk
                menggambarkan proses bisnis kegiatan statistik, dari identifikasi kebutuhan
                hingga evaluasi.
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                StatPlan menggunakan GSBPM 5.2 sebagai kerangka proses untuk membantu pengguna
                memahami dan menyusun kegiatan statistik secara bertahap.
              </p>
            </div>
            <div className="w-fit rounded-full border border-bps-orange/30 bg-bps-orange/10 px-3.5 py-1.5 text-xs font-semibold text-bps-orange">
              GSBPM 5.2 · {GSBPM_PHASES.length} fase
            </div>
          </div>

          <ol className="mt-10 grid list-none grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-4">
            {GSBPM_PHASES.map((phase) => {
              const active = phase.id === selectedPhase.id
              return (
                <li key={phase.id} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={active}
                    aria-controls="selected-phase-detail"
                    onClick={() => setSelectedPhaseId(phase.id)}
                    onFocus={() => setSelectedPhaseId(phase.id)}
                    className={`focus-ring group h-full w-full rounded-2xl border p-4 text-left transition duration-200 ${
                      active
                        ? 'border-bps-orange/45 bg-bps-orange/12 shadow-[0_12px_32px_rgba(245,200,66,0.08)]'
                        : 'border-white/10 bg-white/5 hover:-translate-y-1 hover:border-bps-orange/30 hover:bg-white/10 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)]'
                    }`}
                  >
                    <span
                      className={`font-display text-2xl font-semibold ${
                        active ? 'text-bps-orange' : 'text-white/35 group-hover:text-white/55'
                      }`}
                    >
                      {phase.code.padStart(2, '0')}
                    </span>
                    <span className="mt-4 block text-sm font-semibold text-white">
                      {phase.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/45">
                      {phase.titleId}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div
            id="selected-phase-detail"
            className="mt-4 rounded-2xl border border-white/10 bg-ink-900/55 p-5 sm:flex sm:items-start sm:justify-between sm:gap-8"
          >
            <div className="max-w-3xl">
              <div className="landing-kicker text-bps-orange">
                Fase {selectedPhase.code} · {selectedPhase.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {selectedPhase.purpose}
              </p>
            </div>
            <div className="mt-4 shrink-0 text-xs text-white/45 sm:mt-0 sm:text-right">
              <span className="block font-display text-2xl font-semibold text-white">
                {selectedPhase.subProcesses.length}
              </span>
              subprocess tersedia
            </div>
          </div>
        </motion.div>
      </section>

      <section
        aria-labelledby="statplan-flow-heading"
        className="relative z-10 overflow-hidden text-ink-950"
      >
        <SectionBackdrop src="/landing/workspace-desk.png" tone="paper" />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="max-w-3xl">
            <p className="landing-kicker mb-3 text-bps-blue">
              Dari kebutuhan menjadi bahan kerja
            </p>
            <h2
              id="statplan-flow-heading"
              className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Bagaimana StatPlan bekerja?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
              StatPlan adalah simulator dan ruang belajar perencanaan untuk membantu pengguna
              mempraktikkan penyusunan kegiatan statistik berdasarkan alur GSBPM yang digunakan
              sebagai referensi proyek.
            </p>
          </div>

          <ol className="mt-10 grid list-none grid-cols-1 gap-4 md:grid-cols-2">
            {statPlanSteps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <motion.li
                  key={step.number}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    delay: reduceMotion ? 0 : index * 0.05,
                  }}
                  className="surface-card group relative overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:border-ink-600/20 hover:shadow-(--shadow-lift) sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-3xl font-semibold text-ink-900/20">
                      {step.number}
                    </span>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bps-blue text-white"
                      aria-hidden
                    >
                      <StepIcon size={20} variant="Bold" color="currentColor" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-ink-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {step.description}
                  </p>
                  <ul
                    className="mt-4 flex list-none flex-wrap gap-2"
                    aria-label={`Komponen pada langkah ${step.number}`}
                  >
                    {step.cues.map((cue) => (
                      <li
                        key={cue}
                        className="rounded-full bg-ink-100/80 px-2.5 py-1 text-[11px] font-medium text-ink-700 ring-1 ring-ink-900/5"
                      >
                        {cue}
                      </li>
                    ))}
                  </ul>
                </motion.li>
              )
            })}
          </ol>

          <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-ink-900/10 bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-950">
                <ShieldTick size={18} variant="Bold" color="currentColor" aria-hidden />
                Tetap menjadi draf dan bahan kerja
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                StatPlan bukan sistem pengumpulan data responden atau persetujuan resmi BPS.
                Validasi dan proses formal tetap dilakukan melalui mekanisme yang berlaku.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="gold" className="landing-shine" onClick={() => navigate('/app/new')}>
                Mulai proyek baru
              </Button>
              <Button
                variant="secondary"
                className="landing-secondary-light"
                onClick={() => {
                  if (projects.length === 0) loadDemoData()
                  navigate('/app')
                }}
              >
                {projects.length === 0 ? 'Lihat demo' : 'Buka beranda'}
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <section
        aria-labelledby="demo-projects-heading"
        className="relative z-10 overflow-hidden border-t border-ink-900/8 text-ink-950"
      >
        <SectionBackdrop src="/landing/opd-district.png" tone="paper" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <p className="landing-kicker text-bps-blue">
                  Eksplorasi ruang kerja
                </p>
                <Badge className="bg-bps-blue/10 font-medium text-bps-blue ring-1 ring-bps-blue/20">Contoh ilustratif</Badge>
              </div>
              <h2
                id="demo-projects-heading"
                className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Contoh kegiatan statistik
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
                Eksplorasi {demoProjects.length} contoh proyek untuk melihat bagaimana kebutuhan,
                proses, checklist, dan output perencanaan disusun dalam StatPlan.
              </p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-600">
              Data contoh untuk pembelajaran, bukan hasil statistik, publikasi, atau proyek
              operasional resmi BPS.
            </p>
          </div>

          <ul className="mt-10 grid list-none grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {demoProjects.map((project, index) => (
              <motion.li
                key={project.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: reduceMotion ? 0 : 0.35,
                  delay: reduceMotion ? 0 : index * 0.04,
                }}
                className="min-w-0"
              >
                <Card
                  hover
                  className="flex h-full flex-col border-ink-900/10 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand">{jenisLabel(project.jenisKegiatan)}</Badge>
                    <Badge>{project.topik}</Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-ink-950">
                    {project.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-700">
                    {project.description}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-2 border-t border-border/80 pt-4 text-xs">
                    <div>
                      <dt className="text-ink-600">Variabel</dt>
                      <dd className="mt-0.5 font-semibold text-ink-950">
                        {project.variables.length}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-600">Indikator</dt>
                      <dd className="mt-0.5 font-semibold text-ink-950">
                        {project.indicators.length}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-ink-600">Instrumen</dt>
                      <dd className="mt-0.5 font-semibold text-ink-950">
                        {project.questionnaire.length > 0
                          ? `${project.questionnaire.length} butir`
                          : project.jenisKegiatan === 'kompromin'
                            ? 'Tanpa kuesioner · sumber administratif'
                            : 'Belum tersedia'}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-5">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="landing-secondary-light"
                      rightIcon={
                        <ArrowRight2 size={14} variant="Bold" color="currentColor" aria-hidden />
                      }
                      aria-label={`Lihat contoh ${project.name}`}
                      onClick={() => openDemoProject(project.id, project.name)}
                    >
                      Lihat contoh
                    </Button>
                  </div>
                </Card>
              </motion.li>
            ))}
          </ul>

          <p className="mt-6 text-xs leading-relaxed text-ink-600">
            Membuka contoh yang belum tersedia memerlukan pemuatan data demo. Jika ruang kerja
            Anda sudah berisi proyek lain, StatPlan akan meminta konfirmasi terlebih dahulu.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="statplan-outputs-heading"
        className="relative z-10 overflow-hidden border-y border-white/10 text-white"
      >
        <SectionBackdrop src="/landing/documents.png" tone="navy" />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="landing-kicker mb-3 text-bps-orange">
                Keluaran perencanaan
              </p>
              <h2
                id="statplan-outputs-heading"
                className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Apa yang dihasilkan StatPlan?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
                Susun komponen perencanaan dalam satu workspace, lalu gunakan isinya sebagai
                bahan kerja, dokumen, dan salinan proyek yang dapat ditinjau.
              </p>
            </div>
            <Badge className="w-fit bg-bps-orange/15 font-semibold text-bps-orange ring-1 ring-bps-orange/25">
              Draf · bahan kerja
            </Badge>
          </div>

          <ol className="mt-10 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {outputGroups.map((group, index) => {
              const OutputIcon = group.icon
              return (
                <motion.li
                  key={group.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    delay: reduceMotion ? 0 : index * 0.05,
                  }}
                  className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-bps-orange">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bps-orange/12 text-bps-orange ring-1 ring-bps-orange/20"
                      aria-hidden
                    >
                      <OutputIcon size={18} variant="Bold" color="currentColor" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">{group.label}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/55">{group.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-white/75">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span
                          className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-bps-orange"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.li>
              )
            })}
          </ol>

          <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="max-w-2xl">
              <div className="text-sm font-semibold text-white">
                Pemeriksaan sebelum ekspor
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                Dokumen dapat diekspor setelah persyaratan wajib pada proyek terpenuhi. Hasil
                StatPlan tetap berupa draf dan bahan kerja yang perlu ditinjau serta disesuaikan
                melalui mekanisme yang berlaku.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="gold" className="landing-shine" onClick={() => navigate('/app/new')}>
                Mulai proyek baru
              </Button>
              <Button
                variant="ghost"
                className="landing-ghost-dark border border-white/15 text-white"
                onClick={openDemoWorkspace}
              >
                Lihat contoh
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {recent.length > 0 ? (
        <section className="relative z-10 overflow-hidden">
          <SectionBackdrop src="/landing/documents.png" tone="navy" />
          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Proyek terkini di perangkat ini
            </h2>
            <button
              type="button"
              className="focus-ring rounded-lg px-1.5 py-1 text-xs text-bps-orange hover:text-bps-orange"
              onClick={() => navigate('/app')}
            >
              Lihat semua
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {recent.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/app/projects/${p.id}`)}
                className="focus-ring rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-bps-orange/35 hover:bg-white/10 hover:shadow-[0_16px_36px_rgba(0,0,0,0.24)]"
              >
                <div className="text-sm font-semibold text-white line-clamp-2">{p.name}</div>
                <div className="mt-2 text-[11px] text-white/45">
                  {p.rekomendasiBps.penyelenggara || 'OPD'}
                </div>
              </button>
            ))}
          </div>
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="final-cta-heading"
        className="relative z-10 overflow-hidden border-t border-ink-900/10 text-ink-950"
      >
        <SectionBackdrop src="/landing/cta-sunrise.png" tone="paper" />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
          className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="landing-kicker mb-3 text-bps-blue">
                Siap mencoba?
              </p>
              <h2
                id="final-cta-heading"
                className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Mulai susun rencana kegiatan Anda.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-700">
                Gunakan StatPlan untuk mengeksplorasi dan mempraktikkan proses perencanaan
                kegiatan statistik secara terstruktur.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="gold"
                className="landing-shine"
                rightIcon={<ArrowRight2 size={16} variant="Bold" color="currentColor" aria-hidden />}
                onClick={() => navigate('/app/new')}
              >
                Mulai proyek baru
              </Button>
              <Button variant="secondary" className="landing-secondary-light" onClick={openDemoWorkspace}>
                Lihat contoh
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-ink-900/10 bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bps-blue text-white"
                aria-hidden
              >
                <PresentionChart size={20} variant="Bold" color="currentColor" />
              </span>
              <div>
                <div className="text-sm font-semibold text-ink-950">Perlu mendemonstrasikan StatPlan?</div>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-700">
                  Mode presentasi merangkum materi slide, naskah demo, sorotan fitur, dan FAQ
                  untuk membantu demonstrasi aplikasi.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="landing-secondary-light shrink-0"
              onClick={() => navigate('/app/presentation')}
            >
              Mode presentasi
            </Button>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 overflow-hidden border-t border-white/10 px-4 py-8 text-white/60 sm:px-6">
        <SectionBackdrop src="/landing/hero-bps.png" tone="navy" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <div className="text-sm font-semibold text-white">StatPlan</div>
              <p className="mt-1.5 text-xs leading-relaxed">
                Simulator pembelajaran dan perencanaan kegiatan statistik berbasis referensi
                GSBPM. Bukan sistem operasional atau mekanisme persetujuan resmi BPS.
              </p>
            </div>
            <nav aria-label="Tautan footer" className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              {[
                { label: 'Aplikasi', to: '/app' },
                { label: 'Bantuan', to: '/app/help' },
                { label: 'Tentang', to: '/app/about' },
                { label: 'Presentasi', to: '/app/presentation' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="focus-ring rounded-md text-white/65 transition hover:text-bps-orange"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-6 border-t border-white/10 pt-5 text-xs text-white/45">
            © {new Date().getFullYear()} StatPlan · Konteks demonstrasi BPS Kabupaten Lombok
            Tengah · Keluaran berstatus draf dan bahan kerja.
          </div>
        </div>
      </footer>

      <ConfirmDialog
        open={demoLoadIntent !== null}
        title="Perbarui data demo?"
        description={
          demoLoadIntent?.projectName
            ? `Untuk membuka “${demoLoadIntent.projectName}”, ${demoProjects.length} proyek contoh akan diperbarui. Proyek yang Anda buat sendiri tidak akan diubah atau dihapus.`
            : `${demoProjects.length} proyek contoh akan diperbarui. Proyek yang Anda buat sendiri tidak akan diubah atau dihapus.`
        }
        confirmLabel="Perbarui data demo"
        cancelLabel="Batalkan"
        onCancel={() => setDemoLoadIntent(null)}
        onConfirm={confirmDemoLoad}
      />
    </div>
  )
}
