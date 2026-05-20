import { type FieldValues, type FieldPath, type Control, useController } from 'react-hook-form'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/lib/utils'

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  disabled?: boolean
  rows?: number
  className?: string
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  rows = 4,
  className,
}: FormTextareaProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={name} className="text-[12px] font-medium text-ink-2">
          {label}
        </Label>
      )}
      <textarea
        {...field}
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full rounded-[6px] border border-line bg-bg px-3 py-[9px] text-[13px] text-ink placeholder:text-ink-3',
          'focus:outline-none focus:ring-1 focus:ring-ls-accent focus:border-ls-accent',
          'disabled:opacity-50 disabled:cursor-not-allowed resize-none transition-colors',
          error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
        )}
      />
      {error && (
        <p className="text-[11px] text-red-500">{error.message}</p>
      )}
    </div>
  )
}
