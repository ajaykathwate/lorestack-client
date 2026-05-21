import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const INDUSTRIES = ['All', 'SaaS', 'DevTools', 'Data infra', 'AI / ML', 'Infra', 'FinTech', 'Platform']

export function CompaniesPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-line" style={{ padding: '40px 48px 24px' }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
          Browse
        </span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 40, marginTop: 6 }}>
          Engineering companies
        </h1>
        <p className="font-serif text-ink-2" style={{ maxWidth: 520, marginTop: 8, fontSize: 14 }}>
          Real engineering teams sharing their stories, architecture decisions, and lessons learned on Lorestack.
        </p>
      </div>

      {/* Industry filter strip */}
      <div className="border-b border-line bg-bg-soft" style={{ padding: '12px 48px' }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <span className="font-mono uppercase text-ink-3 flex-shrink-0" style={{ fontSize: 10, letterSpacing: '1.2px' }}>
            Industry
          </span>
          <div className="flex flex-wrap" style={{ gap: 6, marginLeft: 12 }}>
            {INDUSTRIES.map((ind, i) => (
              <button
                key={ind}
                className={`rounded-full border font-sans transition-colors ${
                  i === 0
                    ? 'bg-ink text-bg border-ink'
                    : 'border-line text-ink-2 hover:border-line-strong hover:text-ink bg-bg'
                }`}
                style={{ padding: '4px 12px', fontSize: 12 }}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div style={{ padding: '28px 48px' }}>
        <div className="flex flex-col items-center justify-center text-center" style={{ padding: '64px 32px', gap: 12 }}>
          <div
            className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-3"
            style={{ width: 56, height: 56, fontSize: 22 }}
          >
            ◆
          </div>
          <h2 className="font-serif font-bold text-ink" style={{ fontSize: 20 }}>No companies yet</h2>
          <p className="text-ink-3" style={{ maxWidth: 380, fontSize: 13, lineHeight: 1.6 }}>
            Companies will appear here once they publish on Lorestack. Be the first to create a company page and share your engineering story.
          </p>
          <Link
            to={ROUTES.DASHBOARD}
            className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
            style={{ padding: '8px 18px', fontSize: 13, marginTop: 8 }}
          >
            Create company page →
          </Link>
        </div>
      </div>
    </div>
  )
}
