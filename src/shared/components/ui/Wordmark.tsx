import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import { LogoMark } from './LogoMark'

interface WordmarkProps {
  size?: number
  className?: string
  asLink?: boolean
  showMark?: boolean
}

export function Wordmark({ size = 18, className, asLink = true, showMark = true }: WordmarkProps) {
  const markSize = Math.round(size * 1.3)

  const content = (
    <span className={cn('inline-flex items-center gap-[7px]', className)}>
      {showMark && <LogoMark size={markSize} />}
      <span
        className="font-serif font-bold tracking-[-0.3px] text-ink"
        style={{ fontSize: size, lineHeight: 1 }}
      >
        Lorestack<span className="text-[#ff6a3d]">.</span>
      </span>
    </span>
  )

  if (asLink) {
    return (
      <Link to={ROUTES.HOME} className="no-underline">
        {content}
      </Link>
    )
  }
  return content
}
