import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { FormInput } from '@/shared/components/forms/FormInput'
import { SubmitButton } from '@/shared/components/forms/SubmitButton'
import { useLogin } from '@/api/hooks/useAuthMutations'
import { loginSchema, type LoginFormValues } from '@/lib/validations/authSchemas'
import { ROUTES } from '@/constants/routes'
import { env } from '@/config/env'
import type { ApiError } from '@/api/client/apiError'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mutate, isPending } = useLogin()

  const from = (location.state as { from?: string })?.from ?? ROUTES.DASHBOARD

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(values: LoginFormValues) {
    mutate(values, {
      onSuccess: ({ authorProfile }) => {
        toast.success('Welcome back!')
        // authorProfile is fetched atomically inside the mutation — no race condition
        navigate(authorProfile ? from : ROUTES.ONBOARDING, { replace: true })
      },
      onError: (err) => {
        toast.error((err as unknown as ApiError).message ?? 'Login failed. Please try again.')
      },
    })
  }

  return (
    <div className="min-h-screen font-sans" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* ── Left: editorial panel ─────────────────────────────────────── */}
      <div
        className="flex flex-col border-r border-line bg-bg-soft"
        style={{ padding: '46px 44px' }}
      >
        <Wordmark size={22} />

        <div className="flex-1 flex flex-col justify-center" style={{ gap: 18, maxWidth: 400 }}>
          <span
            className="font-mono uppercase text-ink-3"
            style={{ fontSize: 11, letterSpacing: '1.4px' }}
          >
            A home for engineering stories
          </span>

          <h1
            className="font-serif font-bold text-ink leading-tight"
            style={{ fontSize: 38, margin: 0 }}
          >
            Write the post-mortem the world needs to read.
          </h1>

          <p
            className="text-ink-3 leading-relaxed"
            style={{ fontSize: 15, margin: 0 }}
          >
            Long-form engineering blogs, architecture deep-dives, and build-in-public timelines —
            under your name or your company's.
          </p>

          <div className="flex items-center" style={{ gap: 10, marginTop: 14 }}>
            <div className="flex">
              {['A', 'B', 'C'].map((initial, i) => (
                <div
                  key={initial}
                  className="w-[26px] h-[26px] rounded-full bg-bg-deep border border-line flex items-center justify-center font-mono text-[10px] text-ink-2 flex-shrink-0"
                  style={{ marginLeft: i > 0 ? -8 : 0 }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <span className="text-ink-3" style={{ fontSize: 12 }}>2,400+ writers shipping</span>
          </div>
        </div>

        <div className="text-ink-3" style={{ fontSize: 11 }}>lorestack.com · est. 2026</div>
      </div>

      {/* ── Right: form panel ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-center bg-bg"
        style={{ padding: '46px 56px' }}
      >
        <div className="w-full flex flex-col" style={{ maxWidth: 380, gap: 14 }}>
          <h2
            className="font-serif font-bold text-ink"
            style={{ fontSize: 26, margin: 0 }}
          >
            Welcome back
          </h2>

          {/* Google button */}
          <a
            href={`${env.VITE_API_BASE_URL}/auth/google`}
            className="flex items-center justify-center border border-line rounded-[6px] text-ink-2 hover:bg-bg-tint transition-colors"
            style={{ height: 44, gap: 8, fontSize: 14 }}
          >
            <span className="font-mono font-bold" style={{ fontSize: 15 }}>G</span>
            Continue with Google
          </a>

          {/* Divider */}
          <div className="flex items-center" style={{ gap: 10, color: 'var(--ls-ink-3)', fontSize: 11, margin: '2px 0' }}>
            <span className="flex-1 bg-line-soft" style={{ height: 1 }} />
            OR
            <span className="flex-1 bg-line-soft" style={{ height: 1 }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: 12 }}>
            <FormInput
              control={control}
              name="email"
              label="Email address"
              type="email"
              placeholder="you@studio.dev"
            />
            <FormInput
              control={control}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
            />

            <div className="flex justify-end" style={{ marginTop: -4 }}>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-ls-accent underline underline-offset-2 hover:text-accent-ink"
                style={{ fontSize: 12 }}
              >
                Forgot password?
              </Link>
            </div>

            <SubmitButton isLoading={isPending} loadingText="Logging in…">
              Log in
            </SubmitButton>
          </form>

          <p className="text-center text-ink-2" style={{ fontSize: 13, marginTop: 4 }}>
            Don't have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="text-ls-accent underline underline-offset-2 hover:text-accent-ink"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
