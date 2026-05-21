import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useCompanyByHandle, useCompanyMembers, useCompanyMilestones } from '@/api/hooks/useCompanyQueries'
import { useCompanyBlogs } from '@/api/hooks/useBlogQueries'
import { useInviteAuthor, useRemoveMember, useAddMilestone } from '@/api/hooks/useCompanyMutations'
import { buildRoute } from '@/constants/routes'
import { initials, articleTypeLabel, formatDateShort, formatDate } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'
import type { MilestoneType } from '@/types/api'

type Tab = 'overview' | 'blogs' | 'team' | 'timeline' | 'settings'

const MILESTONE_TYPE_LABELS: Record<string, string> = {
  launch: 'LAUNCH', user_milestone: 'MILESTONE', infra_update: 'INFRA',
  funding: 'FUNDING', feature_release: 'FEATURE', bug_fixed: 'BUG FIX',
  partnership: 'PARTNERSHIP', hiring: 'HIRING', experiment: 'EXPERIMENT', other: 'OTHER',
}

const MILESTONE_TYPES: MilestoneType[] = [
  'launch', 'user_milestone', 'infra_update', 'funding', 'feature_release',
  'bug_fixed', 'partnership', 'hiring', 'experiment', 'other',
]

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid var(--ls-line)', borderRadius: 4,
  padding: '8px 10px', fontSize: 13, background: 'var(--ls-bg)',
  color: 'var(--ls-ink)', outline: 'none', boxSizing: 'border-box',
}

export function CompanyDashboardPage() {
  const { handle = '' } = useParams()
  const [activeTab, setActiveTab] = useState<Tab>('team')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  // Milestone form state
  const [milestoneType, setMilestoneType] = useState<MilestoneType>('launch')
  const [milestoneHeadline, setMilestoneHeadline] = useState('')
  const [milestoneDesc, setMilestoneDesc] = useState('')
  const [milestoneMetric, setMilestoneMetric] = useState('')
  const [milestoneDate, setMilestoneDate] = useState('')
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)

  const { data: company, isLoading } = useCompanyByHandle(handle)
  const { data: members } = useCompanyMembers(handle)
  const { data: blogs } = useCompanyBlogs(handle)
  const { data: milestones } = useCompanyMilestones(handle)
  const { mutate: inviteAuthor, isPending: inviting } = useInviteAuthor(handle)
  const { mutate: removeMember } = useRemoveMember(handle)
  const { mutate: addMilestone, isPending: addingMilestone } = useAddMilestone(handle)

  const team = members ?? []
  const articles = blogs ?? []
  const timeline = milestones ?? []

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
    removeMember(userId, {
      onSuccess: () => toast.success(`${name} removed.`),
      onError: () => toast.error('Failed to remove member.'),
    })
  }

  function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault()
    if (!milestoneHeadline.trim() || !milestoneDate) return
    addMilestone(
      {
        type: milestoneType,
        headline: milestoneHeadline.trim(),
        ...(milestoneDesc ? { description: milestoneDesc } : {}),
        ...(milestoneMetric ? { impactMetric: milestoneMetric } : {}),
        milestoneDate,
      },
      {
        onSuccess: () => {
          toast.success('Milestone added.')
          setMilestoneHeadline('')
          setMilestoneDesc('')
          setMilestoneMetric('')
          setMilestoneDate('')
          setMilestoneType('launch')
          setShowMilestoneForm(false)
        },
        onError: () => toast.error('Failed to add milestone.'),
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
      <div className="flex items-start border-b border-line" style={{ gap: 14, paddingBottom: 18 }}>
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
          { key: 'blogs',    label: `Blogs · ${articles.length}` },
          { key: 'team',     label: `Team · ${team.length}` },
          { key: 'timeline', label: `Timeline · ${timeline.length}` },
          { key: 'settings', label: 'Settings' },
        ] as { key: Tab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="font-sans transition-colors"
            style={{
              padding: '10px 0', fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? 'var(--ls-ink)' : 'var(--ls-ink-3)',
              borderBottom: activeTab === tab.key ? '2px solid var(--ls-accent)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview tab ──────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col" style={{ gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Total blogs',  value: articles.length.toString() },
              { label: 'Team size',    value: team.length.toString() },
              { label: 'Milestones',   value: timeline.length.toString() },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-[6px] border border-line bg-bg" style={{ padding: 14 }}>
                <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>{label}</div>
                <div className="font-serif font-semibold text-ink" style={{ fontSize: 22, marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-[6px] border border-line bg-bg" style={{ padding: 16 }}>
            <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 8 }}>Company info</div>
            <div className="font-serif font-bold text-ink" style={{ fontSize: 18 }}>{company.name}</div>
            <div className="text-ink-2" style={{ fontSize: 14, marginTop: 4 }}>{company.tagline}</div>
            {company.industry && (
              <span className="inline-block font-mono rounded-[3px] bg-ls-accent text-white" style={{ fontSize: 10, padding: '2px 6px', marginTop: 8 }}>
                {company.industry}
              </span>
            )}
            {company.techStack.length > 0 && (
              <div className="flex flex-wrap" style={{ gap: 6, marginTop: 8 }}>
                {company.techStack.map((t) => (
                  <span key={t} className="border border-line text-ink-2 rounded-full" style={{ fontSize: 11, padding: '2px 8px' }}>{t}</span>
                ))}
              </div>
            )}
            {company.websiteUrl && (
              <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-ls-accent block" style={{ fontSize: 12, marginTop: 10 }}>
                ↗ {company.websiteUrl}
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Blogs tab ─────────────────────────────────────────────────────── */}
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
                    display: 'grid', gridTemplateColumns: '1fr 120px 110px 80px',
                    padding: '14px 14px', gap: 14, alignItems: 'center',
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
                  <span className="text-ink-3" style={{ fontSize: 12 }}>{formatDateShort(blog.publishedAt ?? blog.updatedAt)}</span>
                  <Link to={buildRoute.editor(blog.slug)} className="text-ink-3 hover:text-ink transition-colors text-right" style={{ fontSize: 12 }}>
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Team tab ──────────────────────────────────────────────────────── */}
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
                    display: 'grid', gridTemplateColumns: '40px 1fr 100px 130px 60px',
                    padding: '12px 14px', gap: 14, alignItems: 'center',
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
                    className={`rounded-[3px] font-mono text-center ${member.role === 'owner' ? 'bg-ls-accent text-white' : 'border border-line text-ink-2'}`}
                    style={{ fontSize: 10, padding: '2px 6px' }}
                  >
                    {member.role === 'owner' ? 'Owner' : 'Author'}
                  </span>
                  <span className="text-ink-3" style={{ fontSize: 11 }}>joined {formatDateShort(member.joinedAt)}</span>
                  {member.role !== 'owner' ? (
                    <button
                      onClick={() => handleRemove(member.userId, member.displayName)}
                      className="text-ink-3 hover:text-red-500 transition-colors text-right"
                      style={{ fontSize: 12 }}
                    >
                      Remove
                    </button>
                  ) : <span />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Timeline tab ──────────────────────────────────────────────────── */}
      {activeTab === 'timeline' && (
        <div className="flex flex-col" style={{ gap: 18 }}>
          <div className="flex justify-between items-baseline">
            <h3 className="font-serif font-bold text-ink" style={{ fontSize: 16 }}>
              Milestones <span className="text-ink-3 font-normal">· {timeline.length}</span>
            </h3>
            <button
              onClick={() => setShowMilestoneForm((v) => !v)}
              className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              {showMilestoneForm ? 'Cancel' : '+ Add milestone'}
            </button>
          </div>

          {/* Add milestone form */}
          {showMilestoneForm && (
            <form
              onSubmit={handleAddMilestone}
              className="rounded-[6px] border border-line bg-bg-soft"
              style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>New milestone</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Type</label>
                  <select
                    value={milestoneType}
                    onChange={(e) => setMilestoneType(e.target.value as MilestoneType)}
                    style={{ ...inputStyle, height: 38 }}
                  >
                    {MILESTONE_TYPES.map((t) => (
                      <option key={t} value={t}>{MILESTONE_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={milestoneDate}
                    onChange={(e) => setMilestoneDate(e.target.value)}
                    style={{ ...inputStyle, height: 38 }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Headline <span className="text-red-500">*</span> <span className="font-normal text-ink-3">(max 100)</span></label>
                <input
                  type="text"
                  value={milestoneHeadline}
                  onChange={(e) => setMilestoneHeadline(e.target.value.slice(0, 100))}
                  placeholder="Crossed 1,000 paying teams"
                  style={{ ...inputStyle, height: 38 }}
                  required
                />
              </div>
              <div>
                <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Description <span className="font-normal text-ink-3">(optional)</span></label>
                <textarea
                  value={milestoneDesc}
                  onChange={(e) => setMilestoneDesc(e.target.value)}
                  placeholder="What happened and why it matters…"
                  rows={2}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>
              <div>
                <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Impact metric <span className="font-normal text-ink-3">(optional, e.g. "10k users")</span></label>
                <input
                  type="text"
                  value={milestoneMetric}
                  onChange={(e) => setMilestoneMetric(e.target.value)}
                  placeholder="10k active users"
                  style={{ ...inputStyle, height: 38 }}
                />
              </div>
              <div className="flex justify-end" style={{ gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowMilestoneForm(false)}
                  className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingMilestone || !milestoneHeadline.trim() || !milestoneDate}
                  className="bg-ink text-bg font-medium rounded-[4px] hover:bg-black transition-colors disabled:opacity-50"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                >
                  {addingMilestone ? 'Adding…' : 'Add milestone'}
                </button>
              </div>
            </form>
          )}

          {/* Milestone timeline */}
          {timeline.length === 0 ? (
            <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
              <p className="text-ink-3" style={{ fontSize: 13 }}>No milestones yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="border-l border-line relative" style={{ paddingLeft: 24 }}>
              <div className="flex flex-col" style={{ gap: 20 }}>
                {timeline.map((m) => (
                  <div key={m.id} style={{ position: 'relative' }}>
                    <span
                      className="absolute border border-ls-accent rounded-full bg-bg"
                      style={{ left: -31, top: 6, width: 12, height: 12 }}
                    />
                    <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
                      <span className="border border-line text-ink-2 rounded-[3px] font-mono" style={{ fontSize: 10, padding: '2px 5px' }}>
                        {MILESTONE_TYPE_LABELS[m.type] ?? m.type.toUpperCase()}
                      </span>
                      <span className="text-ink-3" style={{ fontSize: 11 }}>{formatDate(m.milestoneDate)}</span>
                    </div>
                    <h3 className="font-serif font-bold text-ink" style={{ fontSize: 15 }}>{m.headline}</h3>
                    {m.description && (
                      <p className="font-serif text-ink-2" style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.55 }}>
                        {m.description}
                      </p>
                    )}
                    {m.impactMetric && (
                      <span
                        className="inline-block rounded-full"
                        style={{ fontSize: 11, padding: '2px 8px', marginTop: 6, background: 'var(--ls-accent-soft)', color: 'var(--ls-accent-ink)', border: '1px solid var(--ls-accent-soft)' }}
                      >
                        {m.impactMetric}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-ink-3" style={{ fontSize: 11 }}>
            The full timeline is visible on your <Link to={buildRoute.company(handle)} target="_blank" className="text-ls-accent underline">public company page ↗</Link>.
          </p>
        </div>
      )}

      {/* ── Settings tab ──────────────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div className="text-ink-2" style={{ fontSize: 13 }}>
          <p>Company settings are managed in the <Link to={buildRoute.companySettings(handle)} className="text-ls-accent underline">Settings page</Link>.</p>
        </div>
      )}

      {/* ── Invite modal ──────────────────────────────────────────────────── */}
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
            <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email address</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleInvite() }}
              placeholder="someone@aurora.dev"
              className="w-full rounded-[6px] border border-line bg-bg text-ink placeholder:text-ink-3 focus:outline-none focus:border-line-strong"
              style={{ height: 40, padding: '0 12px', fontSize: 13 }}
            />
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
