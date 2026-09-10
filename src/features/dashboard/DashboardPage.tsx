import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
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
  Calendar,
  Warning2,
  SearchNormal1,
} from 'iconsax-react'
import { isDemoProject, isReviewStatusStale } from '@/demo'
import { buildDashboardBundle, planningWeekLabel } from '@/demo/dashboard'
import { computeProjectProgress } from '@/domain/gsbpm'
import { canExport } from '@/domain/validation'
import { useAppStore } from '@/store/appStore'
import { toast } from '@/store/toastStore'
import { Badge, Card, ProgressBar, StatCard } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { HelpTip } from '@/components/ui/HelpTip'
import { EmptyState, PageHeader, SectionTitle } from '@/components/ui/EmptyState'
import {
  buildAttentionItems,
  nextActionForProject,
  sortProjectsForDashboard,
} from '@/lib/projectAttention'
import {
  exportStatusLabel,
  klasifikasiLabel,
  methodLabel,
  projectOpd,
} from '@/lib/projectMeta'
import { formatDate, jenisLabel, statusLabel } from '@/lib/utils'

const demoBadgeClass =
  'bg-ink-50 font-medium text-ink-700 ring-1 ring-dashed ring-ink-900/15'

export function DashboardPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const projects = useAppStore((s) => s.projects)
  const deleteProject = useAppStore((s) => s.deleteProject)
  const loadDemoData = useAppStore((s) => s.loadDemoData)
  const resetDemo = useAppStore((s) => s.resetDemo)
  const demoProjectCount = projects.filter(isDemoProject).length
  const hasDemoProjects = demoProjectCount > 0
  const userProjectCount = projects.length - demoProjectCount
  const [confirm, setConfirm] = useState<
    null | { kind: 'load' | 'reset' | 'delete'; name?: string; id?: string }
  >(null)

  const bundle = useMemo(() => buildDashboardBundle(projects), [projects])
  const { stats, recentlyUpdated, planningWeeks, readyForReviewProjects } = bundle
  const needAttention = useMemo(() => buildAttentionItems(projects), [projects])
  const orderedProjects = useMemo(() => sortProjectsForDashboard(projects), [projects])

  const distributionMax = Math.max(stats.survei, stats.sensus, stats.kompromin, 1)

  function runConfirm() {
    if (!confirm) return
    if (confirm.kind === 'load') {
      loadDemoData()
      toast('Data demo berhasil diperbarui tanpa mengubah proyek Anda')
    } else if (confirm.kind === 'reset') {
      resetDemo()
      toast('Data demo berhasil dibersihkan')
    } else if (confirm.kind === 'delete' && confirm.id) {
      deleteProject(confirm.id)
      toast('Proyek berhasil dihapus')
    }
    setConfirm(null)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Perencanaan kegiatan statistik"
        title="Beranda"
        description="Pantau progres, hal yang perlu dilengkapi, dan kesiapan ekspor draf proyek Anda."
        actions={
          <>
            <Button
              size="md"
              className="w-full sm:w-auto"
              leftIcon={<Add size={16} variant="Bold" color="currentColor" aria-hidden />}
              onClick={() => navigate('/app/new')}
            >
              Proyek baru
            </Button>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                leftIcon={<SearchNormal1 size={16} variant="Bold" color="currentColor" aria-hidden />}
                onClick={() => navigate('/app/search')}
              >
                Cari
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                leftIcon={<Data size={16} variant="Bold" color="currentColor" aria-hidden />}
                onClick={() => {
                  if (!hasDemoProjects) {
                    loadDemoData()
                    toast('Data demo berhasil ditambahkan tanpa mengubah proyek Anda')
                  } else {
                    setConfirm({ kind: 'load' })
                  }
                }}
              >
                {hasDemoProjects ? 'Perbarui demo' : 'Muat demo'}
              </Button>
            </div>
          </>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total proyek"
          value={stats.total}
          hint={`${userProjectCount} proyek Anda · ${demoProjectCount} demo`}
          icon={<FolderOpen size={18} variant="Bold" color="currentColor" />}
          accent="ink"
        />
        <StatCard
          label="Siap ditinjau"
          value={stats.readyForReview}
          hint={
            stats.needsCompletion > 0
              ? `${stats.inProgress} berjalan · ${stats.draft} draf · ${stats.needsCompletion} perlu dilengkapi`
              : `${stats.inProgress} berjalan · ${stats.draft} draf`
          }
          icon={<TickCircle size={18} variant="Bold" color="currentColor" />}
          accent="success"
        />
        <StatCard
          label="Rata-rata penyelesaian"
          value={`${Number.isFinite(stats.averageCompletion) ? stats.averageCompletion : 0}%`}
          hint={`${stats.exportReady} siap diekspor · seluruh workspace${hasDemoProjects ? ' termasuk demo' : ''}`}
          icon={<StatusUp size={18} variant="Bold" color="currentColor" />}
          accent="gold"
        >
          <ProgressBar value={stats.averageCompletion} label="Rata-rata progres" />
        </StatCard>
        <StatCard
          label="Rekomendasi belum ditandai"
          value={stats.recommendationPreparationPending}
          hint="Persiapan pengajuan Design 2.5 · bukan persetujuan BPS"
          icon={<DocumentText size={18} variant="Bold" color="currentColor" />}
          accent="warning"
        />
      </div>

      <div className="mb-10 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <SectionTitle hint={<HelpTip topic="rekomendasi" />}>Perlu perhatian</SectionTitle>
          <ul className="space-y-1.5">
            {needAttention.length === 0 ? (
              <li className="rounded-xl bg-success-soft px-3 py-2.5 text-sm leading-relaxed text-success">
                Tidak ada hal yang perlu ditindaklanjuti.
              </li>
            ) : (
              needAttention.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    className="focus-ring group flex min-h-14 items-start gap-3 rounded-2xl border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-ink-50/80 active:bg-ink-50"
                    aria-label={`${item.projectName}: ${item.action}`}
                  >
                    <Warning2
                      size={18}
                      variant="Bold"
                      color="#b45309"
                      className="mt-0.5 shrink-0"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="min-w-0 break-words text-sm font-semibold text-ink-950">
                          {item.projectName}
                        </span>
                        {item.isDemo ? (
                          <Badge className={demoBadgeClass}>Demo · contoh ilustratif</Badge>
                        ) : null}
                        <Badge tone={item.severity === 'error' ? 'warning' : 'gold'}>
                          {item.severity === 'error' ? 'Wajib' : 'Disarankan'}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-ink-900">{item.action}</div>
                      <div className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-600">
                        {item.description}
                        {item.extraCount > 0
                          ? ` · +${item.extraCount} isu lain di proyek ini`
                          : null}
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle hint={<HelpTip topic="export" />}>Proyek siap ditinjau</SectionTitle>
          <ul className="space-y-1.5">
            {readyForReviewProjects.length === 0 ? (
              <li className="text-sm leading-relaxed text-ink-600">
                Belum ada proyek berstatus siap ditinjau yang masih memenuhi syarat ekspor.
              </li>
            ) : (
              readyForReviewProjects.map((project) => (
                <li key={project.projectId}>
                  <Link
                    to={`/app/projects/${project.projectId}`}
                    className="focus-ring flex min-h-12 items-start justify-between gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-ink-50 active:bg-ink-50"
                    aria-label={`Buka ${project.name} — siap ditinjau`}
                  >
                    <span className="inline-flex min-w-0 items-start gap-2 text-sm font-medium text-ink-950">
                      <TickCircle
                        size={16}
                        variant="Bold"
                        color="#0f7b4c"
                        className="mt-0.5 shrink-0"
                        aria-hidden
                      />
                      <span className="break-words">{project.name}</span>
                    </span>
                    <span className="shrink-0 pt-0.5 text-xs text-ink-600">
                      {formatDate(project.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Belum ada proyek perencanaan"
          description="Buat proyek dari kebutuhan OPD Anda, atau muat data demo untuk melihat contoh alur GSBPM."
          why="Beranda yang terisi membantu meninjau progres, perhatian, dan kesiapan ekspor draf."
          actionLabel="Buat proyek pertama"
          onAction={() => navigate('/app/new')}
          secondaryLabel="Muat data demo"
          onSecondary={() => {
            loadDemoData()
            toast('Data demo berhasil dimuat')
          }}
        />
      ) : (
        <section className="mb-10" aria-labelledby="daftar-proyek-heading">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="daftar-proyek-heading" className="text-lg font-semibold tracking-tight text-ink-950">
              Daftar proyek
            </h2>
            {hasDemoProjects ? (
              <Button
                variant="ghost"
                size="sm"
                className="self-start sm:self-auto"
                leftIcon={<Refresh2 size={14} variant="Bold" color="currentColor" />}
                onClick={() => setConfirm({ kind: 'reset' })}
              >
                Bersihkan data demo
              </Button>
            ) : null}
          </div>
          <div className="grid gap-3">
            {orderedProjects.map((project, idx) => {
              const progress = computeProjectProgress(
                project.jenisKegiatan,
                project.klasifikasi,
                project.checklistState,
              )
              const exportReady = canExport(project)
              const reviewStatusNeedsCompletion = isReviewStatusStale(project)
              const nextAction = nextActionForProject(project)
              return (
                <motion.div
                  key={project.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.2,
                    delay: reduceMotion ? 0 : Math.min(idx * 0.03, 0.12),
                  }}
                >
                  <Card hover className="overflow-hidden p-0">
                    <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-stretch lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/app/projects/${project.id}`}
                            className="focus-ring min-w-0 rounded-md text-lg font-semibold leading-snug tracking-tight text-ink-950 hover:text-ink-800"
                          >
                            <span className="break-words">{project.name}</span>
                          </Link>
                          {isDemoProject(project) ? (
                            <Badge className={demoBadgeClass}>Demo · contoh ilustratif</Badge>
                          ) : null}
                        </div>
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          <Badge tone="brand">{jenisLabel(project.jenisKegiatan)}</Badge>
                          <Badge tone={reviewStatusNeedsCompletion ? 'warning' : 'neutral'}>
                            {reviewStatusNeedsCompletion
                              ? 'Perlu dilengkapi'
                              : statusLabel(project.status)}
                          </Badge>
                          <Badge tone="gold">{klasifikasiLabel(project.klasifikasi)}</Badge>
                          <Badge tone={exportReady ? 'success' : 'neutral'}>
                            <span className="inline-flex items-center gap-1">
                              <ExportSquare
                                size={12}
                                variant="Bold"
                                color="currentColor"
                                aria-hidden
                              />
                              {exportReady ? 'Siap diekspor' : 'Belum siap diekspor'}
                            </span>
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs font-medium text-ink-600">{projectOpd(project)}</p>
                        <p className="mt-0.5 text-xs text-ink-600">
                          {methodLabel(project)} · {exportStatusLabel(project)}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-700">
                          {project.description}
                        </p>
                        <div className="mt-4 max-w-lg">
                          <div className="mb-1.5 flex justify-between gap-3 text-xs text-ink-600">
                            <span>Penyelesaian checklist wajib</span>
                            <span className="shrink-0 font-semibold text-ink-900">
                              {progress.done}/{progress.total} · {progress.pct}%
                            </span>
                          </div>
                          <ProgressBar
                            value={progress.pct}
                            premium={progress.pct >= 80}
                            label={`Progres ${project.name}`}
                          />
                        </div>
                        <p className="mt-3 text-xs text-ink-600">
                          Terakhir disimpan {formatDate(project.updatedAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col justify-between gap-3 border-t border-border/70 pt-3 lg:w-56 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                        <p className="text-sm leading-relaxed text-ink-800">
                          <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-ink-600">
                            Langkah berikutnya
                          </span>
                          <span className="mt-1 block font-medium text-ink-950">
                            {nextAction.label}
                          </span>
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                            aria-label={`Buka ${project.name}: ${nextAction.label}`}
                            onClick={() => navigate(nextAction.href)}
                          >
                            Buka
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Hapus proyek ${project.name}`}
                            tooltip="Hapus proyek"
                            onClick={() =>
                              setConfirm({
                                kind: 'delete',
                                id: project.id,
                                name: project.name,
                              })
                            }
                          >
                            <Trash size={18} variant="Bold" color="#b91c1c" aria-hidden />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-none">
          <SectionTitle>Distribusi jenis kegiatan</SectionTitle>
          <div className="space-y-3.5">
            {[
              { label: 'Survei', value: stats.survei, icon: ClipboardText },
              { label: 'Sensus', value: stats.sensus, icon: TickCircle },
              { label: 'Kompromin', value: stats.kompromin, icon: Data },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 font-medium text-ink-900">
                    <item.icon size={16} variant="Bold" color="#0b3a5c" aria-hidden />
                    {item.label}
                  </span>
                  <span className="tabular-nums font-semibold text-ink-950">{item.value}</span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-ink-100"
                  role="meter"
                  aria-label={`${item.label}: ${item.value} proyek`}
                  aria-valuenow={item.value}
                  aria-valuemin={0}
                  aria-valuemax={distributionMax}
                >
                  <div
                    className="h-full rounded-full bg-ink-900 motion-safe:transition-[width] motion-safe:duration-500"
                    style={{ width: `${(item.value / distributionMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="shadow-none">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <Clock size={14} variant="Bold" color="currentColor" aria-hidden />
              Proyek yang baru diperbarui
            </span>
          </SectionTitle>
          <ul className="space-y-1">
            {recentlyUpdated.length === 0 ? (
              <li className="text-sm leading-relaxed text-ink-600">
                Belum ada proyek yang tersimpan.
              </li>
            ) : (
              recentlyUpdated.map((item) => {
                const source = projects.find((project) => project.id === item.projectId)
                return (
                  <li key={item.projectId}>
                    <Link
                      to={`/app/projects/${item.projectId}`}
                      className="focus-ring block rounded-xl px-2 py-2 transition-colors hover:bg-ink-50"
                      aria-label={`Buka ${item.projectName}`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="min-w-0 break-words text-sm font-medium text-ink-950">
                          {item.projectName}
                        </span>
                        {source && isDemoProject(source) ? (
                          <Badge className={demoBadgeClass}>Demo · contoh ilustratif</Badge>
                        ) : null}
                      </div>
                      <div className="mt-0.5 text-xs text-ink-600">
                        Terakhir disimpan {formatDate(item.updatedAt)}
                      </div>
                    </Link>
                  </li>
                )
              })
            )}
          </ul>
        </Card>

        <Card className="shadow-none">
          <SectionTitle hint={<HelpTip topic="timeline" />}>
            <span className="inline-flex items-center gap-2">
              <Calendar size={14} variant="Bold" color="currentColor" aria-hidden />
              Rencana minggu GSBPM
            </span>
          </SectionTitle>
          <ul className="space-y-1">
            {planningWeeks.length === 0 ? (
              <li className="text-sm leading-relaxed text-ink-600">
                Belum ada rencana waktu pada proyek aktif.
              </li>
            ) : (
              planningWeeks.map((item) => {
                const source = projects.find((project) => project.id === item.projectId)
                return (
                  <li key={item.projectId}>
                    <Link
                      to={item.href}
                      className="focus-ring flex items-start gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-ink-50"
                      aria-label={`Buka timeline ${item.projectName}: ${planningWeekLabel(item.startWeek, item.endWeek)}`}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="break-words text-sm font-medium text-ink-950">
                            {item.projectName}
                          </span>
                          {source && isDemoProject(source) ? (
                            <Badge className={demoBadgeClass}>Demo · contoh ilustratif</Badge>
                          ) : null}
                        </div>
                        <div className="mt-0.5 text-xs text-ink-700">
                          {item.phaseTitle} · {planningWeekLabel(item.startWeek, item.endWeek)}
                        </div>
                        {item.planTitle && item.planTitle !== item.phaseTitle ? (
                          <div className="text-xs text-ink-600">{item.planTitle}</div>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                )
              })
            )}
          </ul>
        </Card>
      </div>

      <ConfirmDialog
        open={confirm?.kind === 'load'}
        title="Perbarui data demo?"
        description="Proyek contoh akan diperbarui ke versi terbaru. Proyek yang Anda buat sendiri tidak akan diubah atau dihapus."
        confirmLabel="Perbarui data demo"
        cancelLabel="Batalkan"
        onCancel={() => setConfirm(null)}
        onConfirm={runConfirm}
      />
      <ConfirmDialog
        open={confirm?.kind === 'reset'}
        title="Bersihkan data demo?"
        description="Proyek contoh akan dihapus. Proyek yang Anda buat sendiri tidak akan terpengaruh. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Bersihkan data demo"
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
