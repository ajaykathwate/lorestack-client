import { z } from 'zod'

const ARTICLE_TYPES = [
  'engineering_blog',
  'architecture_deep_dive',
  'case_study',
  'scaling_story',
  'failure_postmortem',
  'ai_experiment',
  'founder_note',
  'tutorial',
  'opinion_essay',
  'project_showcase',
  'open_source_release',
  'other',
] as const

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150, 'Title must be 150 characters or less'),
  articleType: z.enum(ARTICLE_TYPES, { required_error: 'Article type is required' }),
  body: z.string().optional(),
  companyId: z.string().uuid('Invalid company ID').optional(),
  summary: z.string().max(300, 'Summary must be 300 characters or less').optional(),
  coverImageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  seoTitleOverride: z.string().max(60, 'SEO title must be 60 characters or less').optional(),
  seoDescOverride: z.string().max(160, 'SEO description must be 160 characters or less').optional(),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed').optional(),
})

export type CreateBlogFormValues = z.infer<typeof createBlogSchema>

export const updateBlogSchema = createBlogSchema.partial()

export type UpdateBlogFormValues = z.infer<typeof updateBlogSchema>

export const scheduleBlogSchema = z.object({
  scheduledAt: z.string().min(1, 'Scheduled date is required'),
  scheduledTimezone: z.string().optional(),
})

export type ScheduleBlogFormValues = z.infer<typeof scheduleBlogSchema>
