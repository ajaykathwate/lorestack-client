import { useState } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { useChangePassword } from '@/api/hooks/useAuthMutations'

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--ls-line)',
  borderRadius: 4,
  padding: '9px 12px',
  fontSize: 13,
  background: 'var(--ls-bg)',
  color: 'var(--ls-ink)',
  outline: 'none',
  boxSizing: 'border-box',
  height: 40,
}

export function AccountSettingsPage() {
  const { user } = useAuthStore()
  const { mutate: changePassword, isPending } = useChangePassword()

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')

  const isGoogleUser = user?.provider === 'GOOGLE'

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    if (newPassword.length < 8) {
      setFormError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success('Password changed successfully.')
          setShowPasswordForm(false)
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setFormError('')
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Failed to change password.'
          setFormError(msg)
        },
      },
    )
  }

  function handleCancel() {
    setShowPasswordForm(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setFormError('')
  }

  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Settings</span>
      <h1 className="font-serif font-semibold text-ink" style={{ fontSize: 24, marginTop: 4 }}>Account</h1>
      <p className="text-ink-2" style={{ margin: '4px 0 22px', fontSize: 13 }}>
        Login credentials and active sessions.
      </p>

      {/* Email */}
      <div className="border border-line rounded-[6px]" style={{ padding: 18, marginBottom: 14 }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-ink" style={{ fontSize: 15 }}>Email address</h3>
            <div className="font-mono text-ink-2" style={{ fontSize: 13, marginTop: 4 }}>
              {user?.email ?? '—'}
            </div>
            <div className="text-ink-3" style={{ fontSize: 11, marginTop: 4 }}>
              Verified · changing email coming soon
            </div>
          </div>
          <button
            disabled
            className="border border-line bg-bg text-ink-2 rounded-[4px] cursor-not-allowed opacity-50"
            style={{ padding: '5px 10px', fontSize: 12 }}
          >
            Change email
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="border border-line rounded-[6px]" style={{ padding: 18, marginBottom: 14 }}>
        {isGoogleUser ? (
          <div>
            <h3 className="font-semibold text-ink" style={{ fontSize: 15 }}>Password</h3>
            <p className="text-ink-3" style={{ fontSize: 12, marginTop: 6 }}>
              Your account uses Google sign-in. Password login is not available.
            </p>
          </div>
        ) : !showPasswordForm ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-ink" style={{ fontSize: 15 }}>Password</h3>
              <div className="text-ink-3" style={{ fontSize: 11, marginTop: 4 }}>
                Change your account password
              </div>
            </div>
            <button
              onClick={() => setShowPasswordForm(true)}
              className="border border-line bg-bg text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
              style={{ padding: '5px 10px', fontSize: 12 }}
            >
              Change password
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 className="font-semibold text-ink" style={{ fontSize: 15 }}>Change password</h3>

            <div>
              <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                New password <span className="font-normal text-ink-3">(min 8 characters)</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={inputStyle}
              />
            </div>

            {formError && (
              <p className="text-red-500" style={{ fontSize: 12 }}>{formError}</p>
            )}

            <div className="flex" style={{ gap: 8 }}>
              <button
                type="submit"
                disabled={isPending || !currentPassword || !newPassword || !confirmPassword}
                className="bg-ink text-bg font-medium rounded-[4px] hover:bg-black transition-colors disabled:opacity-50"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                {isPending ? 'Saving…' : 'Save new password'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="border border-line rounded-[6px] bg-bg-soft" style={{ padding: '10px 14px' }}>
        <span className="text-ink-3" style={{ fontSize: 12 }}>
          More account settings coming soon.
        </span>
      </div>
    </div>
  )
}
