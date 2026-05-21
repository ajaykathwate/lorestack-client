import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAcceptInvite, useDeclineInvite } from '@/api/hooks/useCompanyMutations'
import { useAuthStore } from '@/store/authStore'
import { buildRoute } from '@/constants/routes'

export function AcceptInvitePage() {
  const { token = '' } = useParams()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [done, setDone] = useState<'accepted' | 'declined' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { mutate: accept, isPending: accepting } = useAcceptInvite()
  const { mutate: decline, isPending: declining } = useDeclineInvite()

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        style={{ gap: 16, padding: '0 24px' }}
      >
        <div
          className="rounded-full bg-ls-accent/10 border border-ls-accent/20 flex items-center justify-center"
          style={{ width: 64, height: 64, fontSize: 28 }}
        >
          ✉
        </div>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26 }}>
          You've been invited
        </h1>
        <p className="font-serif text-ink-2" style={{ fontSize: 15, maxWidth: 360 }}>
          Sign in to your Lorestack account to accept this team invitation.
        </p>
        <Link
          to={`/login?redirect=/invites/${token}`}
          className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
          style={{ padding: '10px 24px', fontSize: 13 }}
        >
          Sign in to continue
        </Link>
        <Link to="/register" className="text-ink-3 underline underline-offset-2" style={{ fontSize: 12 }}>
          Don't have an account? Create one
        </Link>
      </div>
    )
  }

  if (done === 'accepted') {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        style={{ gap: 16, padding: '0 24px' }}
      >
        <div
          className="rounded-full bg-green-100 flex items-center justify-center"
          style={{ width: 64, height: 64, fontSize: 28 }}
        >
          ✓
        </div>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26 }}>Welcome to the team!</h1>
        <p className="font-serif text-ink-2" style={{ fontSize: 15, maxWidth: 360 }}>
          You've successfully joined. Head to your dashboard to start writing.
        </p>
        <Link
          to="/dashboard"
          className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
          style={{ padding: '10px 24px', fontSize: 13 }}
        >
          Go to dashboard
        </Link>
      </div>
    )
  }

  if (done === 'declined') {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        style={{ gap: 16, padding: '0 24px' }}
      >
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26 }}>Invite declined</h1>
        <p className="font-serif text-ink-2" style={{ fontSize: 15, maxWidth: 360 }}>
          You've declined this invitation. You can always accept another invite in the future.
        </p>
        <Link to="/dashboard" className="text-ls-accent underline underline-offset-2" style={{ fontSize: 13 }}>
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  function handleAccept() {
    setError(null)
    accept(token, {
      onSuccess: (company) => {
        if (company?.handle) {
          navigate(buildRoute.companyDashboard(company.handle))
        } else {
          setDone('accepted')
        }
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message ?? 'This invite link is invalid or has expired.'
        setError(msg)
      },
    })
  }

  function handleDecline() {
    setError(null)
    decline(token, {
      onSuccess: () => setDone('declined'),
      onError: () => setDone('declined'),
    })
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh]"
      style={{ padding: '0 24px' }}
    >
      <div
        className="rounded-[10px] border border-line bg-bg"
        style={{ width: '100%', maxWidth: 460, padding: 32 }}
      >
        {/* Icon */}
        <div
          className="rounded-full bg-ls-accent/10 border border-ls-accent/20 flex items-center justify-center font-serif font-bold"
          style={{ width: 56, height: 56, fontSize: 24, marginBottom: 20, color: 'var(--ls-accent)' }}
        >
          C
        </div>

        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
          Team invitation
        </span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 24, marginTop: 6, marginBottom: 8 }}>
          You've been invited to join a company
        </h1>
        <p className="font-serif text-ink-2" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          You've been invited to collaborate as an <strong>Author</strong> on Lorestack. As an author
          you can write and publish articles under the company page.
        </p>

        {/* Permissions */}
        <div
          className="rounded-[6px] border border-line bg-bg-tint"
          style={{ padding: '12px 16px', marginBottom: 24 }}
        >
          <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.1px', marginBottom: 10 }}>
            What you'll be able to do
          </div>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {[
              'Write and publish articles under the company page',
              'Add milestones to the company timeline',
              'Appear as an author on company posts',
            ].map((item) => (
              <div key={item} className="flex items-start" style={{ gap: 8 }}>
                <span className="text-ls-accent flex-shrink-0" style={{ fontSize: 14, marginTop: 1 }}>✓</span>
                <span className="text-ink-2" style={{ fontSize: 13 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div
            className="rounded-[6px] border border-red-200 bg-red-50 text-red-700"
            style={{ padding: '10px 14px', fontSize: 13, marginBottom: 16 }}
          >
            {error}
          </div>
        )}

        <div className="flex" style={{ gap: 10 }}>
          <button
            onClick={handleAccept}
            disabled={accepting || declining}
            className="flex-1 bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors disabled:opacity-50"
            style={{ padding: '11px 0', fontSize: 13 }}
          >
            {accepting ? 'Accepting…' : 'Accept invitation'}
          </button>
          <button
            onClick={handleDecline}
            disabled={accepting || declining}
            className="border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors disabled:opacity-50"
            style={{ padding: '11px 16px', fontSize: 13 }}
          >
            {declining ? 'Declining…' : 'Decline'}
          </button>
        </div>
      </div>
    </div>
  )
}
