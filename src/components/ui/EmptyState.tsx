import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { Icon } from 'iconsax-react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  why,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className,
}: {
  icon: Icon
  title: string
  description: string
  why?: string
  actionLabel?: string
  onAction?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center px-6 py-14 text-center surface-card premium-mesh animate-fade-up',
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-gold-400 shadow-(--shadow-glow)">
        <Icon size={28} variant="Bold" color="currentColor" />
      </div>
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-700">{description}</p>
      {why ? (
        <p className="mt-3 max-w-md rounded-xl bg-ink-50 px-3 py-2 text-xs leading-relaxed text-ink-600">
          {why}
        </p>
      ) : null}
      {(actionLabel || secondaryLabel) && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {actionLabel && onAction ? (
            <Button variant="gold" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
          {secondaryLabel && onSecondary ? (
            <Button variant="secondary" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton-pulse rounded-xl bg-ink-100', className)} aria-hidden />
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          {title}
        </h1>
        {description ? <p className="mt-1.5 max-w-2xl text-ink-700">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export function SectionTitle({
  children,
  hint,
}: {
  children: React.ReactNode
  hint?: React.ReactNode
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-600">{children}</h2>
      {hint}
    </div>
  )
}
