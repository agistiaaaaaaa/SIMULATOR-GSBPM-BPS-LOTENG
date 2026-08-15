import { Book1 } from 'iconsax-react'
import { useMemo, useState } from 'react'
import { buildRichContohFase, cariContohTopik, catatanJenis } from '@/content/contohTopik'
import type { GsbpmPhaseId, JenisKegiatan } from '@/domain/types'
import { Badge, Card } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { HelpTip } from '@/components/ui/HelpTip'

/**
 * Illustration panel per topic + current GSBPM phase (README ContohPanel).
 * Shows per-activity illustrations for the active phase.
 */
export function ContohPanel({
  topik,
  phaseId,
  jenisKegiatan,
}: {
  topik: string
  phaseId: GsbpmPhaseId
  jenisKegiatan: JenisKegiatan
}) {
  const pack = cariContohTopik(topik)
  const fase = useMemo(
    () => buildRichContohFase(topik, phaseId, jenisKegiatan),
    [topik, phaseId, jenisKegiatan],
  )
  const [expanded, setExpanded] = useState(false)

  if (!fase) return null

  const visible = expanded ? fase.aktivitas : fase.aktivitas.slice(0, 6)

  return (
    <Card className="border-gold-500/20 bg-gradient-to-br from-gold-100/35 to-white">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Book1 size={18} variant="Bold" color="#0b3a5c" />
        <h3 className="font-semibold text-ink-950">Contoh ilustrasi</h3>
        <Badge tone="gold">{pack.label}</Badge>
        <Badge tone="neutral">{fase.aktivitas.length} butir</Badge>
        <HelpTip topic="contoh" />
      </div>
      <p className="mb-3 text-xs text-ink-600">
        Ilustrasi per aktivitas/checklist pada fase ini (template deterministik, bukan AI generatif).
        Bukan kutipan standar resmi BPS — sesuaikan dengan konteks OPD Anda.
      </p>
      <p className="text-sm font-medium text-ink-900">{fase.ringkas}</p>
      <ul className="mt-3 space-y-2">
        {visible.map((a) => (
          <li
            key={a.label + a.contoh.slice(0, 24)}
            className="rounded-xl border border-border/80 bg-white px-3 py-2 text-sm"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-600">
              {a.label}
            </div>
            <p className="mt-0.5 text-ink-800">{a.contoh}</p>
          </li>
        ))}
      </ul>
      {fase.aktivitas.length > 6 ? (
        <Button
          className="mt-3"
          size="sm"
          variant="secondary"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Tampilkan lebih sedikit' : `Lihat semua (${fase.aktivitas.length})`}
        </Button>
      ) : null}
      {fase.outputContoh ? (
        <p className="mt-3 text-xs text-ink-700">
          <span className="font-semibold">Contoh keluaran fase:</span> {fase.outputContoh}
        </p>
      ) : null}
      <p className="mt-3 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-700">
        {catatanJenis(jenisKegiatan)}
      </p>
    </Card>
  )
}
