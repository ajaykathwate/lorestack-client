import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function CreateCompanyPage() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: 320, gap: 14 }}>
      <div
        className="font-mono text-ink-3 border border-line rounded-[6px] flex items-center justify-center"
        style={{ width: 64, height: 64, fontSize: 28 }}
      >
        ◧
      </div>
      <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
        Companies
      </span>
      <h1 className="font-serif font-semibold text-ink text-center" style={{ fontSize: 26, margin: 0 }}>
        Create a company page
      </h1>
      <p className="text-ink-3 text-center" style={{ fontSize: 14, maxWidth: 400 }}>
        Company pages are coming soon. You'll be able to publish engineering blogs under your company brand and manage a team of writers.
      </p>
      <Link
        to={ROUTES.DASHBOARD}
        className="text-ink-2 hover:text-ink underline underline-offset-2 transition-colors"
        style={{ fontSize: 13 }}
      >
        ← Back to dashboard
      </Link>
    </div>
  )
}
