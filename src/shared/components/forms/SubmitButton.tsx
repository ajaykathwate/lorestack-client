import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubmitButtonProps {
  isLoading?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
  loadingText?: string
}

export function SubmitButton({
  isLoading,
  disabled,
  children,
  className,
  loadingText,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={cn(
        'flex items-center justify-center gap-2 w-full h-[44px] px-4',
        'bg-ink text-bg text-[14px] font-medium rounded-[6px]',
        'hover:bg-black transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {isLoading && <Loader2 size={15} className="animate-spin" />}
      {isLoading ? (loadingText ?? 'Loading...') : children}
    </button>
  )
}
