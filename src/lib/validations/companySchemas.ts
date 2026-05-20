import { z } from 'zod'

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  handle: z
    .string()
    .min(2, 'Handle must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Handle may only contain lowercase letters, numbers, and hyphens'),
  tagline: z.string().min(1, 'Tagline is required'),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  coverImageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  stage: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  founderSocialLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isPublic: z.boolean().optional(),
})

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>

export const updateCompanySchema = createCompanySchema.omit({ handle: true }).partial()

export type UpdateCompanyFormValues = z.infer<typeof updateCompanySchema>

export const inviteAuthorSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type InviteAuthorFormValues = z.infer<typeof inviteAuthorSchema>
