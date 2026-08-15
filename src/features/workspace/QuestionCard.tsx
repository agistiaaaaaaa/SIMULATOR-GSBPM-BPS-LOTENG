import { useEffect, useRef, useState } from 'react'
import { Copy, Trash } from 'iconsax-react'
import type { QuestionnaireItem } from '@/domain/types'
import { QUESTION_FIELD_GUIDES } from '@/content/fieldGuides'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Field'
import { GuidedField } from '@/components/ui/FieldGuide'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { cn } from '@/lib/utils'
import { toast } from '@/store/toastStore'

export function QuestionCard({
  item,
  autoFocus,
  onChange,
  onRemove,
  onDuplicate,
  onAutosave,
}: {
  item: QuestionnaireItem
  autoFocus?: boolean
  onChange: (q: QuestionnaireItem) => void
  onRemove: () => void
  onDuplicate: () => void
  onAutosave?: () => void
}) {
  const textRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!autoFocus) return
    textRef.current?.focus()
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [autoFocus])

  function patch(partial: Partial<QuestionnaireItem>) {
    onChange({ ...item, ...partial })
  }

  function saveFeedback() {
    setTouched(true)
    onAutosave?.()
  }

  const textOk = item.text.trim().length > 0
  const showTextState = touched || textOk
  const g = QUESTION_FIELD_GUIDES

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'space-y-5 rounded-xl border bg-white/90 p-5 transition-all duration-200',
          hovered
            ? '-translate-y-0.5 border-ink-600/25 shadow-(--shadow-lift)'
            : 'border-border shadow-sm hover:shadow-(--shadow-soft)',
          autoFocus && 'ring-2 ring-ink-900/10',
        )}
      >
        <div className="flex justify-end gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Duplikat pertanyaan"
            tooltip="Duplikat"
            onClick={() => {
              onDuplicate()
              toast('Pertanyaan diduplikasi')
            }}
            className="px-2"
          >
            <Copy size={15} variant="Bold" color="currentColor" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Hapus pertanyaan"
            tooltip="Hapus"
            onClick={() => setConfirmOpen(true)}
            className="px-2"
          >
            <Trash size={15} variant="Bold" color="#b91c1c" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-[100px_1fr_160px]">
          <GuidedField spec={g.number}>
            <Input
              value={item.number}
              onChange={(e) => patch({ number: e.target.value })}
              onBlur={saveFeedback}
              aria-label="Nomor pertanyaan"
            />
          </GuidedField>

          <GuidedField
            spec={g.text}
            error={showTextState && !textOk ? 'Teks pertanyaan wajib' : undefined}
            success={showTextState && textOk}
            counter={item.text.length}
            maxLength={240}
          >
            <Input
              ref={textRef}
              value={item.text}
              maxLength={240}
              fieldState={
                !showTextState ? 'default' : !textOk ? 'error' : 'success'
              }
              onChange={(e) => patch({ text: e.target.value })}
              onBlur={saveFeedback}
              aria-label="Teks pertanyaan"
            />
          </GuidedField>

          <GuidedField spec={g.type}>
            <Select
              value={item.type}
              aria-label="Tipe pertanyaan"
              onChange={(e) => {
                patch({ type: e.target.value as QuestionnaireItem['type'] })
                onAutosave?.()
              }}
            >
              <option value="tertutup">Tertutup</option>
              <option value="terbuka">Terbuka</option>
              <option value="skala">Skala</option>
            </Select>
          </GuidedField>
        </div>

        {item.type !== 'terbuka' ? (
          <GuidedField spec={g.options}>
            <Input
              value={(item.options ?? []).join(' | ')}
              onChange={(e) =>
                patch({
                  options: e.target.value
                    .split('|')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              onBlur={saveFeedback}
              aria-label="Opsi jawaban"
            />
          </GuidedField>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus pertanyaan?"
        description="Apakah Anda yakin ingin menghapus butir kuesioner ini?"
        confirmLabel="Hapus"
        cancelLabel="Batalkan"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          onRemove()
          toast('Pertanyaan berhasil dihapus')
        }}
      />
    </>
  )
}
