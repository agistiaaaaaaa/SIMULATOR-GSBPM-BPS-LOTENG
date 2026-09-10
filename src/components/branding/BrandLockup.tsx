/**
 * Branding lockup: institutional identity (BPS) + product identity (StatPlan).
 * Product mark: AI-generated premium mark in /branding/statplan-logo.png
 */
import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg'

const sizes: Record<Size, { mark: string; product: string; gap: string }> = {
  sm: { mark: 'h-8', product: 'h-8 w-8', gap: 'gap-2' },
  md: { mark: 'h-10', product: 'h-10 w-10', gap: 'gap-3' },
  lg: { mark: 'h-12', product: 'h-12 w-12', gap: 'gap-3.5' },
}

const STATPLAN_MARK = `${import.meta.env.BASE_URL}branding/statplan-logo.png`

export function BrandLockup({
  size = 'md',
  className,
  inverted,
  showDivider = true,
  compact,
}: {
  size?: Size
  className?: string
  inverted?: boolean
  showDivider?: boolean
  /** Mobile-friendly: hide institutional wordmark, keep logos + product name */
  compact?: boolean
}) {
  const s = sizes[size]

  return (
    <div className={cn('flex min-w-0 items-center', s.gap, className)}>
      <div className={cn('flex items-center gap-2', s.mark)}>
        <img
          src={`${import.meta.env.BASE_URL}branding/bps-logo.svg`}
          alt=""
          aria-hidden
          className="h-full w-auto shrink-0 object-contain"
        />
        {!compact ? (
          <div className="hidden leading-tight min-[480px]:block">
            <div
              className={cn(
                'whitespace-nowrap text-xs font-semibold',
                inverted ? 'text-white' : 'text-ink-950',
              )}
            >
              Badan Pusat Statistik
            </div>
            <div
              className={cn(
                'whitespace-nowrap text-[11px] leading-snug',
                inverted ? 'text-white/60' : 'text-ink-600',
              )}
            >
              Kabupaten Lombok Tengah
            </div>
          </div>
        ) : null}
      </div>

      {showDivider ? (
        <div
          className={cn(
            'mx-0.5 h-6 w-px shrink-0 sm:mx-1 sm:h-7',
            inverted ? 'bg-white/25' : 'bg-border',
          )}
          aria-hidden
        />
      ) : null}

      <div className="flex min-w-0 items-center gap-2">
        <img
          src={STATPLAN_MARK}
          alt=""
          className={cn(s.product, 'shrink-0 rounded-[22%] shadow-sm ring-1 ring-black/5')}
          aria-hidden
        />
        <div
          className={cn(
            'min-w-0 text-left leading-snug',
            compact ? 'hidden min-[380px]:block' : 'hidden min-[360px]:block',
          )}
        >
          <div
            className={cn(
              'truncate text-sm font-semibold tracking-tight',
              inverted ? 'text-white' : 'text-ink-950',
            )}
          >
            StatPlan
          </div>
          <div
            className={cn(
              'hidden text-[11px] font-medium tracking-wide sm:block',
              inverted ? 'text-white/70' : 'text-ink-600',
            )}
          >
            Perencanaan Statistik
          </div>
        </div>
      </div>
    </div>
  )
}

export function StatPlanMark({ className }: { className?: string }) {
  return (
    <img
      src={STATPLAN_MARK}
      alt="StatPlan"
      className={cn('h-9 w-9 rounded-[22%] shadow-sm ring-1 ring-black/5', className)}
    />
  )
}
