import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'

interface WordmarkProps {
  size?: number
  className?: string
  asLink?: boolean
}

// Matches exactly the Wordmark primitive in wireframe-primitives.jsx:
// serif 700, "Lorestack" + accent period, letter-spacing -.3px
export function Wordmark({ size = 18, className, asLink = true }: WordmarkProps) {
  const content = (
    <span
      className={cn('font-serif font-bold tracking-[-0.3px] text-ink', className)}
      style={{ fontSize: size }}
    >
      Lorestack<span className="text-ls-accent">.</span>
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
