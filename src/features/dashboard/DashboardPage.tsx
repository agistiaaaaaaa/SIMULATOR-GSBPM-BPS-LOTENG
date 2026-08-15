import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowUp2,
  TickCircle,
  ClipboardText,
  Data,
  FolderOpen,
  Add,
  Refresh2,
  Trash,
  ExportSquare,
  StatusUp,
  DocumentText,
  Clock,
  Activity,
  Calendar,
  Warning2,
  Flash,
  SearchNormal1,
  PresentionChart,
} from 'iconsax-react'
import { buildDashboardBundle } from '@/demo/dashboard'
import { computeProjectProgress } from '@/domain/gsbpm'
import { useAppStore } from '@/store/appStore'
import { toast } from '@/store/toastStore'
import { Badge, Card, ProgressBar, StatCard } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { HelpTip } from '@/components/ui/HelpTip'
import { EmptyState, PageHeader, SectionTitle } from '@/components/ui/EmptyState'
import {
  exportStatusLabel,
  klasifikasiLabel,
  methodLabel,
  projectOpd,
} from '@/lib/projectMeta'
import { formatDate, jenisLabel, statusLabel } from '@/lib/utils'

function relativeDayLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startThat = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = Math.round((startToday.getTime() - startThat.getTime()) / 86400000)
  if (diff === 0) return 'Hari ini'
  if (diff === 1) return 'Kemarin'
  return formatDate(iso)
}

export function DashboardPage() {
  const navigate = useNavigate()
  const projects = useAppStore((s) => s.projects)
  const deleteProject = useAppStore((s) => s.deleteProject)
  const loadDemoData = useAppStore((s) => s.loadDemoData)
  const resetDemo = useAppStore((s) => s.resetDemo)
  const [confirm, setConfirm] = useState<
    null | { kind: 'load' | 'reset' | 'delete'; name?: string; id?: string }
  >(null)

  const bundle = useMemo(() => buildDashboardBundle(projects), [projects])
  const { stats, activities, deadlines, recentlyExported } = bundle

  const needAttention = useMemo(() => {
    return projects
      .map((p) => {
        const progress = computeProjectProgress(
          p.jenisKegiatan,
          p.klasifikasi,
          p.checklistState,
        )
        const reasons: string[] = []
        if (!p.portalSdi.sirusaChecked || !p.portalSdi.romantikChecked) {
          reasons.push('Portal belum lengkap')
        }
        if (p.klasifikasi === 'sektoral' && !p.checklistState['de-12']) {
          reasons.push('Rekomendasi BPS belum dicentang (Design 2.5)')
        }
        if (progress.pct < 80) reasons.push(`Checklist ${progress.pct}%`)
        return { project: p, progress, reasons }
      })
      .filter((x) => x.reasons.length > 0)
      .slice(0, 5)
  }, [projects])

  const distributionMax = Math.max(stats.survei, stats.sensus, stats.kompromin, 1)

  function runConfirm() {
    if (!confirm) return
    if (confirm.kind === 'load') {
      loadDemoData()
      toast('Data demo berhasil dimuat')
    } else if (confirm.kind === 'reset') {
      resetDemo()
      toast('Data demo dikosongkan')
    } else if (confirm.kind === 'delete' && confirm.id) {
      deleteProject(confirm.id)
      toast('Proyek berhasil dihapus')
    }
    setConfirm(null)
  }

  return (
    <div className="pb-20 lg:pb-0">
      <PageHeader
        eyebrow="Ringkasan operasional"
        title="Beranda"
        description="Pantau perencanaan statistik OPD Kabupaten Lombok Tengah — progres, perhatian, dan ekspor."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<SearchNormal1 size={16} variant="Bold" color="currentColor" />}
              onClick={() => navigate('/app/search')}
            >
              Cari
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Data size={16} variant="Bold" color="currentColor" />}
              onClick={() => {
                if (projects.length === 0) {
                  loadDemoData()
                  toast('Data demo berhasil dimuat')
                } else {
                  setConfirm({ kind: 'load' })
                }
              }}
            >
              Muat data demo
            </Button>
            <Button
              leftIcon={<Add size={16} variant="Bold" color="currentColor" />}
              onClick={() => navigate('/app/new')}
            >
              Proyek baru
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total proyek"
          value={stats.total}
          icon={<FolderOpen size={22} variant="Bold" color="currentColor" />}
          accent="ink"
        />
        <StatCard
          label="Selesai / siap tinjau"
          value={stats.readyForReview}
          hint={`${stats.inProgress} berjalan · ${stats.draft} draf`}
          icon={<TickCircle size={22} variant="Bold" color="currentColor" />}
          accent="success"
        />
        <StatCard
          label="Rata-rata penyelesaian"
          value={`${stats.averageCompletion}%`}
          hint={`${stats.exportReadyApprox} perkiraan siap ekspor`}
          icon={<StatusUp size={22} variant="Bold" color="currentColor" />}
          accent="gold"
        >
          <ProgressBar value={stats.averageCompletion} premium label="Rata-rata progres" />
        </StatCard>
        <StatCard
          label="Perlu rekomendasi BPS"
          value={stats.needRecommendation}
          hint="Sektoral belum centang Design 2.5"
          icon={<DocumentText size={22} variant="Bold" color="currentColor" />}
          accent="warning"
        />
      </div>

      <Card className="mb-6 border-ink-900/10 bg-gradient-to-br from-ink-50 via-white to-gold-100/30">
        <SectionTitle hint={<HelpTip topic="gsbpm" />}>Aksi cepat</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Proyek baru', to: '/app/new', icon: Add },
            { label: 'Asisten', to: '/app/assistant', icon: Flash },
            { label: 'Mode presentasi', to: '/app/presentation', icon: PresentionChart },
            { label: 'Cari', to: '/app/search', icon: SearchNormal1 },
            { label: 'Bantuan', to: '/app/help', icon: DocumentText },
          ].map((a) => (
            <Button
              key={a.to}
              size="sm"
              variant="secondary"
              leftIcon={<a.icon size={14} variant="Bold" color="currentColor" />}
              onClick={() => navigate(a.to)}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionTitle>Distribusi jenis kegiatan</SectionTitle>
          <div className="space-y-3">
            {[
              { label: 'Survei', value: stats.survei, icon: ClipboardText, color: 'bg-ink-900' },
              { label: 'Sensus', value: stats.sensus, icon: TickCircle, color: 'bg-gold-500' },
              { label: 'Kompromin', value: stats.kompromin, icon: Data, color: 'bg-success' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <item.icon size={16} variant="Bold" color="#0b3a5c" />
                    {item.label}
                  </span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${(item.value / distributionMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle hint={<HelpTip topic="rekomendasi" />}>Perlu perhatian</SectionTitle>
          <ul className="space-y-2">
            {needAttention.length === 0 ? (
              <li className="rounded-xl bg-success-soft px-3 py-2 text-sm text-success">
                Tidak ada isu kritis pada proyek aktif.
              </li>
            ) : (
              needAttention.map(({ project, reasons }) => (
                <li key={project.id}>
                  <Link
                    to={`/app/projects/${project.id}`}
                    className="flex items-start gap-2 rounded-xl px-2 py-2 transition hover:bg-warning-soft/60"
                  >
                    <Warning2 size={16} variant="Bold" color="#b45309" className="mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-ink-950">{project.name}</div>
                      <div className="text-xs text-warning">{reasons.join(' · ')}</div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Card>

        <Card>
          <SectionTitle hint={<HelpTip topic="export" />}>Ekspor terbaru / siap tinjau</SectionTitle>
          <ul className="space-y-2">
            {recentlyExported.length === 0 ? (
              <li className="text-sm text-ink-600">Belum ada proyek berstatus siap tinjau.</li>
            ) : (
              recentlyExported.map((r) => (
                <li key={r.projectId}>
                  <Link
                    to={`/app/projects/${r.projectId}`}
                    className="flex items-start justify-between gap-2 rounded-xl px-2 py-2 transition hover:bg-ink-50"
                  >
                    <span className="inline-flex items-start gap-2 text-sm font-medium">
                      <ExportSquare size={14} variant="Bold" color="#0b3a5c" className="mt-0.5" />
                      {r.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-ink-600">{formatDate(r.at)}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <Activity size={16} variant="Bold" color="#0b3a5c" />
              Aktivitas terbaru
            </span>
          </SectionTitle>
          <ul className="space-y-3">
            {activities.slice(0, 7).map((a) => (
              <li key={a.id} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-600">
                  {relativeDayLabel(a.at)}
                </div>
                <div className="mt-0.5 text-sm font-medium text-ink-950">{a.action}</div>
                <div className="text-xs text-ink-700">{a.detail}</div>
                {a.projectName ? (
                  <div className="mt-1 text-[11px] text-ink-600">{a.projectName}</div>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <Calendar size={16} variant="Bold" color="#0b3a5c" />
              Tugas & tenggat mendatang
            </span>
          </SectionTitle>
          <ul className="space-y-3">
            {deadlines.map((d) => (
              <li key={d.projectId}>
                <Link
                  to={`/app/projects/${d.projectId}`}
                  className="flex items-start gap-2 rounded-xl px-2 py-2 transition hover:bg-ink-50"
                >
                  <Clock size={16} variant="Bold" color="#0b3a5c" className="mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-ink-950">{d.projectName}</div>
                    <div className="text-xs text-ink-700">
                      {d.phaseTitle} · target minggu {d.weekEnd}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Belum ada proyek perencanaan"
          description="Muat data demo untuk demonstrasi kepada BPS, atau buat proyek baru dari kebutuhan OPD Anda."
          why="Beranda yang terisi membantu reviewer melihat alur GSBPM, metadata, dan ekspor secara langsung."
          actionLabel="Muat data demo"
          onAction={() => {
            loadDemoData()
            toast('Data demo berhasil dimuat')
          }}
          secondaryLabel="Buat proyek pertama"
          onSecondary={() => navigate('/app/new')}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-950">Daftar proyek</h2>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Refresh2 size={14} variant="Bold" color="currentColor" />}
              onClick={() => setConfirm({ kind: 'reset' })}
            >
              Kosongkan data demo
            </Button>
          </div>
          <div className="grid gap-4">
            {projects.map((project, idx) => {
              const progress = computeProjectProgress(
                project.jenisKegiatan,
                project.klasifikasi,
                project.checklistState,
              )
              const celebrate = progress.pct >= 95
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={celebrate ? 'animate-celebrate' : undefined}
                >
                  <Card hover className="overflow-hidden p-0">
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2.5 flex flex-wrap items-center gap-2">
                          <Badge tone="brand">{jenisLabel(project.jenisKegiatan)}</Badge>
                          <Badge>{statusLabel(project.status)}</Badge>
                          <Badge tone="gold">{klasifikasiLabel(project.klasifikasi)}</Badge>
                          {progress.pct >= 80 ? (
                            <Badge tone="success">
                              <span className="inline-flex items-center gap-1">
                                <ExportSquare size={12} variant="Bold" color="currentColor" />
                                Hampir siap ekspor
                              </span>
                            </Badge>
                          ) : null}
                        </div>
                        <Link
                          to={`/app/projects/${project.id}`}
                          className="group inline-flex items-center gap-2 text-lg font-semibold text-ink-950 hover:text-ink-800"
                        >
                          {project.name}
                          <span className="inline-flex rotate-45 opacity-0 transition group-hover:opacity-100">
                            <ArrowUp2 size={16} variant="Bold" color="currentColor" />
                          </span>
                        </Link>
                        <p className="mt-1 text-xs font-medium text-ink-600">{projectOpd(project)}</p>
                        <p className="mt-1 text-xs text-ink-600">
                          Metode: {methodLabel(project)} · Ekspor: {exportStatusLabel(project)}
                        </p>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-700">
                          {project.description}
                        </p>
                        <div className="mt-4 max-w-md">
                          <div className="mb-1.5 flex justify-between text-xs text-ink-600">
                            <span>Penyelesaian checklist wajib</span>
                            <span className="font-semibold text-ink-900">
                              {progress.done}/{progress.total} · {progress.pct}%
                            </span>
                          </div>
                          <ProgressBar
                            value={progress.pct}
                            premium={progress.pct >= 80}
                            label={`Progres ${project.name}`}
                          />
                        </div>
                        <div className="mt-3 text-xs text-ink-600/70">
                          Diperbarui {formatDate(project.updatedAt)}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/app/projects/${project.id}`)}
                        >
                          Buka
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Hapus proyek"
                          tooltip="Hapus proyek"
                          onClick={() =>
                            setConfirm({
                              kind: 'delete',
                              id: project.id,
                              name: project.name,
                            })
                          }
                        >
                          <Trash size={18} variant="Bold" color="#b91c1c" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm?.kind === 'load'}
        title="Muat ulang data demo?"
        description="Proyek saat ini akan diganti dengan 5 proyek contoh OPD Kabupaten Lombok Tengah."
        confirmLabel="Muat data demo"
        cancelLabel="Batalkan"
        onCancel={() => setConfirm(null)}
        onConfirm={runConfirm}
      />
      <ConfirmDialog
        open={confirm?.kind === 'reset'}
        title="Kosongkan data demo?"
        description="Semua proyek pada perangkat ini akan dihapus. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Kosongkan"
        cancelLabel="Batalkan"
        danger
        onCancel={() => setConfirm(null)}
        onConfirm={runConfirm}
      />
      <ConfirmDialog
        open={confirm?.kind === 'delete'}
        title="Hapus proyek?"
        description={`Apakah Anda yakin ingin menghapus proyek “${confirm?.name ?? ''}”?`}
        confirmLabel="Hapus"
        cancelLabel="Batalkan"
        danger
        onCancel={() => setConfirm(null)}
        onConfirm={runConfirm}
      />
    </div>
  )
}
