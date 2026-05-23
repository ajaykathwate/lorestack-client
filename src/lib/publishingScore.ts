export interface ScoreSignal {
  key: string
  label: string
  points: number   // max possible points for this signal
  earned: number   // points actually earned
  status: 'pass' | 'warn' | 'fail'
  hint: string | null
}

export interface PublishingScore {
  total: number       // 0-100
  signals: ScoreSignal[]
  firstFailingHint: string | null
  level: 'low' | 'medium' | 'high'
}

function wordCount(html: string): number {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length
}

function avgSentenceLength(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  if (sentences.length === 0) return 0
  const totalWords = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).filter(Boolean).length, 0)
  return totalWords / sentences.length
}

export function computePublishingScore(params: {
  title: string
  summary: string
  coverImageUrl: string
  body: string
  tags: string[]
  seoTitleOverride?: string
  seoDescOverride?: string
}): PublishingScore {
  const { title, summary, coverImageUrl, body, tags, seoTitleOverride, seoDescOverride } = params

  const wc = wordCount(body)
  const hasHeadings = /<h[2-6]/i.test(body)
  const avgSentLen = avgSentenceLength(body)
  const tagCount = tags.filter(Boolean).length

  const signals: ScoreSignal[] = [
    // Summary — 20 pts
    (() => {
      const len = summary.trim().length
      if (len >= 80) return { key: 'summary', label: 'Summary added', points: 20, earned: 20, status: 'pass', hint: null }
      if (len > 0) return { key: 'summary', label: 'Summary added', points: 20, earned: 10, status: 'warn', hint: `Summary is too short (${len}/80 chars minimum)` }
      return { key: 'summary', label: 'Summary added', points: 20, earned: 0, status: 'fail', hint: 'Add a summary (80+ characters)' }
    })() as ScoreSignal,

    // Cover image — 20 pts
    (() => {
      if (coverImageUrl.trim()) return { key: 'cover', label: 'Cover image', points: 20, earned: 20, status: 'pass', hint: null }
      return { key: 'cover', label: 'Cover image', points: 20, earned: 0, status: 'fail', hint: 'Add a cover image' }
    })() as ScoreSignal,

    // Reading structure — 15 pts (headings in body)
    (() => {
      if (wc >= 300 && hasHeadings) return { key: 'structure', label: 'Reading structure', points: 15, earned: 15, status: 'pass', hint: null }
      if (wc >= 100) return { key: 'structure', label: 'Reading structure', points: 15, earned: 8, status: 'warn', hint: 'Add headings (H2/H3) to improve readability' }
      return { key: 'structure', label: 'Reading structure', points: 15, earned: 0, status: 'fail', hint: 'Write at least 100 words with headings' }
    })() as ScoreSignal,

    // SEO quality — 15 pts
    (() => {
      const hasSeoTitle = (seoTitleOverride ?? '').trim().length > 0
      const hasSeoDesc = (seoDescOverride ?? '').trim().length > 0
      const titleLen = title.trim().length
      if (hasSeoTitle && hasSeoDesc) return { key: 'seo', label: 'SEO quality', points: 15, earned: 15, status: 'pass', hint: null }
      if (titleLen >= 20 && titleLen <= 60) return { key: 'seo', label: 'SEO quality', points: 15, earned: 8, status: 'warn', hint: 'Add SEO title & description overrides for better reach' }
      return { key: 'seo', label: 'SEO quality', points: 15, earned: 4, status: 'warn', hint: 'Add SEO title & description overrides' }
    })() as ScoreSignal,

    // Tags — 15 pts
    (() => {
      if (tagCount >= 3) return { key: 'tags', label: 'Tags added', points: 15, earned: 15, status: 'pass', hint: null }
      if (tagCount >= 1) return { key: 'tags', label: 'Tags added', points: 15, earned: 8, status: 'warn', hint: 'Add 3+ tags for best discoverability (currently ' + tagCount + ')' }
      return { key: 'tags', label: 'Tags added', points: 15, earned: 0, status: 'fail', hint: 'Add at least 1 tag' }
    })() as ScoreSignal,

    // Readability — 15 pts (avg sentence length <= 25 words)
    (() => {
      if (wc < 50) return { key: 'readability', label: 'Readability', points: 15, earned: 0, status: 'fail', hint: 'Write more content to assess readability' }
      if (avgSentLen <= 20) return { key: 'readability', label: 'Readability', points: 15, earned: 15, status: 'pass', hint: null }
      if (avgSentLen <= 30) return { key: 'readability', label: 'Readability', points: 15, earned: 8, status: 'warn', hint: 'Try shorter sentences for better readability' }
      return { key: 'readability', label: 'Readability', points: 15, earned: 4, status: 'warn', hint: 'Sentences are too long on average — aim for under 25 words' }
    })() as ScoreSignal,
  ]

  const total = Math.min(100, signals.reduce((s, sig) => s + sig.earned, 0))
  const firstFailing = signals.find((s) => s.status !== 'pass')
  const level: PublishingScore['level'] = total >= 80 ? 'high' : total >= 50 ? 'medium' : 'low'

  return { total, signals, firstFailingHint: firstFailing?.hint ?? null, level }
}
