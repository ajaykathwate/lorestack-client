import { cn } from '@/lib/utils'

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null

  return (
    <div
      className={cn(
        'px-3 py-2.5 rounded-[6px] bg-red-50 border border-red-200 text-[12px] text-red-600',
        className,
      )}
    >
      {message}
    </div>
  )
}
