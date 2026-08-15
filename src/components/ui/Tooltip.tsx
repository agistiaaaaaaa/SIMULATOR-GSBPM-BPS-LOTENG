import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Tooltip({
  content,
  children,
  side = 'top',
  className,
}: {
  content: string
  children: ReactNode
  side?: 'top' | 'bottom'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && content ? (
        <span
          id={id}
          role="tooltip"
          className={cn(
            'pointer-events-none absolute left-1/2 z-[60] w-max max-w-[14rem] -translate-x-1/2 rounded-lg bg-ink-950 px-2.5 py-1.5 text-center text-[11px] font-medium leading-snug text-white shadow-lg',
            side === 'top' ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]',
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  )
}
