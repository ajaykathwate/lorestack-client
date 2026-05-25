import type { ArticleType } from '@/types/api'

/** Canonical filter list used by HomePage and ExplorePage type chips. */
export const ARTICLE_TYPE_FILTERS: { label: string; value: ArticleType | '' }[] = [
  { label: 'All',             value: '' },
  { label: 'Engineering',     value: 'engineering_blog' },
  { label: 'Architecture',    value: 'architecture_deep_dive' },
  { label: 'Case study',      value: 'case_study' },
  { label: 'Founder note',    value: 'founder_note' },
  { label: 'Postmortem',      value: 'failure_postmortem' },
  { label: 'Tutorial',        value: 'tutorial' },
  { label: 'AI experiment',   value: 'ai_experiment' },
  { label: 'Opinion',         value: 'opinion_essay' },
  { label: 'Open source',     value: 'open_source_release' },
  { label: 'Scaling story',   value: 'scaling_story' },
  { label: 'Project showcase',value: 'project_showcase' },
  { label: 'Other',           value: 'other' },
]
