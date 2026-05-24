import { Link } from 'react-router-dom'
import { Building2, Plus, Settings } from 'lucide-react'
import { useMyCompanies } from '@/api/hooks/useCompanyQueries'
import { ROUTES, buildRoute } from '@/constants/routes'
import { initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function MyCompaniesPage() {
  const { data: companies, isLoading } = useMyCompanies()

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6 p-4 lg:p-6">
      <div className="flex justify-between items-baseline" style={{ marginBottom: 24 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Workspace</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            My Companies
          </h1>
        </div>
        <Link
          to={ROUTES.CREATE_COMPANY}
          className="flex items-center bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
          style={{ gap: 6, padding: '8px 16px', fontSize: 13 }}
        >
          <Plus size={14} />
          Create company
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center" style={{ paddingTop: 48 }}>
          <Spinner size="lg" />
        </div>
      ) : (companies ?? []).length === 0 ? (
        <div className="rounded-[10px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 64 }}>
          <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center text-ink-3" style={{ width: 52, height: 52, marginBottom: 14 }}>
            <Building2 size={22} />
          </div>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 17 }}>No companies yet</h3>
          <p className="text-ink-2" style={{ margin: '6px 0 20px', fontSize: 13, maxWidth: 320, lineHeight: 1.6 }}>
            Create a company to publish engineering blogs under your brand and invite teammates.
          </p>
          <Link
            to={ROUTES.CREATE_COMPANY}
            className="flex items-center bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
            style={{ gap: 6, padding: '9px 18px', fontSize: 13 }}
          >
            <Plus size={14} />
            Create your first company
          </Link>
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: 12 }}>
          {(companies ?? []).map((company) => (
            <div
              key={company.id}
              className="rounded-[10px] border border-line bg-bg flex items-center hover:border-line-strong transition-colors"
              style={{ padding: '16px 20px', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}
            >
              {/* Logo */}
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="rounded-[8px] object-cover flex-shrink-0"
                  style={{ width: 52, height: 52, border: '1px solid var(--ls-line)' }}
                />
              ) : (
                <div
                  className="rounded-[8px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2 flex-shrink-0"
                  style={{ width: 52, height: 52, fontSize: 18 }}
                >
                  {initials(company.name).charAt(0)}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink" style={{ fontSize: 15 }}>{company.name}</div>
                <div className="font-mono text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>@{company.handle}</div>
                {company.tagline && (
                  <p className="text-ink-2 line-clamp-1" style={{ fontSize: 12, marginTop: 4 }}>{company.tagline}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center flex-shrink-0" style={{ gap: 8 }}>
                <Link
                  to={buildRoute.companyDashboard(company.handle)}
                  className="flex items-center border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint hover:text-ink transition-colors"
                  style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}
                >
                  <Building2 size={13} />
                  Dashboard
                </Link>
                <Link
                  to={buildRoute.companySettings(company.handle)}
                  className="flex items-center border border-line text-ink-3 rounded-[6px] hover:bg-bg-tint hover:text-ink transition-colors"
                  style={{ gap: 5, padding: '7px 11px', fontSize: 13, textDecoration: 'none' }}
                  title="Settings"
                >
                  <Settings size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
