import { type FieldValues, type FieldPath, type Control, useController } from 'react-hook-form'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/lib/utils'

interface FormInputProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  hint?: string
  className?: string
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  disabled,
  hint,
  className,
}: FormInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })

  return (
    <div className={cn('flex flex-col gap-[6px]', className)}>
      {label && (
        <label htmlFor={name} className="text-[13px] font-medium text-ink-2">
          {label}
        </label>
      )}
      <Input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error && 'border-red-400')}
      />
      {hint && !error && (
        <p className="text-[12px] text-ink-3">{hint}</p>
      )}
      {error && (
        <p className="text-[12px] text-red-500">{error.message}</p>
      )}
    </div>
  )
}
