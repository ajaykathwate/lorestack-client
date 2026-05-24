import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Plus, Settings, ExternalLink } from 'lucide-react'
import { useMyCompanies } from '@/api/hooks/useCompanyQueries'
import { ROUTES, buildRoute } from '@/constants/routes'
import { UserAvatar } from '@/shared/components/ui/UserAvatar'
import { Spinner } from '@/shared/components/feedback/Spinner'

function GalleryStrip({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0)
  if (images.length === 0) return null

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
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
        <img
          src={images[idx]}
          alt=""
          className="w-full h-full object-cover"
        />
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

export function MyCompaniesPage() {
  const { data: companies, isLoading } = useMyCompanies()

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6 p-4 lg:p-6">
      <div className="flex justify-between items-baseline" style={{ marginBottom: 24 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Workspace</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            My Companies
            <span className="text-ink-3 font-normal" style={{ fontSize: 18 }}> · {(companies ?? []).length}</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {(companies ?? []).map((company) => (
            <div
              key={company.id}
              className="rounded-[16px] flex flex-col transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}
            >
              {/* Card body */}
              <div className="flex-1" style={{ padding: '20px 20px 0' }}>
                {/* Logo + name */}
                <div className="flex items-start" style={{ gap: 14, marginBottom: 12 }}>
                  <UserAvatar avatarUrl={company.logoUrl} name={company.name} size={48} shape="square" />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-bold text-ink truncate" style={{ fontSize: 17 }}>
                      {company.name}
                    </div>
                    <div className="font-mono text-ink-3" style={{ fontSize: 12, marginTop: 3 }}>
                      @{company.handle}
                    </div>
                  </div>
                </div>

                {company.tagline && (
                  <p className="text-ink-3 line-clamp-2" style={{ fontSize: 13, lineHeight: 1.55 }}>
                    {company.tagline}
                  </p>
                )}

                {/* Tech stack tags */}
                {company.techStack && company.techStack.length > 0 && (
                  <div className="flex flex-wrap" style={{ gap: 6, marginTop: 10 }}>
                    {company.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-ink-3 rounded-full border border-line bg-bg-soft"
                        style={{ fontSize: 11, padding: '2px 8px' }}
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery strip */}
              {company.galleryImages && company.galleryImages.length > 0 && (
                <GalleryStrip images={company.galleryImages} />
              )}

              {/* Actions */}
              <div
                className="flex items-center"
                style={{ borderTop: '1px solid rgba(0,0,0,0.07)', margin: '16px 0 0', padding: '12px 16px', gap: 8 }}
              >
                <Link
                  to={buildRoute.companyDashboard(company.handle)}
                  className="flex items-center border border-line text-ink-2 rounded-[8px] hover:bg-bg-tint hover:text-ink transition-colors"
                  style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, textDecoration: 'none', flex: 1, justifyContent: 'center' }}
                >
                  <Building2 size={13} />
                  Dashboard
                </Link>
                <Link
                  to={buildRoute.company(company.handle)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center border border-line text-ink-2 rounded-[8px] hover:bg-bg-tint hover:text-ink transition-colors"
                  style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, textDecoration: 'none', flex: 1, justifyContent: 'center' }}
                >
                  <ExternalLink size={13} />
                  View
                </Link>
                <Link
                  to={buildRoute.companySettings(company.handle)}
                  className="flex items-center border border-line text-ink-3 rounded-[8px] hover:bg-bg-tint hover:text-ink transition-colors"
                  style={{ padding: '7px 11px', textDecoration: 'none', flexShrink: 0 }}
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
