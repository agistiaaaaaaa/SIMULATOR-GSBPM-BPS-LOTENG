import { create } from 'zustand'

export type ToastTone = 'success' | 'info' | 'warning' | 'error'

export interface ToastItem {
  id: string
  message: string
  tone: ToastTone
}

interface ToastState {
  items: ToastItem[]
  push: (message: string, tone?: ToastTone) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (message, tone = 'success') => {
    const id = crypto.randomUUID()
    set((s) => {
      const last = s.items[s.items.length - 1]
      if (last?.message === message && last.tone === tone) {
        return s
      }
      return { items: [...s.items.slice(-4), { id, message, tone }] }
    })
    window.setTimeout(() => {
      set((s) => ({ items: s.items.filter((t) => t.id !== id) }))
    }, 2800)
  },
  dismiss: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}))

export function toast(message: string, tone: ToastTone = 'success') {
  useToastStore.getState().push(message, tone)
}
