import { Link } from 'react-router-dom'
import { buildRoute } from '@/constants/routes'

const FEATURED_COMPANIES = [
  { handle: 'aurora-labs', name: 'Aurora Labs', tagline: 'Infra for the AI-native era', industry: 'SaaS', blogCount: 24, initials: 'AL' },
  { handle: 'hexa-io', name: 'Hexa.io', tagline: 'Observability at every layer', industry: 'DevTools', blogCount: 18, initials: 'HX' },
  { handle: 'northstar', name: 'Northstar', tagline: 'Real-time data, zero compromise', industry: 'Data infra', blogCount: 12, initials: 'NS' },
  { handle: 'quiver', name: 'Quiver', tagline: 'Event-driven microservices', industry: 'Platform', blogCount: 9, initials: 'QV' },
  { handle: 'lambda-studio', name: 'Lambda Studio', tagline: 'ML infrastructure done right', industry: 'AI / ML', blogCount: 15, initials: 'LS' },
  { handle: 'verge-systems', name: 'Verge Systems', tagline: 'Distributed storage at scale', industry: 'Infra', blogCount: 7, initials: 'VS' },
  { handle: 'sift-tech', name: 'Sift Tech', tagline: 'Fraud detection that ships fast', industry: 'FinTech', blogCount: 11, initials: 'ST' },
  { handle: 'plume', name: 'Plume', tagline: 'API-first developer tooling', industry: 'DevTools', blogCount: 6, initials: 'PL' },
]

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

      {/* Companies grid */}
      <div style={{ padding: '28px 48px' }}>
        <div
          className="font-mono uppercase text-ink-3"
          style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 16 }}
        >
          {FEATURED_COMPANIES.length} companies
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {FEATURED_COMPANIES.map((co) => (
            <Link
              key={co.handle}
              to={buildRoute.company(co.handle)}
              className="border border-line rounded-[8px] hover:border-line-strong hover:shadow-sm transition-all bg-bg flex flex-col"
              style={{ padding: 20 }}
            >
              <div className="flex items-center" style={{ gap: 12, marginBottom: 12 }}>
                <div
                  className="rounded-[6px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2 flex-shrink-0"
                  style={{ width: 44, height: 44, fontSize: 13 }}
                >
                  {co.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate" style={{ fontSize: 14 }}>
                    {co.name}
                  </div>
                  <div
                    className="rounded-full border border-line text-ink-3 inline-block"
                    style={{ fontSize: 10, padding: '1px 7px', marginTop: 3 }}
                  >
                    {co.industry}
                  </div>
                </div>
              </div>

              <p className="font-serif text-ink-2 flex-1" style={{ fontSize: 13, lineHeight: 1.5 }}>
                {co.tagline}
              </p>

              <div
                className="flex items-center border-t border-line text-ink-3"
                style={{ marginTop: 14, paddingTop: 12, fontSize: 11, gap: 4 }}
              >
                <span className="font-mono">◆</span>
                <span>{co.blogCount} articles</span>
                <span className="flex-1" />
                <span className="text-ls-accent" style={{ fontSize: 11 }}>Visit →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA: create a company page */}
        <div
          className="border border-line rounded-[8px] bg-bg-soft flex items-center justify-between"
          style={{ padding: '20px 24px', marginTop: 32 }}
        >
          <div>
            <div className="font-semibold text-ink" style={{ fontSize: 14 }}>
              Is your company on Lorestack?
            </div>
            <p className="text-ink-3" style={{ fontSize: 12, marginTop: 4 }}>
              Create a company page and start publishing engineering stories under your brand.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors flex-shrink-0"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            Create company page →
          </Link>
        </div>
      </div>
    </div>
  )
}
