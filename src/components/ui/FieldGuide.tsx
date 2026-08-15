import {
  useEffect,
  useId,
  useRef,
  useState,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { InfoCircle, TickCircle } from 'iconsax-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GuidedFieldSpec } from '@/content/fieldGuides'
import { cn } from '@/lib/utils'

function isRequiredHint(hint?: string) {
  return hint === 'Wajib'
}

/** Muted example under the input — supports, does not compete. */
function ExampleLine({ examples }: { examples: string[] }) {
  const text =
    examples.length === 1 ? examples[0] : examples.slice(0, 3).join(' · ')
  return (
    <p className="text-[11px] leading-tight text-ink-600/55">
      <span className="text-ink-600/45">Misal:</span> {text}
    </p>
  )
}

/** ⓘ Cara Mengisi — popover on demand, ≤4 lines. */
function FillHelpPopover({ spec }: { spec: GuidedFieldSpec }) {
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const contohShort = spec.examples.slice(0, 3).join(' · ')

  return (
    <span ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-ink-500/70 transition hover:bg-ink-100 hover:text-ink-800 focus-ring"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Cara mengisi: ${spec.label}`}
        onMouseEnter={() => setHint(true)}
        onMouseLeave={() => setHint(false)}
        onFocus={() => setHint(true)}
        onBlur={() => setHint(false)}
        onClick={(e) => {
          e.preventDefault()
          setOpen((v) => !v)
        }}
      >
        <InfoCircle size={13} variant="Bold" color="currentColor" />
      </button>

      <AnimatePresence>
        {hint && !open ? (
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute bottom-[calc(100%+4px)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-950 px-2 py-1 text-[10px] font-medium text-white shadow-md"
            role="tooltip"
          >
            Cara mengisi
          </motion.span>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label={`Cara mengisi ${spec.label}`}
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-6 z-50 w-56 rounded-xl border border-border bg-white p-2.5 text-left shadow-(--shadow-lift)"
          >
            <p className="mb-1 text-[11px] font-semibold text-ink-900">Cara mengisi</p>
            <p className="mb-1 text-[11px] leading-snug text-ink-700">
              <span className="text-ink-500">Misal</span> · {contohShort}
            </p>
            <p className="mb-1 text-[11px] leading-snug text-ink-700">{spec.tips}</p>
            <p className="text-[10px] text-ink-500">{spec.gsbpm}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </span>
  )
}

/**
 * Hierarchy: Input (primary) → Label (secondary) → Misal (muted) → Counter.
 * Guide only via ⓘ.
 */
export function GuidedField({
  spec,
  children,
  className,
  error,
  success,
  counter,
  maxLength,
}: {
  spec: GuidedFieldSpec
  children: ReactNode
  className?: string
  error?: string
  success?: boolean
  counter?: number
  maxLength?: number
  defaultGuideOpen?: boolean
}) {
  const required = isRequiredHint(spec.hint)

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<{ className?: string }>, {
        className: cn(
          (children as ReactElement<{ className?: string }>).props.className,
          'h-12 text-[15px] font-medium tracking-tight',
        ),
      })
    : children

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center gap-1">
        <label className="text-[12px] font-medium leading-none text-ink-600">
          {spec.label}
          {required ? (
            <span className="ml-0.5 text-danger" aria-label="Wajib">
              *
            </span>
          ) : null}
        </label>
        {success ? (
          <TickCircle
            size={12}
            variant="Bold"
            color="#0f7b4c"
            className="opacity-50"
            aria-label="Kolom valid"
          />
        ) : null}
        <FillHelpPopover spec={spec} />
      </div>

      {control}

      <div className="flex items-start justify-between gap-3 min-h-[1rem]">
        <div className="min-w-0 flex-1 space-y-0.5">
          {error ? (
            <p className="text-[11px] text-danger" role="alert">
              {error}
            </p>
          ) : (
            <ExampleLine examples={[...spec.examples]} />
          )}
        </div>
        {typeof counter === 'number' && maxLength ? (
          <span
            className={cn(
              'shrink-0 pt-0.5 text-[10px] tabular-nums text-ink-600/40',
              counter > maxLength && 'text-danger/80',
            )}
          >
            {counter}/{maxLength}
          </span>
        ) : typeof counter === 'number' ? (
          <span className="shrink-0 pt-0.5 text-[10px] tabular-nums text-ink-600/40">
            {counter}
          </span>
        ) : null}
      </div>
    </div>
  )
}
