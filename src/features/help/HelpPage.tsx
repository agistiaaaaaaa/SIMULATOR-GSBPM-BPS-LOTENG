import { useNavigate } from 'react-router-dom'
import { Book1, ArrowRight2, TickCircle } from 'iconsax-react'
import { Card, Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { HELP_TOPICS } from '@/demo/help'
import { HOW_TO_STEPS } from '@/content/howToWork'

const GLOSSARY_KEYS = [
  'how_to',
  'portal_sdi',
  'gsbpm',
  'checklist',
  'design',
  'sampling',
  'contoh',
  'brainstorm',
  'share',
  'variables',
  'indicators',
  'instruments',
  'metadata',
  'rekomendasi',
  'timeline',
  'activity',
  'export',
] as const

export function HelpPage() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-600">
          Panduan mandiri
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Bantuan</h1>
        <p className="mt-2 text-sm text-ink-700">
          Ikuti langkah di bawah tanpa perlu dipandu. Tombol ⓘ di halaman kerja membuka tip
          singkat yang sama. Semua keluaran berstatus <strong>draf</strong> hingga divalidasi BPS.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => navigate('/app/presentation')}>
            Mode presentasi
          </Button>
          <Button
            size="sm"
            variant="gold"
            rightIcon={<ArrowRight2 size={14} variant="Bold" color="currentColor" aria-hidden />}
            onClick={() => navigate('/app')}
          >
            Ke beranda
          </Button>
        </div>
      </div>

      <Card className="border-ink-900/10 bg-gradient-to-br from-ink-50 to-white">
        <div className="mb-3 flex items-center gap-2">
          <TickCircle size={18} variant="Bold" color="#0b3a5c" />
          <h2 className="font-semibold">Cara mengerjakan proyek (9 langkah)</h2>
        </div>
        <p className="mb-4 text-sm text-ink-700">
          Urutan operasional dari buka proyek sampai unduh draf Word. Di dalam workspace, ikuti
          juga kartu <strong>Langkah berikutnya</strong> yang menyesuaikan status proyek Anda.
        </p>
        <ol className="space-y-3">
          {HOW_TO_STEPS.map((s) => (
            <li
              key={s.step}
              className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm"
            >
              <div className="flex gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[11px] font-semibold text-white">
                  {s.step}
                </span>
                <div className="min-w-0">
                  <div className="font-medium text-ink-950">{s.title}</div>
                  <p className="mt-0.5 text-ink-700">{s.body}</p>
                  <p className="mt-1 text-[11px] font-medium text-ink-600">Lokasi: {s.where}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="pt-2">
        <h2 className="mb-1 font-semibold text-ink-950">Glosarium fitur</h2>
        <p className="mb-3 text-sm text-ink-700">
          Penjelasan singkat tiap konsep. Sama dengan tip ⓘ di halaman kerja.
        </p>
      </div>

      {GLOSSARY_KEYS.map((key) => {
        const topic = HELP_TOPICS[key]
        return (
          <Card key={key} className="transition hover:shadow-(--shadow-lift)">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Book1 size={18} variant="Bold" color="#0b3a5c" />
              <h3 className="font-semibold">{topic.title}</h3>
              {key === 'how_to' ? <Badge tone="gold">Utama</Badge> : null}
            </div>
            <p className="text-sm leading-relaxed text-ink-700">{topic.body}</p>
          </Card>
        )
      })}
    </div>
  )
}
