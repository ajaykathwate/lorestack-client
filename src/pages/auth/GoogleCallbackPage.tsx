import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { profileService } from '@/api/services/profileService'
import { authService } from '@/api/services/authService'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { ROUTES } from '@/constants/routes'

// Backend redirects to this page after Google OAuth with accessToken + refreshToken in query params.
export function GoogleCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth, setAuthorProfile } = useAuthStore()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')

    if (!accessToken || !refreshToken) {
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }

    ;(async () => {
      try {
        const userRes = await authService.me()
        const user = userRes.data.data
        setAuth(accessToken, refreshToken, user, null)

        try {
          const profileRes = await profileService.getMe()
          setAuthorProfile(profileRes.data.data)
          navigate(ROUTES.DASHBOARD, { replace: true })
        } catch {
          setAuthorProfile(null)
          navigate(ROUTES.ONBOARDING, { replace: true })
        }
      } catch {
        navigate(ROUTES.LOGIN, { replace: true })
      }
    })()
  }, [params, navigate, setAuth, setAuthorProfile])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-[13px] text-ink-3 font-sans">Signing you in…</p>
      </div>
    </div>
  )
}
