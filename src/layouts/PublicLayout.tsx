import { Outlet, Link } from 'react-router-dom'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { TopNav } from '@/shared/components/TopNav'
import { ROUTES } from '@/constants/routes'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans">
      <TopNav />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-bg-deep">
        <div
          className="max-w-6xl mx-auto px-6 py-8 grid gap-8 text-ink-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"
          style={{ fontSize: 13 }}
        >
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Wordmark size={17} asLink={false} />
            <p className="text-ink-3 leading-relaxed mt-2.5 max-w-[240px]" style={{ fontSize: 12 }}>
              A home for engineering stories. Made with care for the people who actually ship.
            </p>
            <div className="flex gap-2 mt-3.5 font-mono text-ink-3" style={{ fontSize: 11 }}>
              <span>↗ twitter</span>
              <span>↗ github</span>
              <span>↗ rss</span>
            </div>
          </div>

          <div>
            <div className="font-mono uppercase text-ink-3 mb-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>Write</div>
            <ul className="flex flex-col gap-2 list-none m-0 p-0" style={{ fontSize: 12 }}>
              <li><Link to={ROUTES.EDITOR_NEW} className="text-ink-3 hover:text-ink-2 transition-colors">Start writing</Link></li>
              <li><Link to={ROUTES.DASHBOARD} className="text-ink-3 hover:text-ink-2 transition-colors">Dashboard</Link></li>
              <li><Link to={ROUTES.SCHEDULED} className="text-ink-3 hover:text-ink-2 transition-colors">Schedule blogs</Link></li>
              <li><Link to={ROUTES.COMPANIES} className="text-ink-3 hover:text-ink-2 transition-colors">Milestones</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-mono uppercase text-ink-3 mb-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>Company</div>
            <ul className="flex flex-col gap-2 list-none m-0 p-0" style={{ fontSize: 12 }}>
              <li><Link to={ROUTES.EXPLORE} className="text-ink-3 hover:text-ink-2 transition-colors">Explore</Link></li>
              <li><span className="text-ink-3">About</span></li>
              <li><span className="text-ink-3">Privacy</span></li>
              <li><span className="text-ink-3">Terms</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
