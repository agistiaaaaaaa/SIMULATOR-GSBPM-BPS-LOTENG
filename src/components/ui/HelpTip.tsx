import { InfoCircle } from 'iconsax-react'
import { useId, useState } from 'react'
import { HELP_TOPICS, type HelpTopicId } from '@/demo/help'
import { cn } from '@/lib/utils'

export function HelpTip({
  topic,
  className,
}: {
  topic: HelpTopicId
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const content = HELP_TOPICS[topic]

  return (
    <span className={cn('relative inline-flex', className)}>
      <button
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 focus-ring"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Bantuan: ${content.title}`}
        onClick={() => setOpen((v) => !v)}
      >
        <InfoCircle size={16} variant="Bold" color="currentColor" />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            aria-label="Tutup bantuan"
            onClick={() => setOpen(false)}
          />
          <span
            id={id}
            role="tooltip"
            className="absolute left-0 top-8 z-50 w-72 rounded-xl border border-border bg-white p-3 text-left text-xs leading-relaxed text-ink-800 shadow-(--shadow-lift)"
          >
            <span className="mb-1 block font-semibold text-ink-950">{content.title}</span>
            {content.body}
          </span>
        </>
      ) : null}
    </span>
  )
}
