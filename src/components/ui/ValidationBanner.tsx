import { Danger, InfoCircle, ArrowRight2 } from 'iconsax-react'
import type { ValidationIssue } from '@/domain/validation'
import { cn } from '@/lib/utils'

export function ValidationBanner({
  issues,
  className,
  onNavigate,
}: {
  issues: ValidationIssue[]
  className?: string
  /** Jump to the workspace tab named in issue.tab */
  onNavigate?: (tab: string) => void
}) {
  if (issues.length === 0) return null

  const errors = issues.filter((i) => i.severity === 'error')
  const warnings = issues.filter((i) => i.severity === 'warning')

  function renderItem(i: ValidationIssue) {
    const clickable = Boolean(onNavigate && i.tab)
    if (!clickable) {
      return (
        <li key={i.code} className="leading-snug">
          • {i.message}
        </li>
      )
    }
    return (
      <li key={i.code}>
        <button
          type="button"
          className="group flex w-full items-start gap-2 rounded-lg px-1.5 py-1 text-left leading-snug transition hover:bg-white/60 focus-ring"
          onClick={() => onNavigate?.(i.tab!)}
        >
          <span className="flex-1">• {i.message}</span>
          <span className="mt-0.5 inline-flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-ink-600 opacity-70 group-hover:opacity-100">
            Buka
            <ArrowRight2 size={12} variant="Bold" color="currentColor" />
          </span>
        </button>
      </li>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {errors.length > 0 ? (
        <div className="rounded-2xl border border-danger/15 bg-danger-soft/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-danger">
            <Danger size={18} variant="Bold" color="currentColor" />
            Perlu diselesaikan sebelum ekspor
          </div>
          <ul className="space-y-0.5 text-sm text-ink-800">{errors.map(renderItem)}</ul>
        </div>
      ) : null}
      {warnings.length > 0 ? (
        <div className="rounded-2xl border border-warning/15 bg-warning-soft/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-warning">
            <InfoCircle size={18} variant="Bold" color="currentColor" />
            Perhatian
          </div>
          <ul className="space-y-0.5 text-sm text-ink-800">{warnings.map(renderItem)}</ul>
        </div>
      ) : null}
    </div>
  )
}
