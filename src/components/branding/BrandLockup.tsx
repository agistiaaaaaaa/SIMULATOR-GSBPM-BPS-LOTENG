/**
 * Branding lockup: institutional identity (BPS) + product identity (StatPlan).
 * Does not redraw the official BPS Garuda logo.
 * Place official asset at /branding/bps-logo.png to enable the official mark.
 */
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg'

const sizes: Record<Size, { mark: string; product: string; gap: string }> = {
  sm: { mark: 'h-8', product: 'h-8 w-8', gap: 'gap-2.5' },
  md: { mark: 'h-10', product: 'h-10 w-10', gap: 'gap-3' },
  lg: { mark: 'h-12', product: 'h-12 w-12', gap: 'gap-3.5' },
}

function InstitutionalMark({
  size,
  inverted,
}: {
  size: Size
  inverted?: boolean
}) {
  const s = sizes[size]
  const [officialReady, setOfficialReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (!cancelled) setOfficialReady(true)
    }
    img.onerror = () => {
      if (!cancelled) setOfficialReady(false)
    }
    img.src = `${import.meta.env.BASE_URL}branding/bps-logo.png`
    return () => {
      cancelled = true
    }
  }, [])

  if (officialReady) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}branding/bps-logo.png`}
        alt="Badan Pusat Statistik"
        className={cn(s.mark, 'w-auto max-w-[7rem] object-contain')}
      />
    )
  }

  return (
    <div className={cn('flex items-center gap-2', s.mark)}>
      <div
        className={cn(
          'flex aspect-square h-full items-center justify-center rounded-lg text-[10px] font-bold tracking-wide',
          inverted ? 'bg-gold-500 text-ink-950' : 'bg-ink-900 text-gold-500',
        )}
      >
        BPS
      </div>
      <div className="hidden leading-tight min-[420px]:block">
        <div
          className={cn(
            'text-xs font-semibold',
            inverted ? 'text-white' : 'text-ink-950',
          )}
        >
          Badan Pusat Statistik
        </div>
        <div className={cn('text-[10px]', inverted ? 'text-white/55' : 'text-ink-600')}>
          Kab. Lombok Tengah
        </div>
      </div>
    </div>
  )
}

export function BrandLockup({
  size = 'md',
  className,
  inverted,
  showDivider = true,
}: {
  size?: Size
  className?: string
  inverted?: boolean
  showDivider?: boolean
}) {
  const s = sizes[size]

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <InstitutionalMark size={size} inverted={inverted} />

      {showDivider ? (
        <div
          className={cn(
            'h-7 w-px shrink-0 sm:h-8',
            inverted ? 'bg-white/25' : 'bg-border-strong',
          )}
          aria-hidden
        />
      ) : null}

      <div className="flex items-center gap-2">
        <img
          src={`${import.meta.env.BASE_URL}branding/statplan-logo.svg`}
          alt=""
          className={cn(s.product, 'shrink-0')}
          aria-hidden
        />
        <div className="text-left leading-tight">
          <div
            className={cn(
              'text-sm font-semibold tracking-tight',
              inverted ? 'text-white' : 'text-ink-950',
            )}
          >
            StatPlan
          </div>
          <div
            className={cn(
              'hidden text-[11px] sm:block',
              inverted ? 'text-white/55' : 'text-ink-600/70',
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
      src={`${import.meta.env.BASE_URL}branding/statplan-logo.svg`}
      alt="StatPlan"
      className={cn('h-9 w-9', className)}
    />
  )
}
