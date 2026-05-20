import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { FormInput } from '@/shared/components/forms/FormInput'
import { SubmitButton } from '@/shared/components/forms/SubmitButton'
import { FormError } from '@/shared/components/forms/FormError'
import { useResetPassword } from '@/api/hooks/useAuthMutations'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validations/authSchemas'
import { ROUTES } from '@/constants/routes'
import type { ApiError } from '@/api/client/apiError'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const { mutate, isPending, error } = useResetPassword()

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const apiError = error as ApiError | null

  function onSubmit(values: ResetPasswordFormValues) {
    mutate(
      { token, password: values.password },
      {
        onSuccess: () => {
          toast.success('Password reset. Please log in.')
          navigate(ROUTES.LOGIN)
        },
      },
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-bg font-sans flex items-center justify-center" style={{ padding: 48 }}>
        <div className="w-full flex flex-col items-center" style={{ maxWidth: 400, gap: 16 }}>
          <Wordmark size={20} />
          <p className="text-ink-3" style={{ fontSize: 14, marginTop: 24 }}>
            This reset link is invalid or has expired.
          </p>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-ls-accent underline underline-offset-2"
            style={{ fontSize: 13 }}
          >
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg font-sans flex items-center justify-center" style={{ padding: 48 }}>
      <div className="w-full flex flex-col" style={{ maxWidth: 400, gap: 0 }}>
        <Wordmark size={20} />

        <div className="flex flex-col" style={{ gap: 14, marginTop: 32 }}>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.4px' }}>
            Step 3 of 3
          </span>
          <h2 className="font-serif font-bold text-ink" style={{ fontSize: 26, margin: 0 }}>
            Choose a new password
          </h2>
          <p className="text-ink-3" style={{ fontSize: 14, margin: 0 }}>
            Must be at least 8 characters with 1 uppercase letter and 1 number.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: 12, marginTop: 4 }}>
            {apiError && <FormError message={apiError.message} />}
            <FormInput
              control={control}
              name="password"
              label="New password"
              type="password"
              placeholder="••••••••"
            />
            <FormInput
              control={control}
              name="confirmPassword"
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
            />
            <SubmitButton isLoading={isPending} loadingText="Saving…" className="mt-1">
              Save new password
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  )
}
