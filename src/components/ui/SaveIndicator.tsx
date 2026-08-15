import { TickCircle } from 'iconsax-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SavePhase } from '@/hooks/useAutosaveFeedback'
import { cn, formatDateTime } from '@/lib/utils'

export function SaveIndicator({
  phase,
  updatedAt,
  className,
}: {
  phase: SavePhase
  updatedAt?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex min-h-6 items-center gap-1.5 text-xs font-medium text-ink-600',
        className,
      )}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        {phase === 'saving' ? (
          <motion.span
            key="saving"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1.5 text-ink-700"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-500" />
            Menyimpan…
          </motion.span>
        ) : phase === 'saved' ? (
          <motion.span
            key="saved"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1 text-success"
          >
            <TickCircle size={14} variant="Bold" color="currentColor" />
            Perubahan berhasil disimpan
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
            Draf tersimpan
            {updatedAt ? (
              <span className="font-normal text-ink-600/70">
                · {formatDateTime(updatedAt)}
              </span>
            ) : null}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
