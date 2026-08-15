import { useEffect, useRef, useState } from 'react'
import { ArrowDown2, ArrowUp2, Copy, Trash } from 'iconsax-react'
import type { VariableDef } from '@/domain/types'
import { buildVariableFieldGuides } from '@/content/fieldGuides'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Field'
import { GuidedField } from '@/components/ui/FieldGuide'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { cn } from '@/lib/utils'
import { toast } from '@/store/toastStore'

export function VariableCard({
  variable,
  index,
  total,
  autoFocus,
  onChange,
  onRemove,
  onDuplicate,
  onMove,
  onAutosave,
}: {
  variable: VariableDef
  index: number
  total: number
  autoFocus?: boolean
  onChange: (v: VariableDef) => void
  onRemove: () => void
  onDuplicate: () => void
  onMove: (dir: -1 | 1) => void
  onAutosave?: () => void
}) {
  const nameRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!autoFocus) return
    nameRef.current?.focus()
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [autoFocus])

  function patch(partial: Partial<VariableDef>) {
    onChange({ ...variable, ...partial })
  }

  function saveFeedback() {
    setTouched(true)
    onAutosave?.()
  }

  const nameOk = variable.name.trim().length > 0
  const defOk = variable.definition.trim().length > 0
  const showNameState = touched || nameOk
  const showDefState = touched || defOk
  // Per-variable helpers — never reuse another variable's Misal text
  const g = buildVariableFieldGuides(variable)

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'space-y-6 rounded-xl border bg-white/90 p-5 transition-all duration-200',
          hovered
            ? '-translate-y-0.5 border-ink-600/25 shadow-(--shadow-lift)'
            : 'border-border shadow-sm hover:shadow-(--shadow-soft)',
          autoFocus && 'ring-2 ring-ink-900/10',
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] font-medium tracking-wide text-ink-600/70">
            Variabel {index + 1}
          </div>
          <div className="flex flex-wrap gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Pindah ke atas"
              tooltip="Naikkan urutan"
              disabled={index === 0}
              onClick={() => onMove(-1)}
              className="px-2"
            >
              <ArrowUp2 size={15} variant="Bold" color="currentColor" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Pindah ke bawah"
              tooltip="Turunkan urutan"
              disabled={index >= total - 1}
              onClick={() => onMove(1)}
              className="px-2"
            >
              <ArrowDown2 size={15} variant="Bold" color="currentColor" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Duplikat variabel"
              tooltip="Duplikat"
              onClick={() => {
                onDuplicate()
                toast('Variabel diduplikasi')
              }}
              className="px-2"
            >
              <Copy size={15} variant="Bold" color="currentColor" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Hapus variabel"
              tooltip="Hapus"
              onClick={() => setConfirmOpen(true)}
              className="px-2"
            >
              <Trash size={15} variant="Bold" color="#b91c1c" />
            </Button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <GuidedField
            spec={g.name}
            error={showNameState && !nameOk ? 'Nama wajib diisi' : undefined}
            success={showNameState && nameOk}
            counter={variable.name.length}
            maxLength={80}
          >
            <Input
              ref={nameRef}
              value={variable.name}
              maxLength={80}
              fieldState={
                !showNameState ? 'default' : !nameOk ? 'error' : 'success'
              }
              onChange={(e) => patch({ name: e.target.value })}
              onBlur={saveFeedback}
              aria-label="Nama variabel"
            />
          </GuidedField>

          <GuidedField
            spec={g.category}
            counter={(variable.category ?? '').length}
            maxLength={40}
          >
            <Input
              value={variable.category ?? ''}
              maxLength={40}
              onChange={(e) => patch({ category: e.target.value })}
              onBlur={saveFeedback}
              aria-label="Kategori variabel"
            />
          </GuidedField>
        </div>

        <GuidedField
          spec={g.definition}
          success={showDefState && defOk}
          counter={variable.definition.length}
          maxLength={200}
        >
          <Input
            value={variable.definition}
            maxLength={200}
            fieldState={showDefState && defOk ? 'success' : 'default'}
            onChange={(e) => patch({ definition: e.target.value })}
            onBlur={saveFeedback}
            aria-label="Definisi variabel"
          />
        </GuidedField>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <GuidedField spec={g.type}>
            <Select
              value={variable.type}
              aria-label="Tipe data"
              onChange={(e) => {
                patch({ type: e.target.value as VariableDef['type'] })
                onAutosave?.()
              }}
            >
              <option value="kategorik">Kategorik</option>
              <option value="numerik">Numerik</option>
              <option value="teks">Teks</option>
              <option value="tanggal">Tanggal</option>
            </Select>
          </GuidedField>

          <GuidedField spec={g.scale}>
            <Select
              value={variable.scale ?? ''}
              aria-label="Skala pengukuran"
              onChange={(e) => {
                patch({
                  scale: (e.target.value || undefined) as VariableDef['scale'],
                })
                onAutosave?.()
              }}
            >
              <option value="">— Pilih skala —</option>
              <option value="nominal">Nominal</option>
              <option value="ordinal">Ordinal</option>
              <option value="interval">Interval</option>
              <option value="rasio">Rasio</option>
            </Select>
          </GuidedField>

          <GuidedField spec={g.unit}>
            <Input
              value={variable.unit ?? ''}
              onChange={(e) => patch({ unit: e.target.value })}
              onBlur={saveFeedback}
              aria-label="Satuan"
            />
          </GuidedField>

          <GuidedField spec={g.source}>
            <Input
              value={variable.source ?? ''}
              onChange={(e) => patch({ source: e.target.value })}
              onBlur={saveFeedback}
              aria-label="Sumber data"
            />
          </GuidedField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <GuidedField spec={g.exampleValue}>
            <Input
              value={variable.exampleValue ?? ''}
              onChange={(e) => patch({ exampleValue: e.target.value })}
              onBlur={saveFeedback}
              aria-label="Contoh nilai"
            />
          </GuidedField>

          <GuidedField spec={g.missingValueRule}>
            <Input
              value={variable.missingValueRule ?? ''}
              onChange={(e) => patch({ missingValueRule: e.target.value })}
              onBlur={saveFeedback}
              aria-label="Aturan nilai hilang"
            />
          </GuidedField>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus variabel?"
        description="Apakah Anda yakin ingin menghapus variabel ini? Perubahan tersimpan di perangkat Anda."
        confirmLabel="Hapus"
        cancelLabel="Batalkan"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          onRemove()
          toast('Variabel berhasil dihapus')
        }}
      />
    </>
  )
}
