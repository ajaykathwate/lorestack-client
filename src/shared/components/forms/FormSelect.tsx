import { type FieldValues, type FieldPath, type Control, useController } from 'react-hook-form'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  disabled,
  className,
}: FormSelectProps<T>) {
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
      <select
        {...field}
        id={name}
        disabled={disabled}
        className={cn(
          'w-full h-[38px] rounded-[6px] border border-line bg-bg px-3 text-[13px] text-ink',
          'focus:outline-none focus:ring-1 focus:ring-ls-accent focus:border-ls-accent',
          'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
          !field.value && 'text-ink-3',
          error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[11px] text-red-500">{error.message}</p>
      )}
    </div>
  )
}
