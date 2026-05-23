import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, ExternalLink } from 'lucide-react'
import { useAllCompanies } from '@/api/hooks/useCompanyQueries'
import { buildRoute, ROUTES } from '@/constants/routes'
import { initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

const INDUSTRIES = ['All', 'SaaS', 'DevTools', 'Data infra', 'AI / ML', 'Infra', 'FinTech', 'Platform']

const INDUSTRY_MAP: Record<string, string> = {
  SaaS: 'saas',
  DevTools: 'dev_tools',
  'Data infra': 'data_infra',
  'AI / ML': 'ai_ml',
  Infra: 'infra',
  FinTech: 'fintech',
  Platform: 'platform',
}

export function CompaniesPage() {
  const [activeIndustry, setActiveIndustry] = useState('All')
  const { data, isLoading } = useAllCompanies({ limit: 50 })

  const allCompanies = data?.data ?? []
  const filtered = activeIndustry === 'All'
    ? allCompanies
    : allCompanies.filter((c) => {
        const mapped = INDUSTRY_MAP[activeIndustry]
        return mapped ? c.industry === mapped : true
      })

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-line" style={{ padding: '40px 48px 24px' }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Browse</span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 40, marginTop: 6 }}>
          Engineering companies
        </h1>
        <p className="font-serif text-ink-2" style={{ maxWidth: 520, marginTop: 8, fontSize: 14 }}>
          Real engineering teams sharing their stories, architecture decisions, and lessons learned on Lorestack.
          {data?.total != null && (
            <span className="text-ink-3"> · {data.total} {data.total === 1 ? 'company' : 'companies'}</span>
          )}
        </p>
      </div>

      {/* Industry filter strip */}
      <div className="border-b border-line bg-bg-soft" style={{ padding: '12px 48px' }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <span className="font-mono uppercase text-ink-3 flex-shrink-0" style={{ fontSize: 10, letterSpacing: '1.2px' }}>
            Industry
          </span>
          <div className="flex flex-wrap" style={{ gap: 6, marginLeft: 12 }}>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => setActiveIndustry(ind)}
                className={`rounded-full border font-sans transition-colors ${
                  activeIndustry === ind
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

      {/* Content */}
      <div style={{ padding: '28px 48px' }}>
        {isLoading ? (
          <div className="flex items-center justify-center" style={{ padding: 60 }}>
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center" style={{ padding: '64px 32px', gap: 12 }}>
            <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center" style={{ width: 56, height: 56 }}>
              <Building2 size={22} className="text-ink-3" />
            </div>
            <h2 className="font-serif font-bold text-ink" style={{ fontSize: 20 }}>
              {activeIndustry === 'All' ? 'No companies yet' : `No ${activeIndustry} companies yet`}
            </h2>
            <p className="text-ink-3" style={{ maxWidth: 380, fontSize: 13, lineHeight: 1.6 }}>
              {activeIndustry === 'All'
                ? 'Companies will appear here once they publish on Lorestack. Be the first to create a company page.'
                : `No companies in the ${activeIndustry} category yet. Try a different filter.`}
            </p>
            <Link
              to={ROUTES.DASHBOARD}
              className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
              style={{ padding: '8px 18px', fontSize: 13, marginTop: 8 }}
            >
              Create company page →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {filtered.map((company) => (
              <Link
                key={company.id}
                to={buildRoute.company(company.handle)}
                className="rounded-[8px] border border-line overflow-hidden flex flex-col hover:border-line-strong transition-colors group"
              >
                {/* Cover / Logo header */}
                <div className="relative bg-bg-tint" style={{ height: 72 }}>
                  {company.coverImageUrl && (
                    <img src={company.coverImageUrl} alt="" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute" style={{ bottom: -20, left: 16 }}>
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="rounded-[6px] border-2 border-bg object-cover"
                        style={{ width: 40, height: 40 }}
                      />
                    ) : (
                      <div
                        className="rounded-[6px] border-2 border-bg bg-bg-tint flex items-center justify-center font-mono font-bold text-ink-2"
                        style={{ width: 40, height: 40, fontSize: 14 }}
                      >
                        {initials(company.name)}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '28px 16px 16px' }}>
                  <div className="font-semibold text-ink group-hover:text-ls-accent transition-colors" style={{ fontSize: 14 }}>
                    {company.name}
                  </div>
                  <div className="font-mono text-ink-3" style={{ fontSize: 11, marginTop: 1 }}>@{company.handle}</div>
                  {company.tagline && (
                    <p className="text-ink-2 line-clamp-2" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                      {company.tagline}
                    </p>
                  )}

                  <div className="flex items-center flex-wrap" style={{ gap: 6, marginTop: 10 }}>
                    {company.industry && (
                      <span
                        className="border border-line text-ink-3 rounded-full font-mono"
                        style={{ padding: '2px 8px', fontSize: 10 }}
                      >
                        {company.industry}
                      </span>
                    )}
                    {company.stage && (
                      <span
                        className="border border-line text-ink-3 rounded-full font-mono"
                        style={{ padding: '2px 8px', fontSize: 10 }}
                      >
                        {company.stage}
                      </span>
                    )}
                    {company.websiteUrl && (
                      <span className="flex items-center text-ink-3" style={{ gap: 3, fontSize: 10 }}>
                        <ExternalLink size={9} />
                        website
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
