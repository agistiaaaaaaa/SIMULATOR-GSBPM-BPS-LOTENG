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
        className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100/90"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            premium ? 'shimmer-bar' : 'bg-gradient-to-r from-ink-900 via-ink-700 to-ink-600',
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
          'cursor-default transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-600/20 hover:shadow-(--shadow-lift)',
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
    ink: 'from-ink-900/10 to-transparent text-ink-900',
    gold: 'from-gold-500/20 to-transparent text-ink-900',
    success: 'from-success/15 to-transparent text-success',
    warning: 'from-warning/15 to-transparent text-warning',
  }
  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-80',
          accents[accent],
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-600/70">
            {label}
          </div>
          <div className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-950">
            {value}
          </div>
          {hint ? <p className="mt-1 text-xs text-ink-600">{hint}</p> : null}
        </div>
        {icon ? (
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br',
              accents[accent],
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
      {children ? <div className="relative mt-3">{children}</div> : null}
    </Card>
  )
}
