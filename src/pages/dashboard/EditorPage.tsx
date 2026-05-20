import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useBlogBySlug } from '@/api/hooks/useBlogQueries'
import { useCreateBlog, useUpdateBlog, usePublishBlog, useScheduleBlog } from '@/api/hooks/useBlogMutations'
import { useMyCompanies } from '@/api/hooks/useCompanyQueries'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel } from '@/lib/utils'
import type { ArticleType } from '@/types/api'

const ARTICLE_TYPES: ArticleType[] = [
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
]

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
}

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'code-block', 'link', 'image',
]

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'idle'

export function EditorPage() {
  const { slug: urlSlug } = useParams()
  const navigate = useNavigate()
  const isNew = !urlSlug

  // For existing blogs, load the data
  const { data: existingBlog } = useBlogBySlug(urlSlug ?? '')
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
  const [summary, setSummary] = useState('')

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('09:00')

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)

  // Populate form from existing blog
  useEffect(() => {
    if (existingBlog && !initialized.current) {
      initialized.current = true
      setTitle(existingBlog.title)
      setBody(existingBlog.body ?? '')
      setArticleType(existingBlog.articleType)
      setCompanyId(existingBlog.companyId ?? '')
      setTags(existingBlog.tags.map((t) => t.name))
      setCoverImageUrl(existingBlog.coverImageUrl ?? '')
      setSummary(existingBlog.summary ?? '')
      setSaveStatus('saved')
    }
  }, [existingBlog])

  const doSave = useCallback(
    (overrideSlug?: string) => {
      const slug = overrideSlug ?? currentSlug
      const payload = {
        title: title || 'Untitled',
        body,
        articleType,
        ...(companyId ? { companyId } : {}),
        tags,
        ...(coverImageUrl ? { coverImageUrl } : {}),
        ...(summary ? { summary } : {}),
      }

      if (!slug) {
        setSaveStatus('saving')
        createBlog(
          { ...payload },
          {
            onSuccess: (blog) => {
              setCurrentSlug(blog.slug)
              setSaveStatus('saved')
              navigate(buildRoute.editor(blog.slug), { replace: true })
            },
            onError: () => {
              setSaveStatus('unsaved')
              toast.error('Failed to save draft.')
            },
          },
        )
      } else {
        setSaveStatus('saving')
        updateBlog(
          { slug, payload },
          {
            onSuccess: () => setSaveStatus('saved'),
            onError: () => {
              setSaveStatus('unsaved')
              toast.error('Auto-save failed.')
            },
          },
        )
      }
    },
    [title, body, articleType, companyId, tags, coverImageUrl, summary, currentSlug, createBlog, updateBlog, navigate],
  )

  // Autosave with 2s debounce on body/title changes
  const scheduleAutosave = useCallback(() => {
    setSaveStatus('unsaved')
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => {
      doSave()
    }, 2000)
  }, [doSave])

  useEffect(() => {
    if (!initialized.current && isNew) {
      initialized.current = true
    }
  }, [isNew])

  useEffect(() => {
    if (saveStatus === 'idle') return
    scheduleAutosave()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body])

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    if (initialized.current) setSaveStatus('unsaved')
  }

  function handleBodyChange(value: string) {
    setBody(value)
    if (initialized.current) setSaveStatus('unsaved')
  }

  function handleSaveDraft() {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    doSave()
  }

  function handlePublish() {
    if (!currentSlug) {
      toast.error('Save the draft first.')
      return
    }
    publishBlog(currentSlug, {
      onSuccess: () => {
        toast.success('Blog published!')
        navigate(ROUTES.MY_BLOGS)
      },
      onError: () => toast.error('Failed to publish.'),
    })
  }

  function handleSchedule() {
    if (!currentSlug) {
      toast.error('Save the draft first.')
      return
    }
    if (!scheduleDate || !scheduleTime) {
      toast.error('Please pick a date and time.')
      return
    }
    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
    scheduleBlog(
      { slug: currentSlug, payload: { scheduledAt } },
      {
        onSuccess: () => {
          toast.success('Blog scheduled!')
          setShowScheduleModal(false)
          navigate(ROUTES.SCHEDULED)
        },
        onError: () => toast.error('Failed to schedule.'),
      },
    )
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (!t || tags.includes(t) || tags.length >= 5) return
    setTags([...tags, t])
    setTagInput('')
    setSaveStatus('unsaved')
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
    setSaveStatus('unsaved')
  }

  const statusLabel: Record<SaveStatus, string> = {
    idle: '',
    saved: 'Auto-saved · just now',
    saving: 'Saving…',
    unsaved: 'Unsaved changes',
  }

  return (
    <div className="flex flex-col" style={{ height: '100vh', marginTop: -24, marginLeft: -24, marginRight: -24 }}>
      {/* Editor topbar */}
      <div
        className="flex items-center border-b border-line bg-bg"
        style={{ gap: 14, padding: '10px 18px', flexShrink: 0 }}
      >
        <Link
          to={ROUTES.MY_BLOGS}
          className="text-ink-2 hover:text-ink transition-colors"
          style={{ fontSize: 13 }}
        >
          ← My Blogs
        </Link>

        <div className="flex-1 text-center text-ink-3" style={{ fontSize: 12 }}>
          {saveStatus !== 'idle' && (
            <span className="inline-flex items-center" style={{ gap: 6 }}>
              <span
                className={`rounded-full ${saveStatus === 'saved' ? 'bg-ls-accent' : saveStatus === 'saving' ? 'bg-yellow-400' : 'bg-red-400'}`}
                style={{ width: 6, height: 6, display: 'inline-block' }}
              />
              {statusLabel[saveStatus]}
            </span>
          )}
        </div>

        <button
          className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
          style={{ padding: '5px 10px', fontSize: 12 }}
        >
          Preview
        </button>
        <button
          onClick={handleSaveDraft}
          disabled={creating}
          className="border border-line text-ink-2 font-medium rounded-[4px] hover:bg-bg-tint transition-colors disabled:opacity-50"
          style={{ padding: '5px 10px', fontSize: 12 }}
        >
          Save draft
        </button>
        <div className="flex" style={{ gap: 0 }}>
          <button
            onClick={handlePublish}
            disabled={publishing || !currentSlug}
            className="bg-ink text-bg font-medium rounded-l-[4px] hover:bg-black transition-colors disabled:opacity-50"
            style={{ padding: '5px 12px', fontSize: 12 }}
          >
            Publish
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            disabled={!currentSlug}
            className="bg-ink text-bg border-l border-bg/20 rounded-r-[4px] hover:bg-black transition-colors disabled:opacity-50"
            style={{ padding: '5px 8px', fontSize: 11 }}
          >
            ▾
          </button>
        </div>
      </div>

      {/* Main editor area + settings rail */}
      <div className="flex flex-1 min-h-0">
        {/* Editor pane */}
        <div className="flex-1 flex flex-col items-center overflow-auto bg-bg" style={{ padding: '40px 60px' }}>
          <div className="w-full flex flex-col" style={{ maxWidth: 680, gap: 18 }}>
            {/* Type + company inline */}
            <div className="flex items-center" style={{ gap: 10 }}>
              <select
                value={articleType}
                onChange={(e) => { setArticleType(e.target.value as ArticleType); setSaveStatus('unsaved') }}
                className="border border-line rounded-[4px] text-ink-2 bg-bg focus:outline-none focus:ring-1 focus:ring-ls-accent"
                style={{ padding: '4px 8px', fontSize: 12 }}
              >
                {ARTICLE_TYPES.map((t) => (
                  <option key={t} value={t}>{articleTypeLabel(t)}</option>
                ))}
              </select>
              {(companies ?? []).length > 0 && (
                <select
                  value={companyId}
                  onChange={(e) => { setCompanyId(e.target.value); setSaveStatus('unsaved') }}
                  className="border border-line rounded-[4px] text-ink-2 bg-bg focus:outline-none focus:ring-1 focus:ring-ls-accent"
                  style={{ padding: '4px 8px', fontSize: 12 }}
                >
                  <option value="">No company — publish as myself</option>
                  {(companies ?? []).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Your blog title…"
              className="w-full bg-transparent text-ink font-serif font-bold focus:outline-none placeholder:text-ink-3"
              style={{ fontSize: 36, lineHeight: 1.1, border: 'none' }}
            />

            {/* Summary */}
            <input
              type="text"
              value={summary}
              onChange={(e) => { setSummary(e.target.value); setSaveStatus('unsaved') }}
              placeholder="A brief summary of this article…"
              className="w-full bg-transparent text-ink-2 font-serif focus:outline-none placeholder:text-ink-3"
              style={{ fontSize: 16, border: 'none', borderBottom: '1px dashed var(--ls-line-soft)', paddingBottom: 6 }}
            />

            {/* Quill editor */}
            <ReactQuill
              theme="snow"
              value={body}
              onChange={handleBodyChange}
              modules={QUILL_MODULES}
              formats={QUILL_FORMATS}
              placeholder="Start writing your story…"
              style={{ minHeight: 400 }}
            />
          </div>
        </div>

        {/* Settings rail */}
        <div
          className="border-l border-line bg-bg overflow-auto flex flex-col"
          style={{ width: 280, padding: '18px 16px', gap: 14, fontSize: 12, flexShrink: 0 }}
        >
          <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>Article settings</div>

          {/* Tags */}
          <div>
            <div className="font-semibold text-ink-2" style={{ marginBottom: 6 }}>
              Tags <span className="text-ink-3 font-normal">(max 5)</span>
            </div>
            <div className="flex flex-wrap" style={{ gap: 4 }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-ink text-bg rounded-full flex items-center"
                  style={{ fontSize: 11, padding: '3px 8px', gap: 4 }}
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-bg/60 hover:text-bg">×</button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
                  placeholder="+ Add tag"
                  className="border border-line rounded-full text-ink-2 bg-bg focus:outline-none focus:ring-1 focus:ring-ls-accent"
                  style={{ padding: '3px 10px', fontSize: 11, minWidth: 70 }}
                />
              )}
            </div>
          </div>

          {/* Cover image URL */}
          <div>
            <div className="font-semibold text-ink-2" style={{ marginBottom: 6 }}>Cover image URL</div>
            {coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt="Cover"
                className="w-full rounded-[4px] object-cover"
                style={{ height: 86 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div
                className="w-full rounded-[4px] border border-dashed border-line bg-bg-tint flex items-center justify-center text-ink-3"
                style={{ height: 86, fontSize: 11 }}
              >
                Cover image
              </div>
            )}
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => { setCoverImageUrl(e.target.value); setSaveStatus('unsaved') }}
              placeholder="https://example.com/cover.png"
              className="w-full border border-line rounded-[4px] text-ink bg-bg placeholder:text-ink-3 focus:outline-none focus:ring-1 focus:ring-ls-accent mt-2"
              style={{ padding: '6px 8px', fontSize: 11 }}
            />
          </div>

          {/* Summary */}
          <div>
            <div className="font-semibold text-ink-2" style={{ marginBottom: 6 }}>Summary</div>
            <textarea
              value={summary}
              onChange={(e) => { setSummary(e.target.value); setSaveStatus('unsaved') }}
              rows={3}
              placeholder="A brief summary shown on cards and search results…"
              className="w-full border border-line rounded-[4px] text-ink bg-bg placeholder:text-ink-3 resize-none focus:outline-none focus:ring-1 focus:ring-ls-accent"
              style={{ padding: '8px 10px', fontSize: 11 }}
            />
            <div className="text-right text-ink-3" style={{ fontSize: 10 }}>{summary.length} / 300</div>
          </div>
        </div>
      </div>

      {/* Schedule modal */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            className="bg-bg rounded-[8px] border border-line shadow-xl"
            style={{ width: 460, padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-baseline" style={{ marginBottom: 6 }}>
              <h3 className="font-serif font-bold text-ink" style={{ fontSize: 20 }}>Schedule blog</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-ink-3 hover:text-ink"
                style={{ fontSize: 20 }}
              >
                ×
              </button>
            </div>
            <p className="text-ink-2" style={{ margin: '0 0 14px', fontSize: 12 }}>
              Set when this blog should auto-publish. You can edit or cancel before then.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full border border-line rounded-[4px] text-ink bg-bg focus:outline-none focus:ring-1 focus:ring-ls-accent"
                  style={{ padding: '8px 10px', fontSize: 13 }}
                />
              </div>
              <div>
                <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full border border-line rounded-[4px] text-ink bg-bg focus:outline-none focus:ring-1 focus:ring-ls-accent"
                  style={{ padding: '8px 10px', fontSize: 13 }}
                />
              </div>
            </div>

            <div className="flex justify-end" style={{ gap: 8, marginTop: 18 }}>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={scheduling}
                className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors disabled:opacity-50"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                {scheduling ? 'Scheduling…' : 'Schedule blog'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
