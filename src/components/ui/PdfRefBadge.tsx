import { Book1 } from 'iconsax-react'
import { cn } from '@/lib/utils'

export function PdfRefBadge({
  ref: pdfRef,
  className,
}: {
  ref: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg bg-ink-100/90 px-2 py-0.5 text-[11px] font-medium text-ink-700 ring-1 ring-ink-900/5',
        className,
      )}
      title="Rujukan Materi Proses Bisnis Statistik (GSBPM 5.2)"
    >
      <Book1 size={12} variant="Bold" color="currentColor" />
      {pdfRef}
    </span>
  )
}
