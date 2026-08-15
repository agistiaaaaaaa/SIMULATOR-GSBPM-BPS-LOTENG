import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight2,
  TickCircle,
  DocumentText,
  ShieldTick,
  MagicStar,
  Hierarchy,
  Data,
  PresentionChart,
} from 'iconsax-react'
import { BrandLockup } from '@/components/branding/BrandLockup'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'

const features = [
  {
    icon: MagicStar,
    title: 'Asisten perencanaan',
    desc: 'Merekomendasikan Survei, Sensus, atau Kompromin berdasarkan kebutuhan Anda — dengan alasan yang merujuk modul BPS.',
  },
  {
    icon: Hierarchy,
    title: 'Alur kerja GSBPM',
    desc: 'Delapan fase GSBPM 5.2 dengan navigasi empat tahap agar mudah diikuti OPD, tanpa membebani istilah teknis.',
  },
  {
    icon: DocumentText,
    title: 'Dokumen siap ditinjau',
    desc: 'Hasilkan draf KAK, checklist, variabel, instrumen, dan metadata dalam satu ekspor Word.',
  },
  {
    icon: ShieldTick,
    title: 'Standar pemerintahan',
    desc: 'Logika bisnis mengikuti Materi Proses Bisnis Statistik BPS. Tidak mengarang prosedur di luar modul resmi.',
  },
]

const steps = [
  'Jelaskan kebutuhan data Anda',
  'Dapatkan rekomendasi jenis kegiatan',
  'Kerjakan checklist per tahap',
  'Unduh draf dokumen perencanaan',
]

const heroStats = [
  { label: 'Fase GSBPM', value: '8' },
  { label: 'Proyek demo OPD', value: '5' },
  { label: 'Jenis kegiatan', value: '3' },
]

export function LandingPage() {
  const navigate = useNavigate()
  const projects = useAppStore((s) => s.projects)
  const loadDemoData = useAppStore((s) => s.loadDemoData)
  const recent = projects.slice(0, 3)

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[560px] w-[980px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(245,200,66,0.22),transparent_60%)]" />
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-ink-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-size-[48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <BrandLockup size="md" inverted />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden border border-white/10 text-white hover:bg-white/10 sm:inline-flex"
            onClick={() => navigate('/app/presentation')}
          >
            Mode presentasi
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="border-white/15 bg-white/10 text-white hover:bg-white/15"
            onClick={() => navigate('/app')}
          >
            Masuk beranda
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/10 px-3.5 py-1.5 text-xs font-medium text-gold-400 shadow-(--shadow-glow)">
            <MagicStar size={14} variant="Bold" color="currentColor" />
            Platform perencanaan statistik sektoral
          </div>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            StatPlan
          </h1>
          <p className="mt-3 text-base font-medium text-gold-400/90">
            BPS Kabupaten Lombok Tengah
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
            Dari ide kebutuhan data hingga draf dokumen perencanaan — dipandu kerangka GSBPM,
            tanpa membuat OPD tenggelam dalam jargon.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              variant="gold"
              size="lg"
              rightIcon={<ArrowRight2 size={18} variant="Bold" color="currentColor" />}
              onClick={() => {
                if (projects.length === 0) loadDemoData()
                navigate('/app')
              }}
            >
              Mulai cepat — buka demo
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="border border-white/10 text-white hover:bg-white/10"
              onClick={() => navigate('/app/new')}
            >
              Mulai proyek baru
            </Button>
          </div>
          <p className="mt-3 max-w-md text-xs text-white/45">
            “Mulai cepat” memuat 5 proyek contoh bila ruang kerja masih kosong. “Masuk beranda”
            membuka ringkasan tanpa mengubah data Anda.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur-sm"
              >
                <div className="font-display text-2xl font-semibold text-gold-400">{s.value}</div>
                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-white/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {steps.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 px-3.5 py-3 text-sm text-white/75 backdrop-blur-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-400 ring-1 ring-gold-500/25">
                  {i + 1}
                </span>
                {s}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="float-soft rounded-[1.75rem] border border-white/12 bg-white/6 p-6 shadow-(--shadow-lift) backdrop-blur-xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Pratinjau alur kerja · ilustrasi
            </div>
            <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-gold-400 ring-1 ring-gold-500/20">
              GSBPM 5.2
            </span>
          </div>
          <div className="space-y-3">
            {['Perencanaan', 'Pengumpulan', 'Pemeriksaan', 'Penyebarluasan'].map((stage, i) => (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="rounded-2xl border border-white/10 bg-ink-900/55 p-4"
              >
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-sm font-medium">{stage}</span>
                  <span className="text-xs font-semibold text-gold-400">
                    {[72, 48, 31, 18][i]}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-700"
                    style={{ width: `${[72, 48, 31, 18][i]}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-white/50">
            <TickCircle size={16} variant="Bold" color="#F5C842" />
            Kerangka proses: GSBPM 5.2 · Modul BPS
          </div>
        </motion.div>
      </section>

      {recent.length > 0 ? (
        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Proyek terkini di perangkat ini
            </h2>
            <button
              type="button"
              className="text-xs text-gold-400 hover:text-gold-300"
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
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-gold-500/30 hover:bg-white/8"
              >
                <div className="text-sm font-semibold text-white line-clamp-2">{p.name}</div>
                <div className="mt-2 text-[11px] text-white/45">
                  {p.rekomendasiBps.penyelenggara || 'OPD'}
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="relative z-10 border-t border-white/10 bg-gradient-to-b from-white to-ink-50 text-ink-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Dibangun untuk produktivitas OPD
              </h2>
              <p className="mt-3 text-ink-700">
                Bukan sekadar modul pelatihan. Ini workspace perencanaan yang menghasilkan artefak
                kerja nyata — checklist, instrumen, metadata, dan dokumen rekomendasi.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="gold"
                leftIcon={<Data size={16} variant="Bold" color="currentColor" />}
                onClick={() => {
                  loadDemoData()
                  navigate('/app')
                }}
              >
                Muat data demo
              </Button>
              <Button
                variant="secondary"
                leftIcon={<PresentionChart size={16} variant="Bold" color="currentColor" />}
                onClick={() => navigate('/app/presentation')}
              >
                Mode presentasi
              </Button>
            </div>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06 }}
                className="surface-card p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 text-gold-400 shadow-md">
                  <f.icon size={22} variant="Bold" color="currentColor" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-4 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} BPS Kabupaten Lombok Tengah · StatPlan · Draf perencanaan,
        bukan pengesahan resmi
      </footer>
    </div>
  )
}
