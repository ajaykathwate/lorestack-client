import { type FieldValues, type FieldPath, type Control, useController } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  disabled?: boolean
  className?: string
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  className,
}: FormCheckboxProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          id={name}
          checked={!!field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          disabled={disabled}
          className="w-[14px] h-[14px] rounded-[3px] border-line accent-ls-accent"
        />
        <span className="text-[13px] text-ink-2">{label}</span>
      </label>
      {error && (
        <p className="text-[11px] text-red-500">{error.message}</p>
      )}
    </div>
  )
}
