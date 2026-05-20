import { Link } from 'react-router-dom'
import { ROUTES, buildRoute } from '@/constants/routes'

const SUGGESTED = [
  { slug: 'how-we-cut-p99-latency-800ms-120ms', type: 'Postmortem', title: 'How we cut p99 latency from 800ms → 120ms', company: 'Aurora Labs', date: 'May 16' },
  { slug: '3-hours-of-cascading-redis-failover', type: 'Case study', title: '3 hours of cascading Redis failover', company: 'Hexa.io', date: 'May 12' },
  { slug: 'the-boring-postgres-migration-that-wasnt', type: 'Architecture', title: "The boring postgres migration that wasn't", company: 'Northstar', date: 'May 8' },
]

export function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center" style={{ padding: 48 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            maxWidth: 900,
            width: '100%',
            alignItems: 'center',
          }}
        >
          {/* Left: copy + CTAs */}
          <div>
            <span
              className="font-mono uppercase text-ink-3"
              style={{ fontSize: 11, letterSpacing: '1.2px' }}
            >
              404 · This article is no longer available
            </span>
            <h1
              className="font-serif font-bold text-ink"
              style={{ fontSize: 46, lineHeight: 1.05, marginTop: 10 }}
            >
              The page you're looking for has been archived or moved.
            </h1>
            <p
              className="font-serif text-ink-2"
              style={{ fontSize: 14, lineHeight: 1.55, marginTop: 14, maxWidth: 420 }}
            >
              The author may have unpublished it, or the URL might be a typo. Here are a few things
              you can do from here.
            </p>
            <div className="flex" style={{ gap: 10, marginTop: 18 }}>
              <Link
                to={ROUTES.HOME}
                className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
                style={{ padding: '9px 18px', fontSize: 13 }}
              >
                ← Back to homepage
              </Link>
              <Link
                to={ROUTES.EXPLORE}
                className="border border-line text-ink-2 font-medium rounded-[6px] hover:border-line-strong hover:text-ink transition-colors"
                style={{ padding: '9px 18px', fontSize: 13 }}
              >
                Browse Explore
              </Link>
            </div>
          </div>

          {/* Right: suggested articles */}
          <div>
            <div
              className="font-mono uppercase text-ink-3"
              style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 10 }}
            >
              You might also like
            </div>
            <div className="border border-line rounded-[8px] overflow-hidden bg-bg">
              {SUGGESTED.map((article, i) => (
                <Link
                  key={article.slug}
                  to={buildRoute.blog(article.slug)}
                  className="flex hover:bg-bg-tint transition-colors"
                  style={{
                    gap: 12,
                    padding: '12px 14px',
                    borderTop: i > 0 ? '1px solid var(--ls-line-soft)' : 'none',
                  }}
                >
                  <div
                    className="rounded-[4px] bg-bg-tint border border-line flex-shrink-0"
                    style={{ width: 72, height: 60 }}
                  />
                  <div className="min-w-0 flex flex-col justify-center" style={{ gap: 4 }}>
                    <span
                      className="border border-line text-ink-3 rounded-[3px] inline-block"
                      style={{ fontSize: 9, padding: '1px 6px', alignSelf: 'flex-start' }}
                    >
                      {article.type}
                    </span>
                    <div
                      className="font-serif font-semibold text-ink"
                      style={{ fontSize: 13, lineHeight: 1.3 }}
                    >
                      {article.title}
                    </div>
                    <div className="text-ink-3" style={{ fontSize: 10 }}>
                      {article.company} · {article.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center" style={{ marginTop: 14 }}>
              <Link
                to={ROUTES.EXPLORE}
                className="text-ls-accent underline underline-offset-2"
                style={{ fontSize: 12 }}
              >
                See all articles on Explore →
              </Link>
            </div>
          </div>
        </div>
    </div>
  )
}
