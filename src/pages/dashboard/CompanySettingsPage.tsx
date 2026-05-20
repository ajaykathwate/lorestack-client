import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useCompanyByHandle } from '@/api/hooks/useCompanyQueries'
import { useUpdateCompany } from '@/api/hooks/useCompanyMutations'
import { FormInput } from '@/shared/components/forms/FormInput'
import { SubmitButton } from '@/shared/components/forms/SubmitButton'
import { FormError } from '@/shared/components/forms/FormError'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { updateCompanySchema, type UpdateCompanyFormValues } from '@/lib/validations/companySchemas'
import type { ApiError } from '@/api/client/apiError'

export function CompanySettingsPage() {
  const { handle = '' } = useParams()
  const { data: company, isLoading } = useCompanyByHandle(handle)
  const { mutate: updateCompany, isPending, error } = useUpdateCompany(handle)
  const apiError = error as ApiError | null

  const { control, handleSubmit } = useForm<UpdateCompanyFormValues>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      name: company?.name ?? '',
      tagline: company?.tagline ?? '',
      websiteUrl: company?.websiteUrl ?? '',
      logoUrl: company?.logoUrl ?? '',
    },
  })

  function onSubmit(values: UpdateCompanyFormValues) {
    updateCompany(values, {
      onSuccess: () => toast.success('Company settings saved.'),
      onError: () => toast.error('Failed to save settings.'),
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
    <div className="flex flex-col" style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 24 }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Settings</span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>{company?.name ?? 'Company'} settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: 14 }}>
        {apiError && <FormError message={apiError.message} />}

        <FormInput control={control} name="name" label="Company name" placeholder="Aurora Labs" />

        <div>
          <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 500 }}>Handle</label>
          <div
            className="flex items-center border border-line rounded-[6px] bg-bg-soft text-ink-3 mt-1"
            style={{ height: 44, padding: '0 12px', fontSize: 14 }}
          >
            lorestack.com/company/{handle}
          </div>
          <p className="text-ink-3" style={{ fontSize: 12, marginTop: 4 }}>Handle cannot be changed.</p>
        </div>

        <FormInput control={control} name="tagline" label="Tagline" placeholder="Infra for the AI-native era" />
        <FormInput control={control} name="websiteUrl" label="Website URL" placeholder="https://aurora-labs.com" />
        <FormInput control={control} name="logoUrl" label="Logo URL" placeholder="https://example.com/logo.png" />

        <SubmitButton isLoading={isPending} loadingText="Saving…" className="w-auto self-start px-8 mt-2">
          Save changes
        </SubmitButton>
      </form>
    </div>
  )
}
