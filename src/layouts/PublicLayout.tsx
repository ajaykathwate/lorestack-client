import { Outlet, Link } from 'react-router-dom'
import { Linkedin } from 'lucide-react'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { TopNav } from '@/shared/components/TopNav'
import { ROUTES } from '@/constants/routes'
import { ErrorBoundary } from '@/shared/components/feedback/ErrorBoundary'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans">
      <TopNav />

      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-bg-deep">
        <div className="max-w-6xl mx-auto px-6 py-8" style={{ fontSize: 13 }}>
          {/* Top row: wordmark + social handles */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <Wordmark size={17} asLink={false} />
              <p className="text-ink-3 leading-relaxed mt-2.5 max-w-[260px]" style={{ fontSize: 12 }}>
                A home for engineering stories. Made with care for the people who actually ship.
              </p>
            </div>
            <div className="flex items-center gap-3 text-ink-3" style={{ fontSize: 12 }}>
              <a
                href="https://linkedin.com/company/lorestack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-ink-2 transition-colors"
              >
                <Linkedin size={13} /> LinkedIn
              </a>
              <a
                href="https://instagram.com/lorestack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-ink-2 transition-colors"
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            </div>
          </div>

          {/* Bottom row: write links horizontal + legal */}
          <div
            className="flex flex-wrap items-center justify-between gap-4 border-t border-line-soft"
            style={{ marginTop: 24, paddingTop: 16 }}
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-ink-3" style={{ fontSize: 12 }}>
              <span className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>Write</span>
              <Link to={ROUTES.EDITOR_NEW} className="hover:text-ink-2 transition-colors">Start writing</Link>
              <Link to={ROUTES.DASHBOARD} className="hover:text-ink-2 transition-colors">Dashboard</Link>
              <Link to={ROUTES.MY_BLOGS} className="hover:text-ink-2 transition-colors">My blogs</Link>
              <Link to={ROUTES.EXPLORE} className="hover:text-ink-2 transition-colors">Explore</Link>
            </div>
            <div className="flex items-center gap-4 text-ink-3" style={{ fontSize: 11 }}>
              <span>Privacy</span>
              <span>Terms</span>
              <span>© 2026 Lorestack</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
