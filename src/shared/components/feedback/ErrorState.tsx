import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 px-4 text-center',
        className,
      )}
    >
      <p className="text-[14px] font-medium text-ink">{title}</p>
      {message && (
        <p className="text-[13px] text-ink-3 max-w-[320px] leading-relaxed">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 text-[12px] font-medium text-ink-2 border border-line rounded-[6px] hover:bg-bg-tint transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
