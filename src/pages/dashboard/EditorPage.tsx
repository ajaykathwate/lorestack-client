import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { marked } from 'marked'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

marked.setOptions({ breaks: true, gfm: true })

// ── Register custom fonts & sizes ──────────────────────────────────────────
const Font = Quill.import('formats/font') as any
Font.whitelist = ['sans', 'serif', 'mono']
Quill.register(Font, true)

const Size = Quill.import('attributors/style/size') as any
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
Quill.register(Size, true)

function normalizeToHtml(body: string): string {
  if (!body) return ''
  if (/<[a-z][\s\S]*>/i.test(body)) return body
  return marked.parse(body) as string
}

import { useEditableBlog } from '@/api/hooks/useBlogQueries'
import { useCreateBlog, useUpdateBlog, usePublishBlog, useScheduleBlog } from '@/api/hooks/useBlogMutations'
import { useMyCompanies } from '@/api/hooks/useCompanyQueries'
import { ROUTES, buildRoute } from '@/constants/routes'
import { UserAvatar } from '@/shared/components/ui/UserAvatar'
import { computePublishingScore } from '@/lib/publishingScore'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { Settings, ChevronDown, CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react'
import { BLOG_CONFIG } from '@/config/blog'
import type { ArticleType } from '@/types/api'
import type { ScoreSignal } from '@/lib/publishingScore'

const ARTICLE_TYPE_META: Record<ArticleType, { label: string; desc: string }> = {
  engineering_blog:     { label: 'Engineering blog',     desc: 'How we solve technical problems' },
  architecture_deep_dive: { label: 'Architecture deep dive', desc: 'System design and trade-offs' },
  case_study:           { label: 'Case study',           desc: 'A specific customer or project' },
  scaling_story:        { label: 'Scaling story',        desc: 'Hitting and beating growth bottlenecks' },
  failure_postmortem:   { label: 'Failure postmortem',   desc: 'What broke, why, what we learned' },
  ai_experiment:        { label: 'AI experiment',        desc: 'Working with LLMs, agents, models' },
  founder_note:         { label: 'Founder note',         desc: 'Strategy, vision, behind-the-scenes' },
  tutorial:             { label: 'Tutorial',             desc: 'Step-by-step how-to' },
  opinion_essay:        { label: 'Opinion essay',        desc: 'A strong, well-reasoned take' },
  project_showcase:     { label: 'Project showcase',     desc: 'Something you shipped this week' },
  open_source_release:  { label: 'Open source release',  desc: 'OSS releases, contributions, RFCs' },
  other:                { label: 'Other',                desc: 'Anything else worth writing about' },
}

const ARTICLE_TYPES = Object.keys(ARTICLE_TYPE_META) as ArticleType[]

// Extract backend error message, fall back to a generic string.
function apiErr(err: unknown, fallback: string): string {
  return (err as any)?.response?.data?.message ?? fallback
}

const QUILL_FORMATS = [
  'font', 'size', 'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'blockquote', 'code-block',
  'list', 'indent', 'align', 'script',
  'link', 'image',
]

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'idle'

const SIX_MONTHS_MS = BLOG_CONFIG.SCHEDULE_MAX_MONTHS_AHEAD * 30 * 24 * 60 * 60 * 1000

// ── Two-row Quill toolbar ──────────────────────────────────────────────────
function QuillToolbar({ wordCount }: { wordCount: number }) {
  return (
    <div id="quill-toolbar" style={{ marginTop: 4 }}>
      {/* Primary row — styled box */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 76px 6px 10px',
        background: 'var(--ls-bg-soft)',
        border: '1px solid var(--ls-line)', borderRadius: 8,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6)',
        minWidth: 0,
      }}>
        <span className="ql-formats" style={{ margin: 0 }}>
          <select className="ql-font" defaultValue="" title="Font family">
            <option value="">Default</option>
            <option value="serif">Serif</option>
            <option value="mono">Monospace</option>
          </select>
        </span>

        <span className="ql-formats" style={{ margin: 0 }}>
          <select className="ql-size" defaultValue="" title="Font size">
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="">16</option>
            <option value="18px">18</option>
            <option value="20px">20</option>
            <option value="24px">24</option>
            <option value="28px">28</option>
            <option value="32px">32</option>
          </select>
        </span>

        <span className="ql-formats" style={{ margin: 0 }}>
          <select className="ql-header" defaultValue="" title="Heading">
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
            <option value="">Normal</option>
          </select>
        </span>

        <span style={{ width: 1, height: 20, background: 'var(--ls-line)', margin: '0 2px', flexShrink: 0 }} />

        <span className="ql-formats" style={{ margin: 0, display: 'flex', gap: 1 }}>
          <button className="ql-bold" title="Bold" />
          <button className="ql-italic" title="Italic" />
          <button className="ql-underline" title="Underline" />
          <button className="ql-strike" title="Strikethrough" />
        </span>

        <span className="ql-formats" style={{ margin: 0, display: 'flex', gap: 1 }}>
          <select className="ql-color" title="Text color" />
          <select className="ql-background" title="Highlight color" />
        </span>

        <span className="ql-formats" style={{ margin: 0, display: 'flex', gap: 1 }}>
          <button className="ql-script" value="sub" title="Subscript" />
          <button className="ql-script" value="super" title="Superscript" />
        </span>

        <span style={{ width: 1, height: 20, background: 'var(--ls-line)', margin: '0 2px', flexShrink: 0 }} />

        <span className="ql-formats" style={{ margin: 0, display: 'flex', gap: 1 }}>
          <button className="ql-blockquote" title="Blockquote" />
          <button className="ql-code-block" title="Code block" />
        </span>

        {/* Word count pinned inside the right edge of the box */}
        <span style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11, color: 'var(--ls-ink-3)', whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {wordCount} words
        </span>
      </div>

      {/* Secondary row — borderless */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 10px',
        borderBottom: '1px solid var(--ls-line-soft)',
        marginTop: 4,
      }}>
        <span className="ql-formats" style={{ margin: 0, display: 'flex', gap: 1 }}>
          <button className="ql-list" value="ordered" title="Ordered list" />
          <button className="ql-list" value="bullet" title="Bullet list" />
          <button className="ql-indent" value="-1" title="Outdent" />
          <button className="ql-indent" value="+1" title="Indent" />
        </span>

        <span className="ql-formats" style={{ margin: '0 0 0 6px', display: 'flex' }}>
          <select className="ql-align" title="Alignment" />
        </span>

        <span style={{ width: 1, height: 18, background: 'var(--ls-line-soft)', margin: '0 6px', flexShrink: 0 }} />

        <span className="ql-formats" style={{ margin: 0, display: 'flex', gap: 1 }}>
          <button className="ql-link" title="Link" />
          <button className="ql-image" title="Image" />
        </span>

        <span style={{ width: 1, height: 18, background: 'var(--ls-line-soft)', margin: '0 6px', flexShrink: 0 }} />

        <span className="ql-formats" style={{ margin: 0 }}>
          <button className="ql-clean" title="Clear formatting" />
        </span>
      </div>
    </div>
  )
}

// ── Shared popover shell ───────────────────────────────────────────────────
function Popover({
  pos, width, onClose, children,
}: {
  pos: { top: number; left: number }
  width: number
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(20,18,14,.12)', zIndex: 50 }}
        onClick={onClose}
      />
      <div style={{
        position: 'fixed', top: pos.top, left: pos.left,
        width, zIndex: 51,
        background: 'var(--ls-bg)',
        border: '1px solid var(--ls-line)', borderRadius: 10,
        boxShadow: '0 18px 48px rgba(20,18,14,.18), 0 0 0 1px rgba(20,18,14,.02)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {children}
      </div>
    </>
  )
}

export function EditorPage() {
  const { slug: urlSlug } = useParams()
  const navigate = useNavigate()
  const isNew = !urlSlug

  const { data: existingBlog } = useEditableBlog(urlSlug ?? '')
  const { data: companies } = useMyCompanies()

  const { mutate: createBlog, isPending: creating } = useCreateBlog()
  const { mutate: updateBlog } = useUpdateBlog()
  const { mutate: publishBlog, isPending: publishing } = usePublishBlog()
  const { mutate: scheduleBlog, isPending: scheduling } = useScheduleBlog()

  const [currentSlug, setCurrentSlug] = useState<string | null>(urlSlug ?? null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [articleType, setArticleType] = useState<ArticleType>('engineering_blog')
  const [companyId, setCompanyId] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [isCoverUploading, setIsCoverUploading] = useState(false)
  const [summary, setSummary] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [showSeo, setShowSeo] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  const [showRail, setShowRail] = useState(true)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [scheduleTimezone, setScheduleTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  )

  // FORMAT popover
  const formatBtnRef = useRef<HTMLButtonElement>(null)
  const [showFormatPopover, setShowFormatPopover] = useState(false)
  const [formatPopoverPos, setFormatPopoverPos] = useState<{ top: number; left: number } | null>(null)

  // PUBLICATION popover
  const pubBtnRef = useRef<HTMLButtonElement>(null)
  const [showPubPopover, setShowPubPopover] = useState(false)
  const [pubPopoverPos, setPubPopoverPos] = useState<{ top: number; left: number } | null>(null)

  // SCORE popover
  const scoreBtnRef = useRef<HTMLButtonElement>(null)
  const [showScorePopover, setShowScorePopover] = useState(false)
  const [scorePopoverPos, setScorePopoverPos] = useState<{ top: number; right: number } | null>(null)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)
  const quillRef = useRef<ReactQuill>(null)

  // Upload image to Cloudinary and insert into editor at cursor position
  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const toastId = toast.loading('Uploading image…')
      try {
        const url = await uploadToCloudinary(file, 'articles')
        const quill = quillRef.current?.getEditor()
        if (quill) {
          const range = quill.getSelection(true)
          quill.insertEmbed(range?.index ?? 0, 'image', url)
          quill.setSelection((range?.index ?? 0) + 1, 0)
        }
        toast.dismiss(toastId)
      } catch (err: any) {
        toast.dismiss(toastId)
        toast.error(err?.message ?? 'Image upload failed.')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const quillModules = useMemo(() => ({
    toolbar: {
      container: '#quill-toolbar',
      handlers: { image: imageHandler },
    },
  }), [imageHandler])

  function openFormatPopover() {
    if (formatBtnRef.current) {
      const r = formatBtnRef.current.getBoundingClientRect()
      setFormatPopoverPos({ top: r.bottom + 8, left: r.left })
    }
    setShowFormatPopover(true)
  }

  function openPubPopover() {
    if (pubBtnRef.current) {
      const r = pubBtnRef.current.getBoundingClientRect()
      setPubPopoverPos({ top: r.bottom + 8, left: r.left })
    }
    setShowPubPopover(true)
  }

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowFormatPopover(false)
        setShowPubPopover(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const selectedCompany = useMemo(
    () => (companies ?? []).find((c) => c.id === companyId) ?? null,
    [companies, companyId]
  )

  // Root-cause #2 fix: when navigating between slugs (or /write → /write/:slug)
  // React reuses the component instance without remounting. Reset all local state
  // and the initialized guard so the data effect can re-populate correctly.
  useEffect(() => {
    initialized.current = false
    setCurrentSlug(urlSlug ?? null)
    setTitle('')
    setBody('')
    setArticleType('engineering_blog')
    setCompanyId('')
    setTags([])
    setCoverImageUrl('')
    setSummary('')
    setSeoTitle('')
    setSeoDesc('')
    setSaveStatus('idle')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSlug])

  // Root-cause #1 fix: populate form once the blog data arrives.
  // `initialized.current` is false until the reset effect has fired, so this
  // only runs once per slug — even if the query refetches.
  useEffect(() => {
    if (existingBlog && !initialized.current) {
      initialized.current = true
      setTitle(existingBlog.title)
      setBody(normalizeToHtml(existingBlog.body ?? ''))
      setArticleType(existingBlog.articleType)
      setCompanyId(existingBlog.companyId ?? '')
      setTags(existingBlog.tags.map((t) => t.name))
      setCoverImageUrl(existingBlog.coverImageUrl ?? '')
      setSummary(existingBlog.summary ?? '')
      setSeoTitle(existingBlog.seoTitleOverride ?? '')
      setSeoDesc(existingBlog.seoDescOverride ?? '')
      setSaveStatus('saved')
    }
  }, [existingBlog])

  // For brand-new blogs (/write with no slug): mark initialized so autosave
  // doesn't fire before the user has typed anything.
  useEffect(() => {
    if (!initialized.current && isNew) initialized.current = true
  }, [isNew])

  const doSave = useCallback(
    (overrideSlug?: string) => {
      // Silently skip if title is too short — autosave calls this, so no toast here.
      if (title.trim().length < BLOG_CONFIG.TITLE_MIN_LENGTH) return

      const slug = overrideSlug ?? currentSlug
      const payload = {
        title: title.trim(),
        body, articleType,
        ...(companyId ? { companyId } : {}),
        tags,
        ...(coverImageUrl ? { coverImageUrl } : {}),
        ...(summary ? { summary } : {}),
        ...(seoTitle ? { seoTitleOverride: seoTitle } : {}),
        ...(seoDesc ? { seoDescOverride: seoDesc } : {}),
      }

      if (!slug) {
        setSaveStatus('saving')
        createBlog(payload, {
          onSuccess: (blog) => {
            setCurrentSlug(blog.slug)
            setSaveStatus('saved')
            navigate(buildRoute.editor(blog.slug), { replace: true })
          },
          onError: (err) => { setSaveStatus('unsaved'); toast.error(apiErr(err, 'Failed to save draft.')) },
        })
      } else {
        setSaveStatus('saving')
        updateBlog({ slug, payload }, {
          onSuccess: (blog) => {
            setSaveStatus('saved')
            if (blog.slug && blog.slug !== slug) {
              setCurrentSlug(blog.slug)
              navigate(buildRoute.editor(blog.slug), { replace: true })
            }
          },
          onError: (err) => { setSaveStatus('unsaved'); toast.error(apiErr(err, 'Failed to save.')) },
        })
      }
    },
    [title, body, articleType, companyId, tags, coverImageUrl, summary, seoTitle, seoDesc, currentSlug, createBlog, updateBlog, navigate],
  )

  const scheduleAutosave = useCallback(() => {
    setSaveStatus('unsaved')
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => doSave(), 2000)
  }, [doSave])

  useEffect(() => {
    if (!initialized.current || saveStatus === 'idle') return
    scheduleAutosave()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body])

  function handleSaveDraft() {
    if (title.trim().length < BLOG_CONFIG.TITLE_MIN_LENGTH) {
      toast.warning(`Title needs at least ${BLOG_CONFIG.TITLE_MIN_LENGTH} characters before saving.`)
      return
    }
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    doSave()
  }

  function handlePublish() {
    if (title.trim().length < BLOG_CONFIG.TITLE_MIN_LENGTH) {
      toast.warning(`Title needs at least ${BLOG_CONFIG.TITLE_MIN_LENGTH} characters before publishing.`)
      return
    }
    if (!currentSlug) { toast.error('Save the draft first.'); return }
    if (autosaveTimer.current) { clearTimeout(autosaveTimer.current); autosaveTimer.current = null }

    const doPublish = (slug: string) => {
      publishBlog(slug, {
        onSuccess: () => { toast.success('Blog published!'); navigate(ROUTES.MY_BLOGS) },
        onError: (err) => toast.error(apiErr(err, 'Failed to publish.')),
      })
    }

    if (saveStatus === 'unsaved') {
      const slug = currentSlug
      const payload = {
        title: title.trim(), body, articleType,
        ...(companyId ? { companyId } : {}), tags,
        ...(coverImageUrl ? { coverImageUrl } : {}),
        ...(summary ? { summary } : {}),
      }
      setSaveStatus('saving')
      updateBlog({ slug, payload }, {
        onSuccess: (blog) => {
          setSaveStatus('saved')
          const latestSlug = blog.slug ?? slug
          if (blog.slug && blog.slug !== slug) {
            setCurrentSlug(latestSlug)
            navigate(buildRoute.editor(latestSlug), { replace: true })
          }
          doPublish(latestSlug)
        },
        onError: (err) => { setSaveStatus('unsaved'); toast.error(apiErr(err, 'Could not save before publishing.')) },
      })
    } else {
      doPublish(currentSlug)
    }
  }

  function handleSchedule() {
    if (!currentSlug) { toast.error('Save the draft first.'); return }
    if (!scheduleDate || !scheduleTime) { toast.error('Please pick a date and time.'); return }
    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
    if (new Date(scheduledAt).getTime() <= Date.now()) { toast.error('Selected time is in the past.'); return }
    if (new Date(scheduledAt).getTime() > Date.now() + SIX_MONTHS_MS) {
      if (!confirm('Scheduling more than 6 months ahead — confirm?')) return
    }
    scheduleBlog({ slug: currentSlug, payload: { scheduledAt, scheduledTimezone: scheduleTimezone } }, {
      onSuccess: () => { toast.success('Blog scheduled!'); setShowScheduleModal(false); navigate(ROUTES.MY_BLOGS) },
      onError: (err) => toast.error(apiErr(err, 'Failed to schedule.')),
    })
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (!t || tags.includes(t) || tags.length >= BLOG_CONFIG.TAGS_MAX_COUNT) return
    setTags([...tags, t])
    setTagInput('')
    setSaveStatus('unsaved')
    tagInputRef.current?.focus()
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
    setSaveStatus('unsaved')
  }

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsCoverUploading(true)
    try {
      const url = await uploadToCloudinary(file, 'articles')
      setCoverImageUrl(url)
      setSaveStatus('unsaved')
    } catch (err) {
      toast.error('Cover upload failed. Please try again.')
    } finally {
      setIsCoverUploading(false)
      if (coverFileRef.current) coverFileRef.current.value = ''
    }
  }

  const isPublished = existingBlog?.status === 'published'
  const isScheduled = existingBlog?.status === 'scheduled'

  const plainText = normalizeToHtml(body).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = plainText ? plainText.split(' ').filter(Boolean).length : 0
  const readMin = Math.max(1, Math.ceil(wordCount / 200))

  const publishingScore = useMemo(() => computePublishingScore({
    title, summary, coverImageUrl, body, tags,
    seoTitleOverride: seoTitle, seoDescOverride: seoDesc,
  }), [title, summary, coverImageUrl, body, tags, seoTitle, seoDesc])
  const todayISO = new Date().toISOString().slice(0, 10)

  const statusDot = {
    idle: 'transparent',
    saved: '#5a8b5e',
    saving: 'var(--ls-ink-3)',
    unsaved: 'var(--ls-accent)',
  }[saveStatus]

  const statusLabel = {
    idle: '',
    saved: 'All changes saved',
    saving: 'Saving…',
    unsaved: 'Unsaved changes',
  }[saveStatus]

  // ── Pill label components (reused in both topbar and popovers) ───────────
  const pillLabel = (text: string) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', flexShrink: 0,
      padding: '0 8px',
      background: 'var(--ls-bg-soft)',
      borderRight: '1px solid var(--ls-line)',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 9, fontWeight: 600,
      letterSpacing: 1.2, color: 'var(--ls-ink-3)', textTransform: 'uppercase',
      borderRadius: '5px 0 0 5px', whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  )

  const pillValue = (children: React.ReactNode) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 10px', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        {children}
      </span>
      <ChevronDown size={10} style={{ color: 'var(--ls-ink-3)', flexShrink: 0 }} />
    </span>
  )

  const pillBtn = (active: boolean) => ({
    display: 'inline-flex' as const, alignItems: 'stretch' as const,
    border: `1px solid ${active ? 'var(--ls-accent)' : 'var(--ls-line)'}`,
    borderRadius: 6,
    background: active ? 'var(--ls-bg-soft)' : 'var(--ls-bg)',
    color: 'var(--ls-ink)', cursor: 'pointer' as const,
    height: 32, maxWidth: 220, minWidth: 0, overflow: 'hidden' as const, flexShrink: 1,
    boxShadow: active ? '0 0 0 3px var(--ls-accent-soft)' : 'none',
    fontFamily: 'inherit',
  })

  const companyBadge = (company: typeof selectedCompany) => (
    company ? (
      <UserAvatar avatarUrl={company.logoUrl} name={company.name} size={16} shape="square" />
    ) : (
      <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--ls-bg-tint)', border: '1px solid var(--ls-line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 600, color: 'var(--ls-ink-2)' }}>
        P
      </span>
    )
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--ls-bg)' }}>

      {/* ══ TOPBAR — 3-zone grid ═══════════════════════════════════════════════ */}
      <header style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '10px 16px',
        borderBottom: '1px solid var(--ls-line)',
        background: 'var(--ls-bg)',
        gap: 'clamp(8px, 1.5vw, 20px)', flexShrink: 0,
      }}>

        {/* LEFT: My Blogs + meta pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, overflow: 'hidden' }}>
          <Link
            to={ROUTES.MY_BLOGS}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '6px 8px',
              background: 'transparent', border: '1px solid transparent', borderRadius: 6,
              color: 'var(--ls-ink-2)', fontSize: 13, fontWeight: 500, textDecoration: 'none',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 14, color: 'var(--ls-ink-3)' }}>‹</span>
            <span className="hidden lg:inline">My Blogs</span>
          </Link>

          <div style={{ height: 20, width: 1, background: 'var(--ls-line)', flexShrink: 0 }} />

          {/* FORMAT pill */}
          <button ref={formatBtnRef} onClick={openFormatPopover} style={pillBtn(showFormatPopover)}>
            {pillLabel('Article Type')}
            {pillValue(<>{ARTICLE_TYPE_META[articleType].label}</>)}
          </button>

          {/* PUBLICATION pill */}
          <button ref={pubBtnRef} onClick={openPubPopover} style={pillBtn(showPubPopover)}>
            {pillLabel('Company')}
            {pillValue(
              <>
                {companyBadge(selectedCompany)}
                {selectedCompany ? selectedCompany.name : 'Personal'}
              </>
            )}
          </button>
        </div>

        {/* CENTER: save status (hidden on small screens) */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
          {saveStatus !== 'idle' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px',
              background: 'var(--ls-bg-soft)', border: '1px solid var(--ls-line-soft)',
              borderRadius: 99,
              fontSize: 12, fontWeight: 500, color: 'var(--ls-ink-2)',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: statusDot, flexShrink: 0 }} />
              {statusLabel}
              {saveStatus === 'saved' && wordCount > 0 && (
                <span style={{ color: 'var(--ls-ink-4)', fontSize: 11 }}>· {readMin} min read</span>
              )}
            </span>
          )}
        </div>

        {/* RIGHT: actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          {/* Settings rail toggle (tablet only) */}
          <button
            onClick={() => setShowRail((v) => !v)}
            className="xl:hidden"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32,
              background: showRail ? 'var(--ls-bg-soft)' : 'transparent',
              border: '1px solid var(--ls-line)', borderRadius: 6,
              color: 'var(--ls-ink-2)', cursor: 'pointer',
            }}
          >
            <Settings size={14} />
          </button>

          {/* Publishing score button */}
          <button
            ref={scoreBtnRef}
            onClick={() => {
              if (scoreBtnRef.current) {
                const r = scoreBtnRef.current.getBoundingClientRect()
                setScorePopoverPos({ top: r.bottom + 8, right: window.innerWidth - r.right })
              }
              setShowScorePopover((v) => !v)
            }}
            className="hidden sm:inline-flex"
            style={{
              alignItems: 'center', gap: 6,
              padding: '0 10px', height: 32,
              background: 'transparent',
              border: `1px solid ${publishingScore.level === 'high' ? '#4caf50' : publishingScore.level === 'medium' ? '#ff9800' : '#f44336'}`,
              borderRadius: 6,
              fontSize: 12, fontWeight: 600,
              color: publishingScore.level === 'high' ? '#4caf50' : publishingScore.level === 'medium' ? '#ff9800' : '#f44336',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Score: {publishingScore.total}/100
          </button>

          <button
            onClick={() => setPreviewMode((p) => !p)}
            className="hidden sm:block"
            style={{
              padding: '0 12px', height: 32,
              background: previewMode ? 'var(--ls-bg-soft)' : 'transparent',
              border: '1px solid var(--ls-line)', borderRadius: 6,
              fontSize: 13, fontWeight: 500, color: 'var(--ls-ink)', cursor: 'pointer',
            }}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>

          {isPublished ? (
            /* Published: save changes only */
            <button
              onClick={handleSaveDraft}
              disabled={creating}
              style={{
                padding: '0 18px', height: 32,
                background: 'var(--ls-ink)', border: 'none', borderRadius: 6,
                fontSize: 13, fontWeight: 600, color: 'var(--ls-bg)', cursor: 'pointer',
                opacity: creating ? 0.5 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {creating ? 'Saving…' : 'Save changes'}
            </button>
          ) : isScheduled ? (
            /* Scheduled: save + publish now + reschedule */
            <>
              <button
                onClick={handleSaveDraft}
                disabled={creating}
                style={{
                  padding: '0 12px', height: 32,
                  background: 'transparent', border: '1px solid var(--ls-line)', borderRadius: 6,
                  fontSize: 13, fontWeight: 500, color: 'var(--ls-ink)', cursor: 'pointer',
                  opacity: creating ? 0.4 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                Save changes
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                style={{
                  padding: '0 14px', height: 32,
                  background: 'transparent', border: '1px solid var(--ls-accent)', borderRadius: 6,
                  fontSize: 13, fontWeight: 500, color: 'var(--ls-accent-ink)', cursor: 'pointer',
                  opacity: publishing ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {publishing ? 'Publishing…' : 'Publish Now'}
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                style={{
                  padding: '0 14px', height: 32,
                  background: 'var(--ls-ink)', border: 'none', borderRadius: 6,
                  fontSize: 13, fontWeight: 600, color: 'var(--ls-bg)', cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Reschedule
              </button>
            </>
          ) : (
            /* Draft / new: save draft + publish/schedule split */
            <>
              <button
                onClick={handleSaveDraft}
                disabled={creating}
                style={{
                  padding: '0 12px', height: 32,
                  background: 'transparent', border: '1px solid var(--ls-line)', borderRadius: 6,
                  fontSize: 13, fontWeight: 500, color: 'var(--ls-ink)', cursor: 'pointer',
                  opacity: creating ? 0.4 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                <span className="hidden sm:inline">Save draft</span>
                <span className="sm:hidden">Save</span>
              </button>

              <div style={{ display: 'flex', height: 32, borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}>
                <button
                  onClick={handlePublish}
                  disabled={publishing || !currentSlug}
                  style={{
                    padding: '0 18px', background: 'var(--ls-ink)', border: 'none',
                    color: 'var(--ls-bg)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    opacity: (publishing || !currentSlug) ? 0.5 : 1,
                  }}
                >
                  {publishing ? 'Publishing…' : 'Publish'}
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  disabled={!currentSlug}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 8px', background: 'var(--ls-ink)', border: 'none',
                    borderLeft: '1px solid rgba(255,255,255,.15)',
                    color: 'var(--ls-bg)', cursor: 'pointer',
                    opacity: !currentSlug ? 0.5 : 1,
                  }}
                >
                  <ChevronDown size={12} />
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══ Main layout ════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* ── Writing canvas ──────────────────────────────────────────────── */}
        <div style={{ overflow: 'auto', display: 'flex', justifyContent: 'center', background: 'var(--ls-bg)', flex: 1, minWidth: 0 }}>
          <div style={{ width: '100%', maxWidth: 780, padding: 'clamp(24px, 4vw, 40px) clamp(20px, 4vw, 48px) 96px', display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Title */}
            <div>
              <textarea
                className="editor-title-input"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (initialized.current) setSaveStatus('unsaved')
                  const el = e.target
                  el.style.height = 'auto'
                  el.style.height = el.scrollHeight + 'px'
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                placeholder="Article title…"
                rows={1}
                style={{
                  width: '100%', background: 'transparent',
                  color: 'var(--ls-ink)',
                  fontFamily: '"Source Serif 4", Georgia, serif',
                  fontWeight: 700, fontSize: 52, lineHeight: 1.1,
                  letterSpacing: '-1px',
                  border: 'none', outline: 'none',
                  resize: 'none', overflow: 'hidden', boxSizing: 'border-box', margin: 0,
                  minHeight: 64,
                }}
              />
              {title.trim().length > 0 && title.trim().length < BLOG_CONFIG.TITLE_MIN_LENGTH && (
                <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontFamily: '"JetBrains Mono", monospace' }}>
                  {title.trim().length} / {BLOG_CONFIG.TITLE_MIN_LENGTH} chars — title too short to save (slug won't generate)
                </p>
              )}
            </div>

            {/* Summary line */}
            <div style={{ paddingBottom: 8, borderBottom: '1px dashed var(--ls-line)' }}>
              <input
                className="editor-summary-input"
                type="text"
                value={summary}
                onChange={(e) => { setSummary(e.target.value.slice(0, BLOG_CONFIG.SUMMARY_MAX_LENGTH)); setSaveStatus('unsaved') }}
                placeholder="A one-line summary shown on article cards…"
                style={{
                  width: '100%', background: 'transparent',
                  color: 'var(--ls-ink-2)',
                  fontFamily: '"Source Serif 4", Georgia, serif',
                  fontStyle: 'italic', fontSize: 19,
                  border: 'none', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Quill editor or preview */}
            {previewMode ? (
              <div className="ql-snow" style={{ minHeight: 480 }}>
                <div
                  className="ql-editor"
                  style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: 19, lineHeight: 1.7, color: 'var(--ls-ink)', padding: 0 }}
                  dangerouslySetInnerHTML={{ __html: body || '<p style="color:var(--ls-ink-4)"><em>Nothing to preview yet.</em></p>' }}
                />
              </div>
            ) : (
              <div className="editor-quill-wrap">
                <QuillToolbar wordCount={wordCount} />
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={body}
                  onChange={(val) => { setBody(val); if (initialized.current) setSaveStatus('unsaved') }}
                  modules={quillModules}
                  formats={QUILL_FORMATS}
                  placeholder="Start writing your story…"
                  style={{ minHeight: 480 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Article settings rail ──────────────────────────────────────── */}
        <aside style={{
          width: showRail ? 300 : 0,
          minWidth: showRail ? 280 : 0,
          maxWidth: showRail ? 320 : 0,
          borderLeft: showRail ? '1px solid var(--ls-line)' : 'none',
          background: 'var(--ls-bg-soft)',
          overflow: showRail ? 'auto' : 'hidden',
          padding: showRail ? '24px 20px 96px' : 0,
          display: 'flex', flexDirection: 'column', gap: 24,
          flexShrink: 0,
          transition: 'width 0.2s ease, min-width 0.2s ease, padding 0.2s ease',
        }}>

          {/* Rail header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--ls-line)' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--ls-ink-3)' }}>
              Article Settings
            </span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--ls-ink-3)' }}>1 of 3</span>
          </div>

          {/* Tags */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--ls-ink)' }}>Tags</h3>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--ls-ink-3)' }}>{tags.length} / {BLOG_CONFIG.TAGS_MAX_COUNT}</span>
            </div>
            <div style={{
              padding: '10px 12px',
              background: 'var(--ls-bg)', border: '1px solid var(--ls-line)', borderRadius: 6,
              minHeight: 42, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
            }}>
              {tags.map((tag) => (
                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--ls-ink)', color: 'var(--ls-bg)', borderRadius: 99, fontSize: 11, padding: '3px 9px' }}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.55)', cursor: 'pointer', lineHeight: 1, padding: 0, fontSize: 13 }}>×</button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
                  if (e.key === 'Backspace' && !tagInput && tags.length > 0) removeTag(tags[tags.length - 1])
                }}
                placeholder={tags.length === 0 ? '+ Add tag, press Enter' : tags.length < 5 ? '+ Add more…' : ''}
                disabled={tags.length >= BLOG_CONFIG.TAGS_MAX_COUNT}
                style={{
                  flex: 1, minWidth: 120, border: 'none', outline: 'none',
                  background: 'transparent', fontSize: 13,
                  color: tags.length === 0 ? 'var(--ls-ink-4)' : 'var(--ls-ink)',
                }}
              />
            </div>
          </section>

          {/* Cover image */}
          <section>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: 'var(--ls-ink)' }}>Cover image</h3>

            {coverImageUrl ? (
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--ls-line)', display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <button
                  onClick={() => { setCoverImageUrl(''); setSaveStatus('unsaved') }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.55)', color: '#fff', border: 'none', borderRadius: 99, width: 22, height: 22, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                onClick={() => !isCoverUploading && coverFileRef.current?.click()}
                style={{ padding: '28px 16px', background: 'var(--ls-bg)', border: '1px dashed var(--ls-line-strong)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: isCoverUploading ? 'wait' : 'pointer', marginBottom: 10, opacity: isCoverUploading ? 0.6 : 1 }}
              >
                <span style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ls-bg-soft)', border: '1px solid var(--ls-line)', borderRadius: 99, color: 'var(--ls-ink-2)', fontSize: 16 }}>↑</span>
                <span style={{ fontSize: 13, color: 'var(--ls-ink)', fontWeight: 500 }}>{isCoverUploading ? 'Uploading…' : 'Upload image'}</span>
                <span style={{ fontSize: 11, color: 'var(--ls-ink-3)' }}>PNG, JPG, WebP · max 4MB</span>
              </div>
            )}

            <input ref={coverFileRef} type="file" accept="image/*" onChange={handleCoverFile} style={{ display: 'none' }} />

            {!coverImageUrl && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
                  <span style={{ flex: 1, height: 1, background: 'var(--ls-line-soft)' }} />
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 500, color: 'var(--ls-ink-3)', letterSpacing: 0.6 }}>OR</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--ls-line-soft)' }} />
                </div>
                <div style={{ padding: '10px 12px', background: 'var(--ls-bg)', border: '1px solid var(--ls-line)', borderRadius: 6 }}>
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => { setCoverImageUrl(e.target.value); setSaveStatus('unsaved') }}
                    placeholder="…or paste a URL"
                    style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--ls-ink)' }}
                  />
                </div>
              </>
            )}
          </section>

          {/* Summary */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--ls-ink)' }}>Summary</h3>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: summary.length > BLOG_CONFIG.SUMMARY_MAX_LENGTH - 20 ? '#ef4444' : 'var(--ls-ink-3)' }}>
                {summary.length} / {BLOG_CONFIG.SUMMARY_MAX_LENGTH}
              </span>
            </div>
            <textarea
              value={summary}
              onChange={(e) => { setSummary(e.target.value.slice(0, BLOG_CONFIG.SUMMARY_MAX_LENGTH)); setSaveStatus('unsaved') }}
              rows={4}
              placeholder="A brief summary shown on cards and search results…"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '12px 14px',
                background: 'var(--ls-bg)', border: '1px solid var(--ls-line)', borderRadius: 6,
                minHeight: 96, color: 'var(--ls-ink)', fontSize: 13, lineHeight: 1.55,
                fontFamily: '"Source Serif 4", Georgia, serif', fontStyle: 'italic',
                resize: 'none', outline: 'none',
              }}
            />
          </section>

          {/* SEO — collapsible */}
          <section style={{ borderTop: '1px solid var(--ls-line)', paddingTop: 18 }}>
            <button
              onClick={() => setShowSeo((v) => !v)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--ls-ink)' }}
            >
              SEO settings
              <span style={{ color: 'var(--ls-ink-3)', fontSize: 12 }}>{showSeo ? '▴' : '▾'}</span>
            </button>

            {showSeo && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => { setSeoTitle(e.target.value); setSaveStatus('unsaved') }}
                  placeholder="SEO title override…"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--ls-line)', borderRadius: 6, fontSize: 12, background: 'var(--ls-bg)', color: 'var(--ls-ink)', outline: 'none' }}
                />
                <textarea
                  rows={2}
                  value={seoDesc}
                  onChange={(e) => { setSeoDesc(e.target.value); setSaveStatus('unsaved') }}
                  placeholder="SEO description override…"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--ls-line)', borderRadius: 6, fontSize: 12, background: 'var(--ls-bg)', color: 'var(--ls-ink)', outline: 'none', resize: 'none' }}
                />
              </div>
            )}
          </section>
        </aside>
      </div>

      {/* ══ ARTICLE TYPE popover ═══════════════════════════════════════════════ */}
      {showFormatPopover && formatPopoverPos && (
        <Popover pos={formatPopoverPos} width={340} onClose={() => setShowFormatPopover(false)}>
          {/* Header */}
          <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--ls-line-soft)' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--ls-ink-3)' }}>
              Article Type
            </span>
            <h3 style={{ margin: '4px 0 0', fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600, fontSize: 16, color: 'var(--ls-ink)' }}>
              What kind of post is this?
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--ls-ink-3)', lineHeight: 1.55 }}>
              Drives the badge readers see and where it appears in Explore.
            </p>
          </div>

          {/* List */}
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {ARTICLE_TYPES.map((type, i) => {
              const meta = ARTICLE_TYPE_META[type]
              const active = type === articleType
              return (
                <button
                  key={type}
                  onClick={() => { setArticleType(type); setSaveStatus('unsaved'); setShowFormatPopover(false) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 14px',
                    background: active ? 'var(--ls-accent-soft)' : 'transparent',
                    border: 'none',
                    borderBottom: i < ARTICLE_TYPES.length - 1 ? '1px solid var(--ls-line-soft)' : 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: 99, flexShrink: 0, marginTop: 1,
                    border: `1.5px solid ${active ? 'var(--ls-accent)' : 'var(--ls-line-strong)'}`,
                    background: active ? 'var(--ls-accent)' : 'var(--ls-bg)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && <span style={{ width: 6, height: 6, borderRadius: 99, background: '#fff' }} />}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: active ? 600 : 500, fontSize: 13, lineHeight: 1.3, color: active ? 'var(--ls-accent-ink)' : 'var(--ls-ink)' }}>
                      {meta.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ls-ink-3)', marginTop: 2, lineHeight: 1.4 }}>
                      {meta.desc}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Popover>
      )}

      {/* ══ COMPANY popover ════════════════════════════════════════════════════ */}
      {showPubPopover && pubPopoverPos && (
        <Popover pos={pubPopoverPos} width={320} onClose={() => setShowPubPopover(false)}>
          {/* Header */}
          <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--ls-line-soft)' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--ls-ink-3)' }}>
              Company
            </span>
            <h3 style={{ margin: '4px 0 0', fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600, fontSize: 16, color: 'var(--ls-ink)' }}>
              Where should this be published?
            </h3>
          </div>

          {/* Company list + personal option */}
          <div style={{ maxHeight: 320, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Personal option */}
            <button
              onClick={() => { setCompanyId(''); setSaveStatus('unsaved'); setShowPubPopover(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px',
                background: !companyId ? 'var(--ls-bg-tint)' : 'transparent',
                border: '1px solid transparent', borderRadius: 6,
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <span style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--ls-bg-soft)', border: '1px solid var(--ls-line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 600, color: 'var(--ls-ink-2)', flexShrink: 0 }}>P</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ls-ink)' }}>Personal</div>
                <div style={{ fontSize: 11, color: 'var(--ls-ink-3)', marginTop: 1 }}>Publish under your name</div>
              </div>
              {!companyId && <span style={{ color: 'var(--ls-accent)', fontSize: 14, flexShrink: 0 }}>✓</span>}
            </button>

            {/* User's companies */}
            {(companies ?? []).map((company) => (
              <button
                key={company.id}
                onClick={() => { setCompanyId(company.id); setSaveStatus('unsaved'); setShowPubPopover(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px',
                  background: companyId === company.id ? 'var(--ls-bg-tint)' : 'transparent',
                  border: '1px solid transparent', borderRadius: 6,
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                <UserAvatar avatarUrl={company.logoUrl} name={company.name} size={32} shape="square" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ls-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ls-ink-3)', fontFamily: '"JetBrains Mono", monospace' }}>@{company.handle}</div>
                </div>
                {companyId === company.id && <span style={{ color: 'var(--ls-accent)', fontSize: 14, flexShrink: 0 }}>✓</span>}
              </button>
            ))}
          </div>

          {/* Create company option */}
          <div style={{ padding: '8px 10px', borderTop: '1px solid var(--ls-line-soft)' }}>
            <Link
              to={ROUTES.CREATE_COMPANY}
              onClick={() => setShowPubPopover(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', background: 'transparent', border: '1px solid transparent', borderRadius: 6, cursor: 'pointer', textDecoration: 'none' }}
            >
              <span style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--ls-accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ls-accent-ink)', fontSize: 18, fontWeight: 600, flexShrink: 0 }}>+</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ls-ink)' }}>Create a new company</div>
                <div style={{ fontSize: 11, color: 'var(--ls-ink-3)', marginTop: 1 }}>Set up a brand, invite teammates</div>
              </div>
            </Link>
          </div>
        </Popover>
      )}

      {/* ══ Publishing Score popover ═══════════════════════════════════════════ */}
      {showScorePopover && scorePopoverPos && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowScorePopover(false)} />
          <div style={{
            position: 'fixed', top: scorePopoverPos.top, right: scorePopoverPos.right, zIndex: 50,
            background: 'var(--ls-bg)', border: '1px solid var(--ls-line)', borderRadius: 10,
            boxShadow: '0 18px 48px rgba(20,18,14,.18)',
            width: 320, padding: '18px 0 14px',
          }}>
            {/* Score header */}
            <div style={{ padding: '0 18px 14px', borderBottom: '1px solid var(--ls-line)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{
                  fontFamily: '"Source Serif 4", Georgia, serif',
                  fontWeight: 700, fontSize: 32, lineHeight: 1,
                  color: publishingScore.level === 'high' ? '#4caf50' : publishingScore.level === 'medium' ? '#ff9800' : '#f44336',
                }}>
                  {publishingScore.total}
                </span>
                <span style={{ fontSize: 16, color: 'var(--ls-ink-3)', fontWeight: 400 }}>/100</span>
                <span style={{
                  marginLeft: 'auto',
                  padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                  background: publishingScore.level === 'high' ? '#e8f5e9' : publishingScore.level === 'medium' ? '#fff3e0' : '#ffebee',
                  color: publishingScore.level === 'high' ? '#4caf50' : publishingScore.level === 'medium' ? '#ff9800' : '#f44336',
                }}>
                  {publishingScore.level === 'high' ? 'Publish-ready' : publishingScore.level === 'medium' ? 'Getting there' : 'Needs work'}
                </span>
              </div>
              {publishingScore.firstFailingHint && (
                <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--ls-ink-3)', lineHeight: 1.4 }}>
                  → {publishingScore.firstFailingHint}
                </p>
              )}
            </div>
            {/* Signal rows */}
            <div style={{ padding: '10px 0 0' }}>
              {publishingScore.signals.map((signal: ScoreSignal) => {
                const Icon = signal.status === 'pass' ? CheckCircle2 : signal.status === 'warn' ? AlertCircle : XCircle
                const iconColor = signal.status === 'pass' ? '#4caf50' : signal.status === 'warn' ? '#ff9800' : '#f44336'
                return (
                  <div key={signal.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 18px' }}>
                    <Icon size={14} style={{ color: iconColor, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--ls-ink-2)' }}>{signal.label}</span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: iconColor, fontWeight: 600 }}>
                      {signal.earned}/{signal.points}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* ══ Schedule modal ═════════════════════════════════════════════════════ */}
      {showScheduleModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            style={{ background: 'var(--ls-bg)', borderRadius: 10, border: '1px solid var(--ls-line)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', width: 440, padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h3 style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 700, fontSize: 20, color: 'var(--ls-ink)', margin: 0 }}>Schedule blog</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ls-ink-3)' }}><X size={16} /></button>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--ls-ink-2)', lineHeight: 1.5 }}>
              Set when this blog should auto-publish. You can edit or cancel anytime before.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Date', type: 'date', value: scheduleDate, min: todayISO, onChange: (v: string) => setScheduleDate(v) },
                { label: 'Time', type: 'time', value: scheduleTime, min: undefined, onChange: (v: string) => setScheduleTime(v) },
              ].map(({ label, type, value, min, onChange }) => (
                <div key={label}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ls-ink-3)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</label>
                  <input type={type} value={value} min={min} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', border: '1px solid var(--ls-line)', borderRadius: 6, padding: '8px 10px', fontSize: 13, background: 'var(--ls-bg)', color: 'var(--ls-ink)', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ls-ink-3)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Timezone</label>
              <input type="text" value={scheduleTimezone} onChange={(e) => setScheduleTimezone(e.target.value)} style={{ width: '100%', border: '1px solid var(--ls-line)', borderRadius: 6, padding: '8px 10px', fontSize: 13, background: 'var(--ls-bg)', color: 'var(--ls-ink)', outline: 'none', boxSizing: 'border-box' }} />
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--ls-ink-3)' }}>Auto-detected from your browser locale.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowScheduleModal(false)} style={{ padding: '8px 16px', fontSize: 13, border: '1px solid var(--ls-line)', borderRadius: 6, background: 'transparent', color: 'var(--ls-ink-2)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSchedule} disabled={scheduling || !scheduleDate} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 500, background: 'var(--ls-ink)', color: 'var(--ls-bg)', border: 'none', borderRadius: 6, cursor: 'pointer', opacity: scheduling || !scheduleDate ? 0.5 : 1 }}>
                {scheduling ? 'Scheduling…' : 'Schedule →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
