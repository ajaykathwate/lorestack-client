import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { marked } from 'marked'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

marked.setOptions({ breaks: true, gfm: true })

function normalizeToHtml(body: string): string {
  if (!body) return ''
  if (/<[a-z][\s\S]*>/i.test(body)) return body
  return marked.parse(body) as string
}
import { useBlogBySlug } from '@/api/hooks/useBlogQueries'
import { useCreateBlog, useUpdateBlog, usePublishBlog, useScheduleBlog } from '@/api/hooks/useBlogMutations'
import { useMyCompanies } from '@/api/hooks/useCompanyQueries'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel } from '@/lib/utils'
import type { ArticleType } from '@/types/api'

const ARTICLE_TYPES: ArticleType[] = [
  'engineering_blog', 'architecture_deep_dive', 'case_study', 'scaling_story',
  'failure_postmortem', 'ai_experiment', 'founder_note', 'tutorial',
  'opinion_essay', 'project_showcase', 'open_source_release', 'other',
]

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block', 'list', 'bullet', 'link', 'image',
]

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'idle'

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000

export function EditorPage() {
  const { slug: urlSlug } = useParams()
  const navigate = useNavigate()
  const isNew = !urlSlug

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
  const [previewMode, setPreviewMode] = useState(false)

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [scheduleTimezone, setScheduleTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  )

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)
  const coverFileRef = useRef<HTMLInputElement>(null)

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
      setSaveStatus('saved')
    }
  }, [existingBlog])

  useEffect(() => {
    if (!initialized.current && isNew) {
      initialized.current = true
    }
  }, [isNew])

  const doSave = useCallback(
    (overrideSlug?: string) => {
      const slug = overrideSlug ?? currentSlug
      const payload = {
        title: title.trim() || 'Untitled',
        body,
        articleType,
        ...(companyId ? { companyId } : {}),
        tags,
        ...(coverImageUrl ? { coverImageUrl } : {}),
        ...(summary ? { summary } : {}),
      }

      if (!slug) {
        setSaveStatus('saving')
        createBlog(payload, {
          onSuccess: (blog) => {
            setCurrentSlug(blog.slug)
            setSaveStatus('saved')
            navigate(buildRoute.editor(blog.slug), { replace: true })
          },
          onError: () => {
            setSaveStatus('unsaved')
            toast.error('Failed to save draft.')
          },
        })
      } else {
        setSaveStatus('saving')
        updateBlog({ slug, payload }, {
          onSuccess: () => setSaveStatus('saved'),
          onError: () => {
            setSaveStatus('unsaved')
            toast.error('Auto-save failed.')
          },
        })
      }
    },
    [title, body, articleType, companyId, tags, coverImageUrl, summary, currentSlug, createBlog, updateBlog, navigate],
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
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    doSave()
  }

  function handlePublish() {
    if (!currentSlug) { toast.error('Save the draft first.'); return }
    publishBlog(currentSlug, {
      onSuccess: () => { toast.success('Blog published!'); navigate(ROUTES.MY_BLOGS) },
      onError: () => toast.error('Failed to publish.'),
    })
  }

  function handleSchedule() {
    if (!currentSlug) { toast.error('Save the draft first.'); return }
    if (!scheduleDate || !scheduleTime) { toast.error('Please pick a date and time.'); return }
    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
    if (new Date(scheduledAt).getTime() <= Date.now()) {
      toast.error('Selected time is in the past. Please choose a future time.')
      return
    }
    if (new Date(scheduledAt).getTime() > Date.now() + SIX_MONTHS_MS) {
      if (!confirm('Scheduling more than 6 months ahead — confirm?')) return
    }
    scheduleBlog(
      { slug: currentSlug, payload: { scheduledAt, scheduledTimezone: scheduleTimezone } },
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

  function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setCoverImageUrl(objectUrl)
    setSaveStatus('unsaved')
  }

  const plainText = normalizeToHtml(body).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = plainText ? plainText.split(' ').filter(Boolean).length : 0
  const readMin = Math.max(1, Math.ceil(wordCount / 200))
  const todayISO = new Date().toISOString().slice(0, 10)

  const statusDot: Record<SaveStatus, string> = {
    idle: 'transparent',
    saved: 'var(--ls-accent)',
    saving: '#eab308',
    unsaved: '#ef4444',
  }
  const statusText: Record<SaveStatus, string> = {
    idle: '',
    saved: 'Auto-saved · just now',
    saving: 'Saving…',
    unsaved: 'Unsaved changes',
  }

  const inputStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    width: '100%', border: '1px solid var(--ls-line)', borderRadius: 4,
    padding: '8px 10px', fontSize: 13, background: 'var(--ls-bg)',
    color: 'var(--ls-ink)', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'var(--font-sans, Inter, sans-serif)',
    ...extra,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* ── Editor topbar ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '10px 18px', borderBottom: '1px solid var(--ls-line)',
        background: 'var(--ls-bg)', flexShrink: 0,
      }}>
        <Link
          to={ROUTES.MY_BLOGS}
          style={{ fontSize: 13, color: 'var(--ls-ink-2)', textDecoration: 'none' }}
        >
          ← My Blogs
        </Link>

        <div style={{ flex: 1, textAlign: 'center', color: 'var(--ls-ink-3)', fontSize: 12 }}>
          {saveStatus !== 'idle' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: statusDot[saveStatus], display: 'inline-block', flexShrink: 0 }} />
              {statusText[saveStatus]}
            </span>
          )}
        </div>

        {wordCount > 0 && (
          <span style={{ fontSize: 11, color: 'var(--ls-ink-3)', whiteSpace: 'nowrap' }}>
            {wordCount.toLocaleString()} words · {readMin} min read
          </span>
        )}

        <button
          onClick={() => setPreviewMode((p) => !p)}
          style={{
            padding: '5px 10px', fontSize: 12, border: '1px solid var(--ls-line)', borderRadius: 4,
            background: previewMode ? 'var(--ls-ink)' : 'var(--ls-bg)',
            color: previewMode ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
            cursor: 'pointer',
          }}
        >
          {previewMode ? 'Edit' : 'Preview'}
        </button>
        <button
          onClick={handleSaveDraft}
          disabled={creating}
          style={{ padding: '5px 10px', fontSize: 12, border: '1px solid var(--ls-line)', borderRadius: 4, background: 'var(--ls-bg)', color: 'var(--ls-ink-2)', cursor: 'pointer', fontWeight: 500, opacity: creating ? 0.5 : 1 }}
        >
          Save draft
        </button>

        <div style={{ display: 'flex' }}>
          <button
            onClick={handlePublish}
            disabled={publishing || !currentSlug}
            style={{
              padding: '5px 12px', fontSize: 12, fontWeight: 500,
              background: 'var(--ls-ink)', color: 'var(--ls-bg)',
              border: '1px solid var(--ls-ink)', borderRight: 'none',
              borderRadius: '4px 0 0 4px', cursor: 'pointer',
              opacity: publishing || !currentSlug ? 0.5 : 1,
            }}
          >
            Publish
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            disabled={!currentSlug}
            style={{
              padding: '5px 8px', fontSize: 11,
              background: 'var(--ls-ink)', color: 'var(--ls-bg)',
              border: '1px solid var(--ls-ink)',
              borderLeft: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0 4px 4px 0', cursor: 'pointer',
              opacity: !currentSlug ? 0.5 : 1,
            }}
          >
            ▾
          </button>
        </div>
      </div>

      {/* ── Main area ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* Writing / Preview pane */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          overflow: 'auto', background: 'var(--ls-bg)', padding: '40px 60px',
        }}>
          <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Article type + company inline */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={articleType}
                onChange={(e) => { setArticleType(e.target.value as ArticleType); setSaveStatus('unsaved') }}
                style={{ padding: '4px 8px', fontSize: 12, border: '1px solid var(--ls-line)', borderRadius: 4, background: 'var(--ls-bg)', color: 'var(--ls-ink-2)', outline: 'none', cursor: 'pointer' }}
              >
                {ARTICLE_TYPES.map((t) => (
                  <option key={t} value={t}>{articleTypeLabel(t)}</option>
                ))}
              </select>

              {(companies ?? []).length > 0 && (
                <select
                  value={companyId}
                  onChange={(e) => { setCompanyId(e.target.value); setSaveStatus('unsaved') }}
                  style={{ padding: '4px 8px', fontSize: 12, border: '1px solid var(--ls-line)', borderRadius: 4, background: 'var(--ls-bg)', color: 'var(--ls-ink-2)', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">No company — publish as myself</option>
                  {(companies ?? []).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Title */}
            <textarea
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (initialized.current) setSaveStatus('unsaved') }}
              placeholder="Your blog title…"
              rows={2}
              style={{
                width: '100%', background: 'transparent', color: 'var(--ls-ink)',
                fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 700,
                fontSize: 36, lineHeight: 1.1, border: 'none', outline: 'none',
                resize: 'none', overflow: 'hidden', boxSizing: 'border-box',
              }}
            />

            {/* Summary / excerpt */}
            <input
              type="text"
              value={summary}
              onChange={(e) => { setSummary(e.target.value.slice(0, 300)); setSaveStatus('unsaved') }}
              placeholder="A brief summary of this article…"
              style={{
                width: '100%', background: 'transparent', color: 'var(--ls-ink-2)',
                fontFamily: '"Source Serif 4", Georgia, serif', fontStyle: 'italic',
                fontSize: 16, border: 'none', borderBottom: '1px dashed var(--ls-line-soft)',
                paddingBottom: 6, outline: 'none', boxSizing: 'border-box',
              }}
            />

            {/* Body — ReactQuill or Preview */}
            {previewMode ? (
              <div
                className="ql-snow"
                style={{ minHeight: 480 }}
              >
                <div
                  className="ql-editor"
                  style={{
                    fontFamily: '"Source Serif 4", Georgia, serif',
                    fontSize: 17, lineHeight: 1.75, color: 'var(--ls-ink)',
                    padding: 0,
                  }}
                  dangerouslySetInnerHTML={{ __html: body || '<p style="color:var(--ls-ink-3)"><em>Nothing to preview yet.</em></p>' }}
                />
              </div>
            ) : (
              <div style={{ minHeight: 480 }}>
                <ReactQuill
                  theme="snow"
                  value={body}
                  onChange={(val) => {
                    setBody(val)
                    if (initialized.current) setSaveStatus('unsaved')
                  }}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Start writing your story…"
                  style={{ height: 440 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Settings rail ─────────────────────────────────────────────────── */}
        <div style={{
          width: 280, flexShrink: 0, borderLeft: '1px solid var(--ls-line)',
          padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14,
          overflow: 'auto', background: 'var(--ls-bg)', fontSize: 12,
        }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--ls-ink-3)' }}>
            Article settings
          </div>

          {/* Tags */}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ls-ink-2)', marginBottom: 6 }}>
              Tags <span style={{ fontWeight: 400, color: 'var(--ls-ink-3)' }}>(max 5)</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {tags.map((tag) => (
                <span key={tag} style={{
                  background: 'var(--ls-ink)', color: 'var(--ls-bg)', borderRadius: 99,
                  fontSize: 11, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  {tag}
                  <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
                  placeholder="+ Add tag"
                  style={{ border: '1px solid var(--ls-line)', borderRadius: 99, padding: '3px 10px', fontSize: 11, minWidth: 70, background: 'var(--ls-bg)', color: 'var(--ls-ink-2)', outline: 'none' }}
                />
              )}
            </div>
            {tags.length === 5 && (
              <p style={{ fontSize: 10, color: 'var(--ls-ink-3)', marginTop: 4 }}>Maximum 5 tags.</p>
            )}
          </div>

          {/* Cover image */}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ls-ink-2)', marginBottom: 6 }}>Cover image</div>
            {coverImageUrl ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  style={{ width: '100%', height: 86, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--ls-line)', display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <button
                  onClick={() => { setCoverImageUrl(''); setSaveStatus('unsaved') }}
                  style={{
                    position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)',
                    color: '#fff', border: 'none', borderRadius: 99, width: 18, height: 18,
                    fontSize: 11, cursor: 'pointer', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => coverFileRef.current?.click()}
                style={{
                  width: '100%', height: 86, border: '1px dashed var(--ls-line)', borderRadius: 4,
                  background: 'var(--ls-bg-tint)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, color: 'var(--ls-ink-3)', cursor: 'pointer',
                  flexDirection: 'column', gap: 4,
                }}
              >
                <span>↑ Upload image</span>
                <span style={{ fontSize: 10 }}>or paste a URL below</span>
              </button>
            )}
            <input
              ref={coverFileRef}
              type="file"
              accept="image/*"
              onChange={handleCoverFile}
              style={{ display: 'none' }}
            />
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => { setCoverImageUrl(e.target.value); setSaveStatus('unsaved') }}
              placeholder="https://example.com/cover.png"
              style={{ ...inputStyle({ fontSize: 11, padding: '6px 8px', marginTop: 8 }) }}
            />
          </div>

          {/* Summary */}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ls-ink-2)', marginBottom: 6 }}>Summary</div>
            <textarea
              value={summary}
              onChange={(e) => { setSummary(e.target.value.slice(0, 300)); setSaveStatus('unsaved') }}
              rows={3}
              placeholder="A brief summary shown on cards and search results…"
              style={{ ...inputStyle({ fontSize: 11, padding: '8px 10px', resize: 'none' }) }}
            />
            <div style={{ textAlign: 'right', fontSize: 10, color: summary.length > 280 ? '#ef4444' : 'var(--ls-ink-3)', marginTop: 2 }}>
              {summary.length} / 300
            </div>
          </div>
        </div>
      </div>

      {/* ── Schedule modal ────────────────────────────────────────────────── */}
      {showScheduleModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            style={{ background: 'var(--ls-bg)', borderRadius: 8, border: '1px solid var(--ls-line)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: 460, padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <h3 style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 700, fontSize: 20, color: 'var(--ls-ink)', margin: 0 }}>
                Schedule blog
              </h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ls-ink-3)', lineHeight: 1 }}>×</button>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--ls-ink-2)' }}>
              Set when this blog should auto-publish. You can edit or cancel before then.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ls-ink-2)', display: 'block', marginBottom: 4 }}>Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  min={todayISO}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  style={{ ...inputStyle() }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ls-ink-2)', display: 'block', marginBottom: 4 }}>Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  style={{ ...inputStyle() }}
                />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ls-ink-2)', display: 'block', marginBottom: 4 }}>Timezone</label>
              <input
                type="text"
                value={scheduleTimezone}
                onChange={(e) => setScheduleTimezone(e.target.value)}
                placeholder="Asia/Kolkata"
                style={{ ...inputStyle() }}
              />
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--ls-ink-3)' }}>
                Auto-detected from your browser locale.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18 }}>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{ padding: '8px 16px', fontSize: 13, border: '1px solid var(--ls-line)', borderRadius: 6, background: 'transparent', color: 'var(--ls-ink-2)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={scheduling || !scheduleDate}
                style={{
                  padding: '8px 16px', fontSize: 13, fontWeight: 500,
                  background: 'var(--ls-ink)', color: 'var(--ls-bg)',
                  border: 'none', borderRadius: 6, cursor: 'pointer',
                  opacity: scheduling || !scheduleDate ? 0.5 : 1,
                }}
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
