import { useToastStore, type ToastTone } from '@/store/toastStore'
import { Danger, InfoCircle, TickCircle, Warning2 } from 'iconsax-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const toneUi: Record<
  ToastTone,
  { icon: typeof TickCircle; border: string; color: string }
> = {
  success: { icon: TickCircle, border: 'border-success/20', color: '#0f7b4c' },
  info: { icon: InfoCircle, border: 'border-ink-900/10', color: '#0b3a5c' },
  warning: { icon: Warning2, border: 'border-warning/25', color: '#b45309' },
  error: { icon: Danger, border: 'border-danger/25', color: '#b91c1c' },
}

export function ToastHost() {
  const items = useToastStore((s) => s.items)
  const dismiss = useToastStore((s) => s.dismiss)
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="pointer-events-none fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-3 z-[90] flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-2 sm:right-4 xl:bottom-6"
      aria-live="polite"
    >
      <AnimatePresence>
        {items.map((t) => {
          const ui = toneUi[t.tone]
          const Icon = ui.icon
          return (
            <motion.div
              key={t.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className={`pointer-events-auto flex items-start gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 shadow-(--shadow-lift) ${ui.border}`}
              role="status"
            >
              <Icon size={18} variant="Bold" color={ui.color} />
              <span className="mt-0.5 flex-1 leading-snug">{t.message}</span>
              <button
                type="button"
                className="rounded text-xs text-ink-600 hover:text-ink-950 focus-ring"
                onClick={() => dismiss(t.id)}
                aria-label="Tutup notifikasi"
              >
                Tutup
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
