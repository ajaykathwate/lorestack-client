import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
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

function GalleryStrip({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0)
  if (images.length === 0) return null

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width / 2) {
      setIdx((prev) => (prev - 1 + images.length) % images.length)
    } else {
      setIdx((prev) => (prev + 1) % images.length)
    }
  }

  return (
    <div style={{ padding: '14px 20px 0' }}>
      <div
        className="relative rounded-[6px] overflow-hidden cursor-pointer select-none"
        style={{ height: 100, border: '1px solid var(--ls-line)' }}
        onClick={handleClick}
      >
        <img src={images[idx]} alt="" className="w-full h-full object-cover" />
        {images.length > 1 && (
          <div
            className="absolute bottom-2 right-2 font-mono text-white rounded-[3px]"
            style={{ fontSize: 9, padding: '1px 6px', background: 'rgba(0,0,0,.45)' }}
          >
            {idx + 1}/{images.length}
          </div>
        )}
      </div>
    </div>
  )
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map((company) => (
              <Link
                key={company.id}
                to={buildRoute.company(company.handle)}
                className="rounded-[10px] border border-line bg-bg flex flex-col hover:border-line-strong hover:shadow-sm transition-all"
                style={{ overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.04)', textDecoration: 'none' }}
              >
                {/* Card body — grows to fill */}
                <div className="flex-1" style={{ padding: '20px 20px 0' }}>
                  <div className="flex items-start" style={{ gap: 14 }}>
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="rounded-[8px] object-cover flex-shrink-0"
                        style={{ width: 48, height: 48, border: '1px solid var(--ls-line)' }}
                      />
                    ) : (
                      <div
                        className="rounded-[8px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2 flex-shrink-0"
                        style={{ width: 48, height: 48, fontSize: 16 }}
                      >
                        {initials(company.name).charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-bold text-ink truncate" style={{ fontSize: 16 }}>
                        {company.name}
                      </div>
                      <div className="font-mono text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>
                        @{company.handle}
                      </div>
                    </div>
                  </div>

                  {company.tagline && (
                    <p className="text-ink-2 line-clamp-2" style={{ fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
                      {company.tagline}
                    </p>
                  )}

                  {/* Industry / stage tags */}
                  <div className="flex flex-wrap" style={{ gap: 8, marginTop: 10 }}>
                    {company.industry && (
                      <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>
                        {company.industry}
                      </span>
                    )}
                    {company.stage && (
                      <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>
                        {company.stage}
                      </span>
                    )}
                    {company.techStack && company.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="font-mono text-ink-3" style={{ fontSize: 11 }}>
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gallery strip */}
                {company.galleryImages && company.galleryImages.length > 0 && (
                  <GalleryStrip images={company.galleryImages} />
                )}

                {/* Fixed bottom action */}
                <div className="border-t border-line mt-auto" style={{ padding: '11px 18px' }}>
                  <span className="font-mono text-ls-accent" style={{ fontSize: 12 }}>
                    View profile →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
