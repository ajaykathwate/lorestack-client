import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useCompanyMembers } from '@/api/hooks/useCompanyQueries'
import { useInviteAuthor, useRemoveMember } from '@/api/hooks/useCompanyMutations'
import { initials, formatDateShort } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function TeamManagementPage() {
  const { handle = '' } = useParams()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const { data: members, isLoading } = useCompanyMembers(handle)
  const { mutate: inviteAuthor, isPending: inviting } = useInviteAuthor(handle)
  const { mutate: removeMember } = useRemoveMember(handle)

  const team = members ?? []

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 200 }}>
        <Spinner size="md" />
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 18 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Team management</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            Team <span className="text-ink-3 font-normal" style={{ fontSize: 18 }}>· {team.length}</span>
          </h1>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
          style={{ padding: '8px 16px', fontSize: 13 }}
        >
          + Invite author
        </button>
      </div>

      {team.length === 0 ? (
        <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18 }}>No team members yet</h3>
          <p className="text-ink-2" style={{ margin: '6px 0 16px', fontSize: 13 }}>
            Invite authors to collaborate under this company.
          </p>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            + Invite first author
          </button>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {team.map((member, i) => (
            <div
              key={member.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 100px 140px 100px',
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
              <span className="text-ink-3" style={{ fontSize: 11 }}>joined {formatDateShort(member.joinedAt)}</span>
              {member.role !== 'owner' ? (
                <button
                  onClick={() => handleRemove(member.userId, member.displayName)}
                  className="text-ink-3 hover:text-red-500 transition-colors text-right"
                  style={{ fontSize: 12 }}
                >
                  Remove
                </button>
              ) : (
                <span />
              )}
            </div>
          ))}
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
                onKeyDown={(e) => { if (e.key === 'Enter') handleInvite() }}
                placeholder="someone@company.dev"
                className="w-full rounded-[6px] border border-line bg-bg text-ink placeholder:text-ink-3 focus:outline-none focus:border-line-strong"
                style={{ height: 44, padding: '0 12px', fontSize: 13 }}
              />
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
