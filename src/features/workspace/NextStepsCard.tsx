import { ArrowRight2, TickCircle, Warning2 } from 'iconsax-react'
import { getProjectNextSteps, type WorkspaceTabId } from '@/content/howToWork'
import type { Project } from '@/domain/types'
import { Card, Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { HelpTip } from '@/components/ui/HelpTip'
import { cn } from '@/lib/utils'

const tabLabel: Record<WorkspaceTabId, string> = {
  workflow: 'Alur kerja',
  checklist: 'Checklist',
  design: 'Perancangan',
  variables: 'Variabel',
  instruments: 'Instrumen',
  timeline: 'Timeline',
  metadata: 'Metadata',
  activity: 'Riwayat',
  export: 'Ekspor',
}

function focusForStep(id: string, tab: WorkspaceTabId): string | undefined {
  if (id === 'portal_sdi') return 'focus-portal'
  if (id === 'rekomendasi_required' || id === 'rekomendasi_form') return 'focus-rekomendasi'
  if (tab === 'checklist' || id === 'checklist_incomplete' || id === 'jenis_undocumented')
    return id === 'jenis_undocumented' ? 'focus-portal' : 'focus-checklist'
  if (tab === 'metadata' || id.startsWith('metadata_')) return 'focus-metadata'
  return 'workspace-tab-panel'
}

export function NextStepsCard({
  project,
  onGoTab,
}: {
  project: Project
  onGoTab: (tab: WorkspaceTabId, focusId?: string) => void
}) {
  const steps = getProjectNextSteps(project)
  const ready = steps.some((s) => s.priority === 'selesai' && s.id === 'export-ready')

  return (
    <Card
      className={cn(
        'mb-6',
        ready
          ? 'border-success/25 bg-success-soft/25'
          : 'border-ink-900/10 bg-gradient-to-br from-ink-50 to-white',
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {ready ? (
            <TickCircle size={18} variant="Bold" color="#0f7b4c" />
          ) : (
            <Warning2 size={18} variant="Bold" color="#0b3a5c" />
          )}
          <h2 className="font-semibold text-ink-950">
            {ready ? 'Siap ekspor — langkah berikutnya' : 'Langkah berikutnya'}
          </h2>
          <HelpTip topic="how_to" />
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onGoTab('export')}
          className="text-xs"
        >
          Lihat semua persyaratan
        </Button>
      </div>
      <p className="mb-3 text-xs text-ink-600">
        {ready
          ? 'Persyaratan wajib sudah terpenuhi. Unduh draf di tab Ekspor.'
          : 'Ini bukan error aplikasi. Tombol di bawah membuka bagian yang harus diisi. Setelah syarat wajib selesai, tombol unduh draf akan aktif.'}
      </p>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li
            key={`${s.id}-${i}`}
            className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-white px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-[10px] font-semibold text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-ink-950">{s.title}</span>
                <Badge
                  tone={
                    s.priority === 'wajib'
                      ? 'warning'
                      : s.priority === 'selesai'
                        ? 'success'
                        : 'gold'
                  }
                >
                  {s.priority === 'wajib'
                    ? 'Wajib'
                    : s.priority === 'selesai'
                      ? 'Siap'
                      : 'Disarankan'}
                </Badge>
              </div>
              <p className="text-xs leading-relaxed text-ink-700">{s.detail}</p>
            </div>
            <Button
              size="sm"
              variant={s.priority === 'wajib' ? 'primary' : 'secondary'}
              rightIcon={<ArrowRight2 size={14} variant="Bold" color="currentColor" />}
              onClick={() => onGoTab(s.tab, focusForStep(s.id, s.tab))}
            >
              Buka {tabLabel[s.tab]}
            </Button>
          </li>
        ))}
      </ol>
    </Card>
  )
}
