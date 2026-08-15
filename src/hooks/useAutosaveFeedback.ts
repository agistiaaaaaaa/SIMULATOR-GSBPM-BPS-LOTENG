import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from '@/store/toastStore'

export type SavePhase = 'idle' | 'saving' | 'saved'

/**
 * Lightweight autosave UX: brief "Menyimpan…" then "tersimpan",
 * with optional toast. Does not change persistence — store already autosaves.
 */
export function useAutosaveFeedback(successMessage = 'Perubahan berhasil disimpan') {
  const [phase, setPhase] = useState<SavePhase>('idle')
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const markSaving = useCallback(() => {
    clearTimers()
    setPhase('saving')
  }, [clearTimers])

  const markSaved = useCallback(
    (opts?: { silent?: boolean; message?: string }) => {
      clearTimers()
      setPhase('saving')
      const t1 = window.setTimeout(() => {
        setPhase('saved')
        if (!opts?.silent) {
          toast(opts?.message ?? successMessage)
        }
      }, 280)
      const t2 = window.setTimeout(() => setPhase('idle'), 2200)
      timers.current = [t1, t2]
    },
    [clearTimers, successMessage],
  )

  /** Call on blur / discrete edits — shows Menyimpan then saved. */
  const notifySaved = useCallback(
    (message?: string) => {
      markSaved({ message })
    },
    [markSaved],
  )

  return { phase, markSaving, markSaved, notifySaved }
}
