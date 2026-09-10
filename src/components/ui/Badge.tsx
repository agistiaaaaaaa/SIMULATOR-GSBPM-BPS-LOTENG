import { cn } from '@/lib/utils'

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'gold'
  className?: string
}) {
  const tones = {
    neutral: 'bg-ink-100/90 text-ink-800 ring-1 ring-ink-900/5',
    brand: 'bg-ink-900 text-white shadow-sm',
    success: 'bg-success-soft text-success ring-1 ring-success/10',
    warning: 'bg-warning-soft text-warning ring-1 ring-warning/10',
    gold: 'bg-gold-100 text-ink-900 ring-1 ring-gold-500/20',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function ProgressBar({
  value,
  className,
  label = 'Progres',
  premium,
  delta,
}: {
  value: number
  className?: string
  label?: string
  premium?: boolean
  /** Transient delta shown when progress changes (e.g. +5). */
  delta?: number | null
}) {
  const v = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('relative', className)}>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-ink-100"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out',
            premium ? 'bg-ink-900' : 'bg-ink-800',
          )}
          style={{ width: `${v}%` }}
        />
      </div>
      {typeof delta === 'number' && delta !== 0 ? (
        <span
          key={delta}
          className="pointer-events-none absolute -right-1 -top-5 animate-[fade-up-soft_0.9s_ease-out_forwards] text-[11px] font-semibold text-success"
          aria-live="polite"
        >
          {delta > 0 ? `+${delta}%` : `${delta}%`}
        </span>
      ) : null}
    </div>
  )
}

export function Card({
  children,
  className,
  hover,
  id,
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
  id?: string
}) {
  return (
    <div
      id={id}
      className={cn(
        'surface-card p-5',
        hover &&
          'cursor-default motion-safe:transition-all motion-safe:duration-200 hover:border-ink-600/20 hover:shadow-(--shadow-soft) motion-safe:hover:-translate-y-px',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = 'ink',
  children,
}: {
  label: string
  value: React.ReactNode
  hint?: string
  icon?: React.ReactNode
  accent?: 'ink' | 'gold' | 'success' | 'warning'
  children?: React.ReactNode
}) {
  const accents = {
    ink: 'bg-ink-50 text-ink-900',
    gold: 'bg-gold-100 text-ink-900',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
  }
  return (
    <Card className="flex min-h-[7.5rem] flex-col justify-between p-4 active:scale-[0.995] sm:min-h-[8.75rem] sm:p-5 sm:active:scale-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-600 sm:text-xs">
            {label}
          </div>
          <div className="mt-1.5 font-display text-[1.6rem] font-semibold leading-none tracking-tight text-ink-950 sm:mt-2 sm:text-[1.75rem] sm:text-3xl">
            {value}
          </div>
        </div>
        {icon ? (
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
              accents[accent],
            )}
            aria-hidden
          >
            {icon}
          </div>
        ) : null}
      </div>
      {hint ? <p className="mt-2.5 text-xs leading-relaxed text-ink-600 sm:mt-3">{hint}</p> : null}
      {children ? <div className="mt-2.5 sm:mt-3">{children}</div> : null}
    </Card>
  )
}
