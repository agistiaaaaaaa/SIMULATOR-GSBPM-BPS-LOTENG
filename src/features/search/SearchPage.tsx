import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SearchNormal1, DocumentText, Hashtag, ClipboardText, FolderOpen } from 'iconsax-react'
import { useAppStore } from '@/store/appStore'
import { searchWorkspace, type SearchHitKind } from '@/lib/projectMeta'
import { PageHeader } from '@/components/ui/EmptyState'
import { Card, Badge } from '@/components/ui/Badge'
import { Field, Input } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { HelpTip } from '@/components/ui/HelpTip'

const kindLabel: Record<SearchHitKind, string> = {
  project: 'Proyek',
  variable: 'Variabel',
  metadata: 'Metadata',
  questionnaire: 'Kuesioner',
}

const kindTone: Record<SearchHitKind, 'brand' | 'gold' | 'success' | 'neutral'> = {
  project: 'brand',
  variable: 'gold',
  metadata: 'success',
  questionnaire: 'neutral',
}

function highlightMatch(text: string, query: string): ReactNode {
  const q = query.trim()
  if (!q || q.length < 2) return text
  const lower = text.toLowerCase()
  const qLower = q.toLowerCase()
  const nodes: ReactNode[] = []
  let cursor = 0
  let key = 0
  while (cursor < text.length) {
    const idx = lower.indexOf(qLower, cursor)
    if (idx === -1) {
      nodes.push(<span key={key++}>{text.slice(cursor)}</span>)
      break
    }
    if (idx > cursor) {
      nodes.push(<span key={key++}>{text.slice(cursor, idx)}</span>)
    }
    nodes.push(
      <mark key={key++} className="rounded bg-gold-100 px-0.5 text-ink-950">
        {text.slice(idx, idx + q.length)}
      </mark>,
    )
    cursor = idx + q.length
  }
  return nodes
}

export function SearchPage() {
  const navigate = useNavigate()
  const projects = useAppStore((s) => s.projects)
  const [q, setQ] = useState('')
  const hits = useMemo(() => searchWorkspace(projects, q), [projects, q])

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Pencarian cepat"
        title="Cari"
        description="Temukan proyek, variabel, metadata, atau butir kuesioner di seluruh workspace."
        actions={<HelpTip topic="metadata" />}
      />

      <Card className="mb-6">
        <Field helper="Hasil diperbarui saat Anda mengetik. Minimal 2 karakter.">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-600">
              <SearchNormal1 size={18} variant="Bold" color="currentColor" />
            </span>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Contoh: UMKM, IKM, MS-Keg, padi…"
              className="pl-10"
              aria-label="Kata kunci pencarian"
              autoFocus
            />
          </div>
        </Field>
      </Card>

      {q.trim().length < 2 ? (
        <EmptyState
          icon={SearchNormal1}
          title="Mulai pencarian"
          description="Ketik nama OPD, topik, nama variabel, atau cuplikan pertanyaan."
          why="Pencarian membantu reviewer dan OPD menemukan artefak perencanaan tanpa membuka setiap tab."
        />
      ) : hits.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Tidak ada hasil"
          description={`Tidak ditemukan kecocokan untuk “${q.trim()}”.`}
          why="Coba kata kunci lebih pendek, atau muat ulang data demo jika workspace kosong."
          actionLabel="Buka pengaturan demo"
          onAction={() => navigate('/app/settings')}
          secondaryLabel="Ke beranda"
          onSecondary={() => navigate('/app')}
        />
      ) : (
        <ul className="space-y-2">
          {hits.map((h) => (
            <li key={h.id}>
              <Link
                to={h.href}
                className="block rounded-2xl border border-border/80 bg-white/90 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-600/20 hover:shadow-(--shadow-lift)"
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <Badge tone={kindTone[h.kind]}>{kindLabel[h.kind]}</Badge>
                  <span className="text-[11px] text-ink-600">{h.projectName}</span>
                </div>
                <div className="flex items-start gap-2">
                  {h.kind === 'variable' ? (
                    <Hashtag size={16} variant="Bold" color="#0b3a5c" className="mt-0.5" />
                  ) : h.kind === 'metadata' ? (
                    <DocumentText size={16} variant="Bold" color="#0b3a5c" className="mt-0.5" />
                  ) : h.kind === 'questionnaire' ? (
                    <ClipboardText size={16} variant="Bold" color="#0b3a5c" className="mt-0.5" />
                  ) : (
                    <FolderOpen size={16} variant="Bold" color="#0b3a5c" className="mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium text-ink-950">
                      {highlightMatch(h.title, q)}
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-xs text-ink-700">
                      {highlightMatch(h.subtitle, q)}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
