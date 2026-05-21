import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { marked } from 'marked'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

marked.setOptions({ breaks: true, gfm: true })

// ── Register custom fonts & sizes with Quill ────────────────────────────────
const Font = Quill.import('formats/font') as any
Font.whitelist = ['sans', 'serif', 'mono']
Quill.register(Font, true)

const Size = Quill.import('attributors/style/size') as any
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
Quill.register(Size, true)
// ────────────────────────────────────────────────────────────────────────────

function normalizeToHtml(body: string): string {
  if (!body) return ''
  if (/<[a-z][\s\S]*>/i.test(body)) return body
  return marked.parse(body) as string
}

import { useBlogBySlug } from '@/api/hooks/useBlogQueries'
import { useCreateBlog, useUpdateBlog, usePublishBlog, useScheduleBlog } from '@/api/hooks/useBlogMutations'
import { useMyCompanies } from '@/api/hooks/useCompanyQueries'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, initials } from '@/lib/utils'
import type { ArticleType } from '@/types/api'

const ARTICLE_TYPES: ArticleType[] = [
  'engineering_blog', 'architecture_deep_dive', 'case_study', 'scaling_story',
  'failure_postmortem', 'ai_experiment', 'founder_note', 'tutorial',
  'opinion_essay', 'project_showcase', 'open_source_release', 'other',
]

const QUILL_MODULES = {
  toolbar: {
    container: '#quill-toolbar',
  },
}

const QUILL_FORMATS = [
  'font', 'size', 'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'blockquote', 'code-block',
  'list', 'indent',
  'align',
  'script',
  'link', 'image',
]

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'idle'

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000

// Custom Quill toolbar rendered as JSX so we control every pixel
function QuillToolbar() {
  return (
    <div
      id="quill-toolbar"
      style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2,
        padding: '6px 0', borderBottom: '1px solid var(--ls-line)',
        background: 'var(--ls-bg)', position: 'sticky', top: 0, zIndex: 10,
      }}
    >
      {/* Font family */}
      <span className="ql-formats">
        <select className="ql-font" title="Font family" defaultValue="">
          <option value="">Default</option>
          <option value="serif">Serif</option>
          <option value="mono">Monospace</option>
        </select>
      </span>

      {/* Font size */}
      <span className="ql-formats">
        <select className="ql-size" title="Font size" defaultValue="">
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

      {/* Headings */}
      <span className="ql-formats">
        <select className="ql-header" title="Heading" defaultValue="">
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="">Normal</option>
        </select>
      </span>

      {/* Inline formatting */}
      <span className="ql-formats">
        <button className="ql-bold" title="Bold" />
        <button className="ql-italic" title="Italic" />
        <button className="ql-underline" title="Underline" />
        <button className="ql-strike" title="Strikethrough" />
      </span>

      {/* Color & highlight */}
      <span className="ql-formats">
        <select className="ql-color" title="Text color" />
        <select className="ql-background" title="Highlight color" />
      </span>

      {/* Script */}
      <span className="ql-formats">
        <button className="ql-script" value="sub" title="Subscript" />
        <button className="ql-script" value="super" title="Superscript" />
      </span>

      {/* Blocks */}
      <span className="ql-formats">
        <button className="ql-blockquote" title="Blockquote" />
        <button className="ql-code-block" title="Code block" />
      </span>

      {/* Lists */}
      <span className="ql-formats">
        <button className="ql-list" value="ordered" title="Ordered list" />
        <button className="ql-list" value="bullet" title="Bullet list" />
        <button className="ql-indent" value="-1" title="Outdent" />
        <button className="ql-indent" value="+1" title="Indent" />
      </span>

      {/* Alignment */}
      <span className="ql-formats">
        <select className="ql-align" title="Alignment" />
      </span>

      {/* Media */}
      <span className="ql-formats">
        <button className="ql-link" title="Link" />
        <button className="ql-image" title="Image" />
      </span>

      {/* Clear */}
      <span className="ql-formats">
        <button className="ql-clean" title="Clear formatting" />
      </span>
    </div>
  )
}

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

  // Article type dropdown
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const typeDropdownRef = useRef<HTMLDivElement>(null)

  // Company drawer
  const [showCompanyDrawer, setShowCompanyDrawer] = useState(false)
  const [companySearch, setCompanySearch] = useState('')
  const companySearchRef = useRef<HTMLInputElement>(null)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)

  // Close type dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setShowTypeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus search when company drawer opens
  useEffect(() => {
    if (showCompanyDrawer) {
      setTimeout(() => companySearchRef.current?.focus(), 50)
    } else {
      setCompanySearch('')
    }
  }, [showCompanyDrawer])

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return []
    const q = companySearch.toLowerCase()
    return (companies ?? []).filter(
      (c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q)
    )
  }, [companies, companySearch])

  const selectedCompany = useMemo(
    () => (companies ?? []).find((c) => c.id === companyId) ?? null,
    [companies, companyId]
  )

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
    if (!initialized.current && isNew) initialized.current = true
  }, [isNew])

  const doSave = useCallback(
    (overrideSlug?: string) => {
      const slug = overrideSlug ?? currentSlug
      const payload = {
        title: title.trim() || 'Untitled',
        body, articleType,
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
          onError: () => { setSaveStatus('unsaved'); toast.error('Failed to save draft.') },
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
          onError: () => { setSaveStatus('unsaved'); toast.error('Auto-save failed.') },
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
    if (autosaveTimer.current) { clearTimeout(autosaveTimer.current); autosaveTimer.current = null }

    const doPublish = (slug: string) => {
      publishBlog(slug, {
        onSuccess: () => { toast.success('Blog published!'); navigate(ROUTES.MY_BLOGS) },
        onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to publish.'),
      })
    }

    if (saveStatus === 'unsaved') {
      const slug = currentSlug
      const payload = { title: title.trim() || 'Untitled', body, articleType, ...(companyId ? { companyId } : {}), tags, ...(coverImageUrl ? { coverImageUrl } : {}), ...(summary ? { summary } : {}) }
      setSaveStatus('saving')
      updateBlog({ slug, payload }, {
        onSuccess: (blog) => {
          setSaveStatus('saved')
          const latestSlug = blog.slug ?? slug
          if (blog.slug && blog.slug !== slug) { setCurrentSlug(latestSlug); navigate(buildRoute.editor(latestSlug), { replace: true }) }
          doPublish(latestSlug)
        },
        onError: () => { setSaveStatus('unsaved'); toast.error('Could not save before publishing. Try saving manually first.') },
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
      onSuccess: () => { toast.success('Blog scheduled!'); setShowScheduleModal(false); navigate(ROUTES.SCHEDULED) },
      onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to schedule.'),
    })
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (!t || tags.includes(t) || tags.length >= 5) return
    setTags([...tags, t])
    setTagInput('')
    setSaveStatus('unsaved')
    tagInputRef.current?.focus()
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
    setSaveStatus('unsaved')
  }

  function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverImageUrl(URL.createObjectURL(file))
    setSaveStatus('unsaved')
  }

  const plainText = normalizeToHtml(body).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = plainText ? plainText.split(' ').filter(Boolean).length : 0
  const readMin = Math.max(1, Math.ceil(wordCount / 200))
  const todayISO = new Date().toISOString().slice(0, 10)

  const statusDot = { idle: 'transparent', saved: '#22c55e', saving: '#eab308', unsaved: 'var(--ls-accent)' }[saveStatus]
  const statusLabel = { idle: '', saved: 'Saved', saving: 'Saving…', unsaved: 'Unsaved changes' }[saveStatus]

  // Shared input style for sidebar
  const sideInput: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid var(--ls-line)', borderRadius: 6,
    padding: '7px 10px', fontSize: 12,
    background: 'var(--ls-bg)', color: 'var(--ls-ink)',
    outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--ls-bg)' }}>

      {/* ══ Topbar ═══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        height: 52, flexShrink: 0,
        borderBottom: '1px solid var(--ls-line)',
        background: 'var(--ls-bg)', paddingRight: 16,
      }}>

        {/* Back */}
        <Link
          to={ROUTES.MY_BLOGS}
          className="text-ink-3 hover:text-ink transition-colors"
          style={{ fontSize: 13, textDecoration: 'none', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--ls-line)' }}
        >
          ← My Blogs
        </Link>

        {/* Article type — custom dropdown */}
        <div ref={typeDropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowTypeDropdown((v) => !v)}
            className="flex items-center gap-1.5 text-ink-2 hover:text-ink hover:bg-bg-tint transition-colors"
            style={{
              height: 52, padding: '0 14px', fontSize: 12, border: 'none',
              borderRight: '1px solid var(--ls-line)', background: 'transparent',
              cursor: 'pointer', gap: 6,
            }}
          >
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--ls-ink-3)', letterSpacing: '0.5px' }}>TYPE</span>
            <span style={{ fontWeight: 500 }}>{articleTypeLabel(articleType)}</span>
            <span style={{ fontSize: 9, color: 'var(--ls-ink-3)', marginLeft: 2 }}>▾</span>
          </button>

          {showTypeDropdown && (
            <div style={{
              position: 'absolute', top: 52, left: 0, zIndex: 100,
              background: 'var(--ls-bg)', border: '1px solid var(--ls-line)',
              borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              minWidth: 220, padding: 6, maxHeight: 360, overflowY: 'auto',
            }}>
              {ARTICLE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => { setArticleType(type); setSaveStatus('unsaved'); setShowTypeDropdown(false) }}
                  className="w-full text-left transition-colors rounded-[5px]"
                  style={{
                    padding: '8px 12px', fontSize: 13, border: 'none', cursor: 'pointer',
                    background: type === articleType ? 'var(--ls-bg-tint)' : 'transparent',
                    color: type === articleType ? 'var(--ls-ink)' : 'var(--ls-ink-2)',
                    fontWeight: type === articleType ? 600 : 400,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  {articleTypeLabel(type)}
                  {type === articleType && <span style={{ fontSize: 12, color: 'var(--ls-accent)' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Company — drawer trigger */}
        <button
          onClick={() => setShowCompanyDrawer(true)}
          className="flex items-center transition-colors hover:bg-bg-tint"
          style={{
            height: 52, padding: '0 14px', fontSize: 12, border: 'none',
            borderRight: '1px solid var(--ls-line)', background: 'transparent',
            cursor: 'pointer', gap: 6,
          }}
        >
          <span className="font-mono" style={{ fontSize: 10, color: 'var(--ls-ink-3)', letterSpacing: '0.5px' }}>FOR</span>
          {selectedCompany ? (
            <span className="font-semibold text-ink">{selectedCompany.name}</span>
          ) : (
            <span className="text-ink-2">Personal</span>
          )}
          <span style={{ fontSize: 9, color: 'var(--ls-ink-3)', marginLeft: 2 }}>▾</span>
        </button>

        {/* Save status — center */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          {saveStatus !== 'idle' && (
            <>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: statusDot, flexShrink: 0 }} />
              <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>{statusLabel}</span>
            </>
          )}
        </div>

        {/* Word count */}
        {wordCount > 0 && (
          <span className="font-mono text-ink-3" style={{ fontSize: 11, marginRight: 14, whiteSpace: 'nowrap' }}>
            {wordCount.toLocaleString()} words · {readMin} min
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <button
            onClick={() => setPreviewMode((p) => !p)}
            className="border border-line rounded-[6px] text-ink-2 hover:bg-bg-tint transition-colors"
            style={{ padding: '5px 12px', fontSize: 12, background: previewMode ? 'var(--ls-bg-tint)' : 'transparent' }}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={creating}
            className="border border-line rounded-[6px] text-ink-2 hover:bg-bg-tint transition-colors disabled:opacity-40"
            style={{ padding: '5px 12px', fontSize: 12 }}
          >
            Save draft
          </button>

          <div style={{ display: 'flex', border: '1px solid var(--ls-ink)', borderRadius: 6, overflow: 'hidden' }}>
            <button
              onClick={handlePublish}
              disabled={publishing || !currentSlug}
              className="font-medium disabled:opacity-40"
              style={{ padding: '5px 14px', fontSize: 12, background: 'var(--ls-ink)', color: 'var(--ls-bg)', border: 'none', borderRight: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
            >
              {publishing ? 'Publishing…' : 'Publish'}
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              disabled={!currentSlug}
              className="disabled:opacity-40"
              style={{ padding: '5px 8px', fontSize: 11, background: 'var(--ls-ink)', color: 'var(--ls-bg)', border: 'none', cursor: 'pointer' }}
            >
              ▾
            </button>
          </div>
        </div>
      </div>

      {/* ══ Main layout ═══════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* ── Writing pane ────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', background: 'var(--ls-bg)', padding: '48px 40px 80px' }}>
          <div style={{ width: '100%', maxWidth: 720 }}>

            {/* Title */}
            <textarea
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (initialized.current) setSaveStatus('unsaved') }}
              placeholder="Article title…"
              rows={2}
              style={{
                width: '100%', background: 'transparent', color: 'var(--ls-ink)',
                fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 700,
                fontSize: 40, lineHeight: 1.15, border: 'none', outline: 'none',
                resize: 'none', overflow: 'hidden', boxSizing: 'border-box', marginBottom: 6,
              }}
            />

            {/* Summary */}
            <input
              type="text"
              value={summary}
              onChange={(e) => { setSummary(e.target.value.slice(0, 300)); setSaveStatus('unsaved') }}
              placeholder="A one-line summary shown on article cards…"
              style={{
                width: '100%', background: 'transparent', color: 'var(--ls-ink-2)',
                fontFamily: '"Source Serif 4", Georgia, serif', fontStyle: 'italic',
                fontSize: 17, border: 'none', outline: 'none', boxSizing: 'border-box',
                borderBottom: '1px dashed var(--ls-line-soft)', paddingBottom: 14, marginBottom: 0,
              }}
            />

            {/* Toolbar + body */}
            {previewMode ? (
              <div className="ql-snow" style={{ marginTop: 28, minHeight: 480 }}>
                <div
                  className="ql-editor"
                  style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: 18, lineHeight: 1.8, color: 'var(--ls-ink)', padding: 0 }}
                  dangerouslySetInnerHTML={{ __html: body || '<p style="color:var(--ls-ink-4)"><em>Nothing to preview yet.</em></p>' }}
                />
              </div>
            ) : (
              <div className="editor-quill-wrap" style={{ marginTop: 0 }}>
                <QuillToolbar />
                <ReactQuill
                  theme="snow"
                  value={body}
                  onChange={(val) => { setBody(val); if (initialized.current) setSaveStatus('unsaved') }}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Start writing your story…"
                  style={{ minHeight: 480 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Settings rail ─────────────────────────────────────────────── */}
        <div style={{ width: 272, flexShrink: 0, borderLeft: '1px solid var(--ls-line)', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'var(--ls-bg)' }}>
          <div style={{ padding: '13px 18px 11px', borderBottom: '1px solid var(--ls-line)', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--ls-ink-3)' }}>
            Article settings
          </div>

          {/* Tags */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--ls-line-soft)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ls-ink-2)' }}>Tags</span>
              <span style={{ fontSize: 10, color: 'var(--ls-ink-3)', fontFamily: 'monospace' }}>{tags.length} / 5</span>
            </div>
            <input
              ref={tagInputRef}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
                if (e.key === 'Backspace' && !tagInput && tags.length > 0) removeTag(tags[tags.length - 1])
              }}
              placeholder={tags.length < 5 ? '+ Add tag, press Enter' : 'Max 5 tags reached'}
              disabled={tags.length >= 5}
              style={{ ...sideInput, marginBottom: tags.length > 0 ? 10 : 0 }}
            />
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {tags.map((tag) => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--ls-ink)', color: 'var(--ls-bg)', borderRadius: 99, fontSize: 11, padding: '3px 9px' }}>
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', lineHeight: 1, padding: 0, fontSize: 13 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cover image */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--ls-line-soft)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ls-ink-2)', marginBottom: 10 }}>Cover image</div>
            {coverImageUrl ? (
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <img src={coverImageUrl} alt="Cover" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--ls-line)', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <button onClick={() => { setCoverImageUrl(''); setSaveStatus('unsaved') }} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: 99, width: 20, height: 20, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
              </div>
            ) : (
              <button onClick={() => coverFileRef.current?.click()} style={{ width: '100%', height: 90, border: '1.5px dashed var(--ls-line)', borderRadius: 6, background: 'var(--ls-bg-soft)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11, color: 'var(--ls-ink-3)', cursor: 'pointer', marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>↑</span>
                <span>Upload image</span>
              </button>
            )}
            <input ref={coverFileRef} type="file" accept="image/*" onChange={handleCoverFile} style={{ display: 'none' }} />
            <input type="url" value={coverImageUrl} onChange={(e) => { setCoverImageUrl(e.target.value); setSaveStatus('unsaved') }} placeholder="…or paste a URL" style={{ ...sideInput, fontSize: 11 }} />
          </div>

          {/* Summary */}
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ls-ink-2)' }}>Summary</span>
              <span style={{ fontSize: 10, color: summary.length > 280 ? '#ef4444' : 'var(--ls-ink-3)', fontFamily: 'monospace' }}>{summary.length} / 300</span>
            </div>
            <textarea
              value={summary}
              onChange={(e) => { setSummary(e.target.value.slice(0, 300)); setSaveStatus('unsaved') }}
              rows={3}
              placeholder="A brief summary shown on cards and search results…"
              style={{ ...sideInput, resize: 'none', fontFamily: '"Source Serif 4", Georgia, serif', lineHeight: 1.5, fontSize: 11 }}
            />
          </div>
        </div>
      </div>

      {/* ══ Company drawer ════════════════════════════════════════════════════ */}
      {showCompanyDrawer && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.25)' }}
            onClick={() => setShowCompanyDrawer(false)}
          />

          {/* Panel */}
          <div style={{
            position: 'fixed', top: 52, left: 0, bottom: 0, zIndex: 50,
            width: 340, background: 'var(--ls-bg)',
            borderRight: '1px solid var(--ls-line)',
            boxShadow: '4px 0 32px rgba(0,0,0,0.12)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Drawer header */}
            <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--ls-line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.3px', textTransform: 'uppercase', color: 'var(--ls-ink-3)' }}>
                  Publish under
                </span>
                <button onClick={() => setShowCompanyDrawer(false)} style={{ background: 'none', border: 'none', color: 'var(--ls-ink-3)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
              </div>
              <input
                ref={companySearchRef}
                type="text"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="Search companies…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1px solid var(--ls-line)', borderRadius: 7,
                  padding: '9px 12px', fontSize: 13,
                  background: 'var(--ls-bg-soft)', color: 'var(--ls-ink)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Personal option */}
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--ls-line-soft)' }}>
              <button
                onClick={() => { setCompanyId(''); setSaveStatus('unsaved'); setShowCompanyDrawer(false) }}
                className="w-full flex items-center gap-3 rounded-[6px] transition-colors hover:bg-bg-tint"
                style={{ padding: '10px 10px', border: 'none', background: companyId === '' ? 'var(--ls-bg-tint)' : 'transparent', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 99, background: 'var(--ls-bg-deep)', border: '1px solid var(--ls-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                  ✎
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ls-ink)' }}>Personal</div>
                  <div style={{ fontSize: 11, color: 'var(--ls-ink-3)' }}>Publish as yourself</div>
                </div>
                {companyId === '' && <span style={{ marginLeft: 'auto', color: 'var(--ls-accent)', fontSize: 14 }}>✓</span>}
              </button>
            </div>

            {/* Results area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
              {companySearch.trim() === '' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, padding: '40px 20px', textAlign: 'center' }}>
                  <span style={{ fontSize: 28 }}>🏢</span>
                  <p style={{ fontSize: 13, color: 'var(--ls-ink-3)', margin: 0 }}>
                    Search to find a company
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--ls-ink-4)', margin: 0 }}>
                    Type the company name or handle above
                  </p>
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center', gap: 6 }}>
                  <p style={{ fontSize: 13, color: 'var(--ls-ink-3)', margin: 0 }}>No companies match "{companySearch}"</p>
                  <p style={{ fontSize: 11, color: 'var(--ls-ink-4)', margin: 0 }}>Only companies you belong to will appear here</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {filteredCompanies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => { setCompanyId(company.id); setSaveStatus('unsaved'); setShowCompanyDrawer(false) }}
                      className="w-full flex items-center gap-3 rounded-[6px] transition-colors hover:bg-bg-tint"
                      style={{ padding: '10px 10px', border: 'none', background: companyId === company.id ? 'var(--ls-bg-tint)' : 'transparent', cursor: 'pointer', textAlign: 'left' }}
                    >
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--ls-line)' }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--ls-bg-deep)', border: '1px solid var(--ls-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--ls-ink-2)', flexShrink: 0 }}>
                          {initials(company.name)}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ls-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{company.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--ls-ink-3)', fontFamily: '"JetBrains Mono", monospace' }}>@{company.handle}</div>
                      </div>
                      {companyId === company.id && <span style={{ color: 'var(--ls-accent)', fontSize: 14, flexShrink: 0 }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══ Schedule modal ════════════════════════════════════════════════════ */}
      {showScheduleModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)' }} onClick={() => setShowScheduleModal(false)}>
          <div style={{ background: 'var(--ls-bg)', borderRadius: 10, border: '1px solid var(--ls-line)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', width: 440, padding: 28 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h3 style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 700, fontSize: 20, color: 'var(--ls-ink)', margin: 0 }}>Schedule blog</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ls-ink-3)', lineHeight: 1 }}>×</button>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--ls-ink-2)', lineHeight: 1.5 }}>Set when this blog should auto-publish. You can edit or cancel anytime before.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Date', type: 'date', value: scheduleDate, min: todayISO, onChange: (v: string) => setScheduleDate(v) },
                { label: 'Time', type: 'time', value: scheduleTime, onChange: (v: string) => setScheduleTime(v) },
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
