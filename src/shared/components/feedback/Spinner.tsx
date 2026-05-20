import { cn } from '@/lib/utils'

const sizeMap = {
  sm: 'w-4 h-4 border-[2px]',
  md: 'w-6 h-6 border-[2px]',
  lg: 'w-8 h-8 border-[3px]',
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full border-line border-t-ls-accent animate-spin',
        sizeMap[size],
        className,
      )}
    />
  )
}
