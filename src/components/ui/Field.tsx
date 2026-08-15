import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from 'react'
import { forwardRef } from 'react'
import { TickCircle, Warning2 } from 'iconsax-react'
import { cn } from '@/lib/utils'

export function Label({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode
  htmlFor?: string
  hint?: string
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink-900">
        {children}
      </label>
      {hint ? <span className="text-xs text-ink-600/70">{hint}</span> : null}
    </div>
  )
}

type FieldState = 'default' | 'error' | 'success'

const controlBase =
  'w-full rounded-xl border bg-white px-3.5 text-sm text-ink-950 shadow-sm placeholder:text-ink-600/35 transition-all duration-200 focus-ring hover:border-ink-600/25 focus:border-ink-600/40'

function stateClass(state: FieldState = 'default') {
  if (state === 'error') return 'border-danger/50 focus:border-danger'
  if (state === 'success') return 'border-success/40 focus:border-success'
  return 'border-border-strong/80'
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { fieldState?: FieldState }
>(function Input({ className, fieldState = 'default', ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={fieldState === 'error' || undefined}
      className={cn('h-11', controlBase, stateClass(fieldState), className)}
      {...props}
    />
  )
})

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { fieldState?: FieldState }
>(function Textarea({ className, fieldState = 'default', ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={fieldState === 'error' || undefined}
      className={cn('min-h-28 py-3', controlBase, stateClass(fieldState), className)}
      {...props}
    />
  )
})

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { fieldState?: FieldState }
>(function Select({ className, children, fieldState = 'default', ...props }, ref) {
  return (
    <select
      ref={ref}
      aria-invalid={fieldState === 'error' || undefined}
      className={cn('h-11', controlBase, stateClass(fieldState), className)}
      {...props}
    >
      {children}
    </select>
  )
})

export function Field({
  children,
  className,
  helper,
  error,
  success,
  counter,
  maxLength,
}: {
  children: ReactNode
  className?: string
  helper?: string
  error?: string
  success?: boolean
  counter?: number
  maxLength?: number
}) {
  return (
    <div className={cn('space-y-1', className)}>
      {children}
      <div className="flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0 flex-1">
          {error ? (
            <p className="inline-flex items-center gap-1 text-xs text-danger" role="alert">
              <Warning2 size={12} variant="Bold" color="currentColor" />
              {error}
            </p>
          ) : success ? (
            <p className="inline-flex items-center gap-1 text-xs text-success">
              <TickCircle size={12} variant="Bold" color="currentColor" />
              Lengkap
            </p>
          ) : helper ? (
            <p className="text-xs text-ink-600/80">{helper}</p>
          ) : null}
        </div>
        {typeof counter === 'number' && maxLength ? (
          <span
            className={cn(
              'shrink-0 text-[11px] tabular-nums text-ink-600/70',
              counter > maxLength && 'text-danger',
            )}
          >
            {counter}/{maxLength}
          </span>
        ) : typeof counter === 'number' ? (
          <span className="shrink-0 text-[11px] tabular-nums text-ink-600/70">{counter}</span>
        ) : null}
      </div>
    </div>
  )
}
