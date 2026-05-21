import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useCompanyByHandle, useCompanyMembers } from '@/api/hooks/useCompanyQueries'
import { useCompanyBlogs } from '@/api/hooks/useBlogQueries'
import { useInviteAuthor, useRemoveMember } from '@/api/hooks/useCompanyMutations'
import { buildRoute } from '@/constants/routes'
import { initials, articleTypeLabel, formatDateShort } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

type Tab = 'overview' | 'blogs' | 'team' | 'timeline' | 'settings'

export function CompanyDashboardPage() {
  const { handle = '' } = useParams()
  const [activeTab, setActiveTab] = useState<Tab>('team')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const { data: company, isLoading } = useCompanyByHandle(handle)
  const { data: members } = useCompanyMembers(handle)
  const { data: blogs } = useCompanyBlogs(handle)
  const { mutate: inviteAuthor, isPending: inviting } = useInviteAuthor(handle)
  const { mutate: removeMember } = useRemoveMember(handle)

  const team = members ?? []
  const articles = blogs ?? []

  function handleInvite() {
    if (!inviteEmail.trim()) return
    inviteAuthor(
      { email: inviteEmail },
      {
        onSuccess: () => {
          toast.success(`Invite sent to ${inviteEmail}`)
          setInviteEmail('')
          setShowInviteModal(false)
        },
        onError: () => toast.error('Failed to send invite.'),
      },
    )
  }

  function handleRemove(userId: string, name: string) {
    if (!confirm(`Remove ${name} from the team?`)) return
    removeMember(
      userId,
      {
        onSuccess: () => toast.success(`${name} removed.`),
        onError: () => toast.error('Failed to remove member.'),
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" style={{ gap: 12 }}>
        <p className="font-mono text-ink-3 uppercase" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Not found</p>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 24 }}>Company not found.</h1>
      </div>
    )
  }

  const companyInitials = initials(company.name)

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      {/* Header */}
      <div
        className="flex items-start gap-14 border-b border-line"
        style={{ gap: 14, paddingBottom: 18, marginBottom: 0 }}
      >
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            className="rounded-[6px] object-cover flex-shrink-0"
            style={{ width: 56, height: 56 }}
          />
        ) : (
          <div
            className="rounded-[6px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2 flex-shrink-0"
            style={{ width: 56, height: 56, fontSize: 20 }}
          >
            {companyInitials}
          </div>
        )}
        <div className="flex-1">
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 24 }}>{company.name}</h1>
          <div className="text-ink-3" style={{ fontSize: 12, marginTop: 2 }}>
            lorestack.com/company/{company.handle} · {articles.length} blogs · {team.length} team
          </div>
        </div>
        <div className="flex" style={{ gap: 8 }}>
          <Link
            to={buildRoute.company(company.handle)}
            target="_blank"
            className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            View public page ↗
          </Link>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-ink text-bg font-medium rounded-[4px] hover:bg-black transition-colors"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            + Invite author
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-line" style={{ gap: 18, marginBottom: 20 }}>
        {([
          { key: 'overview', label: 'Overview' },
          { key: 'blogs', label: 'Blogs' },
          { key: 'team', label: 'Team' },
          { key: 'timeline', label: 'Timeline' },
          { key: 'settings', label: 'Settings' },
        ] as { key: Tab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="font-sans transition-colors"
            style={{
              padding: '10px 0',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? 'var(--ls-ink)' : 'var(--ls-ink-3)',
              borderBottom: activeTab === tab.key ? '2px solid var(--ls-accent)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Team tab */}
      {activeTab === 'team' && (
        <div className="flex flex-col" style={{ gap: 14 }}>
          <div className="flex justify-between items-baseline">
            <h3 className="font-serif font-bold text-ink" style={{ fontSize: 16 }}>
              Team <span className="text-ink-3 font-normal">· {team.length}</span>
            </h3>
          </div>

          {team.length === 0 ? (
            <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
              <p className="text-ink-3" style={{ fontSize: 13 }}>No team members yet.</p>
            </div>
          ) : (
            <div className="rounded-[6px] border border-line overflow-hidden">
              {team.map((member, i) => (
                <div
                  key={member.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 100px 130px 60px',
                    padding: '12px 14px',
                    gap: 14,
                    alignItems: 'center',
                    borderTop: i ? '1px solid var(--ls-line-soft)' : 'none',
                  }}
                >
                  <div
                    className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2"
                    style={{ width: 30, height: 30, fontSize: 11 }}
                  >
                    {initials(member.displayName)}
                  </div>
                  <div>
                    <div className="font-semibold text-ink" style={{ fontSize: 13 }}>{member.displayName}</div>
                    <div className="font-mono text-ink-3" style={{ fontSize: 11 }}>@{member.username}</div>
                  </div>
                  <span
                    className={`rounded-[3px] font-mono text-center ${
                      member.role === 'owner' ? 'bg-ls-accent text-white' : 'border border-line text-ink-2'
                    }`}
                    style={{ fontSize: 10, padding: '2px 6px' }}
                  >
                    {member.role === 'owner' ? 'Owner' : 'Author'}
                  </span>
                  <span className="text-ink-3" style={{ fontSize: 11 }}>
                    joined {formatDateShort(member.joinedAt)}
                  </span>
                  {member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemove(member.userId, member.displayName)}
                      className="text-ink-3 hover:text-red-500 transition-colors text-right"
                      style={{ fontSize: 12 }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blogs tab */}
      {activeTab === 'blogs' && (
        <div className="flex flex-col" style={{ gap: 14 }}>
          {articles.length === 0 ? (
            <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
              <p className="text-ink-3" style={{ fontSize: 13 }}>No blogs published under this company yet.</p>
            </div>
          ) : (
            <div className="rounded-[6px] border border-line overflow-hidden">
              {articles.map((blog, i) => (
                <div
                  key={blog.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 110px',
                    padding: '14px 14px',
                    gap: 14,
                    alignItems: 'center',
                    borderTop: i ? '1px solid var(--ls-line-soft)' : 'none',
                  }}
                >
                  <div>
                    <span className="border border-line text-ink-2 rounded-[3px]" style={{ fontSize: 10, padding: '2px 5px' }}>
                      {articleTypeLabel(blog.articleType)}
                    </span>
                    <div className="font-serif font-semibold text-ink" style={{ fontSize: 14, marginTop: 2 }}>{blog.title}</div>
                  </div>
                  <span className="capitalize text-ink-2" style={{ fontSize: 12 }}>{blog.status}</span>
                  <span className="text-ink-2" style={{ fontSize: 12 }}>
                    {formatDateShort(blog.publishedAt ?? blog.updatedAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="flex flex-col" style={{ gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Total blogs', value: articles.length.toString() },
              { label: 'Team size', value: team.length.toString() },
              { label: 'Status', value: company.isPublic ? 'Public' : 'Private' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-[6px] border border-line bg-bg" style={{ padding: 14 }}>
                <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>{label}</div>
                <div className="font-serif font-semibold text-ink" style={{ fontSize: 22, marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-[6px] border border-line bg-bg" style={{ padding: 14 }}>
            <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 8 }}>Company info</div>
            <div className="font-serif font-bold text-ink" style={{ fontSize: 18 }}>{company.name}</div>
            <div className="text-ink-2" style={{ fontSize: 14, marginTop: 4 }}>{company.tagline}</div>
            {company.websiteUrl && (
              <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-ls-accent" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                ↗ {company.websiteUrl}
              </a>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="text-ink-2" style={{ fontSize: 13 }}>
          <p>Company settings are managed in the <Link to={buildRoute.companySettings(handle)} className="text-ls-accent underline">Settings page</Link>.</p>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="text-ink-2" style={{ fontSize: 13 }}>
          <p>Timeline is visible on the <Link to={buildRoute.company(handle)} target="_blank" className="text-ls-accent underline">public company page ↗</Link>.</p>
        </div>
      )}

      {/* Invite modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-bg rounded-[8px] border border-line shadow-xl"
            style={{ width: 460, padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-baseline" style={{ marginBottom: 6 }}>
              <h3 className="font-serif font-bold text-ink" style={{ fontSize: 20 }}>Invite an author</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-ink-3 hover:text-ink" style={{ fontSize: 20 }}>×</button>
            </div>
            <p className="text-ink-2" style={{ margin: '0 0 14px', fontSize: 12 }}>
              They'll receive an email invite. The link is valid for 7 days.
            </p>
            <div>
              <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="someone@aurora.dev"
                className="w-full rounded-[6px] border border-line bg-bg text-ink placeholder:text-ink-3 focus:outline-none focus:border-line-strong"
                style={{ height: 40, padding: '0 12px', fontSize: 13 }}
              />
            </div>
            <div className="rounded-[6px] bg-bg-soft border border-line flex items-start" style={{ marginTop: 14, padding: '10px 12px', gap: 8 }}>
              <span className="font-mono text-ink-2">ⓘ</span>
              <div className="text-ink-2" style={{ fontSize: 11, lineHeight: 1.5 }}>
                Authors can write blogs under {company.name}. They cannot invite others or edit company settings.
              </div>
            </div>
            <div className="flex justify-end" style={{ gap: 8, marginTop: 18 }}>
              <button
                onClick={() => setShowInviteModal(false)}
                className="border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteEmail.trim()}
                className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors disabled:opacity-50"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                {inviting ? 'Sending…' : 'Send invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
