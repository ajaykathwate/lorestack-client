import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { useVerifyEmail, useResendVerification } from '@/api/hooks/useAuthMutations'
import { ROUTES } from '@/constants/routes'

export function EmailVerifyPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [resendEmail, setResendEmail] = useState('')
  const [resendSent, setResendSent] = useState(false)

  const { mutate: verifyEmail } = useVerifyEmail()
  const { mutate: resend, isPending: resendPending } = useResendVerification()

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    verifyEmail(
      { token },
      { onSuccess: () => setStatus('success'), onError: () => setStatus('error') },
    )
  }, [token, verifyEmail])

  return (
    <div className="min-h-screen bg-bg font-sans flex items-center justify-center" style={{ padding: 48 }}>
      <div className="w-full flex flex-col items-center text-center" style={{ maxWidth: 400, gap: 0 }}>
        <Wordmark size={20} />

        {status === 'loading' && (
          <div className="flex flex-col items-center" style={{ gap: 12, marginTop: 48 }}>
            <Spinner size="lg" />
            <p className="text-ink-3" style={{ fontSize: 14 }}>Verifying your email…</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center" style={{ gap: 14, marginTop: 40 }}>
            <div style={{ fontSize: 48 }}>✉</div>
            <h2 className="font-serif font-bold text-ink" style={{ fontSize: 26, margin: 0 }}>
              Email verified!
            </h2>
            <p className="text-ink-3" style={{ fontSize: 14 }}>
              Your email has been confirmed. You can now log in.
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center justify-center bg-ink text-bg rounded-[6px] font-medium hover:bg-black transition-colors"
              style={{ height: 44, padding: '0 20px', fontSize: 14, marginTop: 4 }}
            >
              Go to log in
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center" style={{ gap: 14, marginTop: 40 }}>
            <div style={{ fontSize: 48 }}>⚠</div>
            <h2 className="font-serif font-bold text-ink" style={{ fontSize: 26, margin: 0 }}>
              Verification failed
            </h2>
            <p className="text-ink-3" style={{ fontSize: 14 }}>
              This link has expired or is invalid. Enter your email to get a new one.
            </p>

            {!resendSent ? (
              <div className="w-full flex flex-col" style={{ gap: 8, marginTop: 4 }}>
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="you@studio.dev"
                  className="w-full rounded-[6px] border border-line bg-bg text-ink placeholder:text-ink-3 focus:outline-none focus:ring-1 focus:ring-ls-accent focus:border-ls-accent transition-colors"
                  style={{ height: 44, padding: '0 12px', fontSize: 14 }}
                />
                <button
                  disabled={resendPending || !resendEmail}
                  onClick={() =>
                    resend({ email: resendEmail }, { onSuccess: () => setResendSent(true) })
                  }
                  className="w-full bg-ink text-bg rounded-[6px] font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ height: 44, fontSize: 14 }}
                >
                  {resendPending ? 'Sending…' : 'Resend verification email'}
                </button>
              </div>
            ) : (
              <p className="text-ink-3" style={{ fontSize: 14, marginTop: 4 }}>
                Verification email sent — check your inbox.
              </p>
            )}

            <Link
              to={ROUTES.LOGIN}
              className="text-ls-accent underline underline-offset-2 hover:text-accent-ink"
              style={{ fontSize: 13 }}
            >
              ← Back to log in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
