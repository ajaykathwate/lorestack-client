import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useCreateCompany } from '@/api/hooks/useCompanyMutations'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { ROUTES, buildRoute } from '@/constants/routes'
import { initials } from '@/lib/utils'
import type { CreateCompanyPayload } from '@/types/api'

const INDUSTRY_OPTIONS = [
  { value: '', label: 'Select industry…' },
  { value: 'dev_tools', label: 'Developer Tools' },
  { value: 'saas', label: 'SaaS' },
  { value: 'ai_ml', label: 'AI / ML' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'infra', label: 'Infrastructure' },
  { value: 'devops', label: 'DevOps' },
  { value: 'security', label: 'Security' },
  { value: 'data', label: 'Data & Analytics' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'open_source', label: 'Open Source' },
  { value: 'other', label: 'Other' },
]

const STAGE_OPTIONS = [
  { value: '', label: 'Select stage…' },
  { value: 'idea', label: 'Idea' },
  { value: 'early_stage', label: 'Early stage' },
  { value: 'growth', label: 'Growth' },
  { value: 'scale', label: 'Scale' },
  { value: 'enterprise', label: 'Enterprise' },
]

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid var(--ls-line)', borderRadius: 4,
  padding: '9px 12px', fontSize: 13, background: 'var(--ls-bg)',
  color: 'var(--ls-ink)', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'var(--font-sans, Inter, sans-serif)', height: 40,
}

export function CreateCompanyPage() {
  const navigate = useNavigate()
  const { mutate: createCompany, isPending } = useCreateCompany()

  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [handleEdited, setHandleEdited] = useState(false)
  const [tagline, setTagline] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [industry, setIndustry] = useState('')
  const [stage, setStage] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [isLogoUploading, setIsLogoUploading] = useState(false)
  const logoFileRef = useRef<HTMLInputElement>(null)
  const [founderSocialLink, setFounderSocialLink] = useState('')
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [isGalleryUploading, setIsGalleryUploading] = useState(false)
  const galleryFileRef = useRef<HTMLInputElement>(null)

  // Auto-generate handle from name unless user has manually edited it
  useEffect(() => {
    if (!handleEdited) {
      setHandle(slugify(name))
    }
  }, [name, handleEdited])

  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsLogoUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setLogoUrl(url)
    } catch {
      toast.error('Logo upload failed. Please try again.')
    } finally {
      setIsLogoUploading(false)
      if (logoFileRef.current) logoFileRef.current.value = ''
    }
  }

  async function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const remaining = 5 - galleryImages.length
    const toUpload = files.slice(0, remaining)
    setIsGalleryUploading(true)
    try {
      const urls = await Promise.all(toUpload.map((f) => uploadToCloudinary(f)))
      setGalleryImages((prev) => [...prev, ...urls].slice(0, 5))
    } catch {
      toast.error('Gallery upload failed. Please try again.')
    } finally {
      setIsGalleryUploading(false)
      if (galleryFileRef.current) galleryFileRef.current.value = ''
    }
  }

  function addTech() {
    const t = techInput.trim()
    if (!t || techStack.includes(t) || techStack.length >= 10) return
    setTechStack([...techStack, t])
    setTechInput('')
  }

  function removeTech(t: string) {
    setTechStack(techStack.filter((x) => x !== t))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Company name is required.'); return }
    if (!handle.trim()) { toast.error('Handle is required.'); return }
    if (!tagline.trim()) { toast.error('Tagline is required.'); return }

    const payload: CreateCompanyPayload = {
      name: name.trim(),
      handle: handle.trim(),
      tagline: tagline.trim(),
      ...(websiteUrl ? { websiteUrl } : {}),
      ...(industry ? { industry } : {}),
      ...(stage ? { stage } : {}),
      ...(logoUrl ? { logoUrl } : {}),
      ...(founderSocialLink ? { founderSocialLink } : {}),
      ...(techStack.length ? { techStack } : {}),
      ...(galleryImages.length ? { galleryImages } : {}),
      isPublic,
    }

    createCompany(payload, {
      onSuccess: (company) => {
        toast.success(`${company.name} created!`)
        navigate(buildRoute.companyDashboard(company.handle))
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message ?? 'Failed to create company.'
        toast.error(msg)
      },
    })
  }

  const previewInitials = name ? initials(name) : '?'

  return (
    <div className="flex flex-col" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>New company</span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 32, marginTop: 6 }}>
          Create your company profile.
        </h1>
        <p className="font-serif text-ink-2" style={{ margin: '8px 0 0', fontSize: 14, maxWidth: 560 }}>
          You'll become the Company Owner. Invite your team after — it takes about a minute.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>

          {/* Left column — fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Company name */}
            <div>
              <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Company name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aurora Labs"
                style={inputStyle}
                required
              />
            </div>

            {/* Handle */}
            <div>
              <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Handle <span className="text-red-500">*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'stretch' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', padding: '9px 11px',
                  border: '1px solid var(--ls-line)', borderRight: 'none',
                  borderRadius: '4px 0 0 4px', background: 'var(--ls-bg-soft)',
                  color: 'var(--ls-ink-3)', fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
                  whiteSpace: 'nowrap',
                }}>
                  lorestack.com/company/
                </div>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => { setHandle(e.target.value); setHandleEdited(true) }}
                  placeholder="aurora-labs"
                  style={{ ...inputStyle, borderRadius: '0 4px 4px 0', fontFamily: '"JetBrains Mono", monospace' }}
                  required
                />
              </div>
              <p className="text-ink-3" style={{ fontSize: 11, marginTop: 4 }}>
                Lowercase letters, numbers, hyphens only. Auto-generated from name.
              </p>
            </div>

            {/* Tagline */}
            <div>
              <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Tagline <span className="text-red-500">*</span>
                <span className="font-normal text-ink-3"> (max 160 chars · shown on every company card)</span>
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value.slice(0, 160))}
                placeholder="Infra for the AI-native era"
                style={inputStyle}
                required
              />
              <div style={{ textAlign: 'right', fontSize: 10, color: tagline.length > 150 ? '#ef4444' : 'var(--ls-ink-3)', marginTop: 2 }}>
                {tagline.length} / 160
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Website</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://aurora-labs.com"
                style={inputStyle}
              />
            </div>

            {/* Industry + Stage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {STAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tech stack */}
            <div>
              <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Tech stack <span className="font-normal text-ink-3">(max 10)</span>
              </label>
              <div style={{
                border: '1px solid var(--ls-line)', borderRadius: 4, padding: '8px 10px',
                background: 'var(--ls-bg)', display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 42,
              }}>
                {techStack.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: 'var(--ls-ink)', color: 'var(--ls-bg)', borderRadius: 99,
                      fontSize: 11, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTech(t)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', lineHeight: 1, padding: 0, fontSize: 12 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {techStack.length < 10 && (
                  <input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTech() } }}
                    placeholder="+ add tech (press Enter)"
                    style={{ border: 'none', outline: 'none', fontSize: 12, color: 'var(--ls-ink)', background: 'transparent', minWidth: 120, flex: 1 }}
                  />
                )}
              </div>
            </div>

            {/* Founder social */}
            <div>
              <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Founder Twitter/X or LinkedIn
              </label>
              <input
                type="text"
                value={founderSocialLink}
                onChange={(e) => setFounderSocialLink(e.target.value)}
                placeholder="https://twitter.com/founder or https://linkedin.com/in/founder"
                style={inputStyle}
              />
            </div>

            {/* Logo URL */}
            <div>
              <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Logo</label>
              <div className="flex items-center" style={{ gap: 12 }}>
                {logoUrl ? (
                  <img src={logoUrl} alt="logo" className="rounded-[6px] flex-shrink-0" style={{ width: 44, height: 44, objectFit: 'cover' }} />
                ) : (
                  <div className="rounded-[6px] bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0" style={{ width: 44, height: 44, fontSize: 14 }}>
                    {name ? initials(name)[0] : '?'}
                  </div>
                )}
                <div className="flex flex-col" style={{ gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => logoFileRef.current?.click()}
                    disabled={isLogoUploading}
                    className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors disabled:opacity-50"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                  >
                    {isLogoUploading ? 'Uploading…' : logoUrl ? 'Change logo' : 'Upload logo'}
                  </button>
                  <span className="text-ink-3" style={{ fontSize: 11 }}>PNG, JPG, WebP · max 4MB</span>
                </div>
                <input ref={logoFileRef} type="file" accept="image/*" onChange={handleLogoFile} style={{ display: 'none' }} />
              </div>
              <p className="text-ink-3" style={{ fontSize: 11, marginTop: 4 }}>Square image recommended. PNG, JPG, or SVG.</p>
            </div>

            {/* Gallery images */}
            <div>
              <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Gallery <span className="font-normal text-ink-3">(up to 5 images)</span>
              </label>
              <p className="text-ink-3" style={{ fontSize: 11, marginBottom: 8 }}>
                Show your team, product, or office. Builds trust with readers.
              </p>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {galleryImages.map((url, i) => (
                  <div key={i} className="relative" style={{ width: 72, height: 72 }}>
                    <img src={url} alt="" className="rounded-[6px] object-cover w-full h-full border border-line" />
                    <button
                      type="button"
                      onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1.5 -right-1.5 rounded-full bg-bg border border-line text-ink-2 hover:text-ink flex items-center justify-center"
                      style={{ width: 18, height: 18, fontSize: 11, lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {galleryImages.length < 5 && (
                  <button
                    type="button"
                    onClick={() => galleryFileRef.current?.click()}
                    disabled={isGalleryUploading}
                    className="rounded-[6px] border border-dashed border-line text-ink-3 hover:border-line-strong hover:text-ink-2 transition-colors flex flex-col items-center justify-center disabled:opacity-50"
                    style={{ width: 72, height: 72, fontSize: 10, gap: 4 }}
                  >
                    {isGalleryUploading ? '…' : <><span style={{ fontSize: 20, lineHeight: 1 }}>+</span><span>Add</span></>}
                  </button>
                )}
              </div>
              <input
                ref={galleryFileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryFiles}
                style={{ display: 'none' }}
              />
            </div>

            {/* Public toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <span className="text-ink-2" style={{ fontSize: 13 }}>
                Make this company page public
              </span>
            </label>
          </div>

          {/* Right column — live preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 8 }}>
                Live preview
              </div>
              <div className="rounded-[6px] border border-line flex" style={{ padding: 14, gap: 12, alignItems: 'flex-start' }}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="logo"
                    className="rounded-[6px] flex-shrink-0"
                    style={{ width: 44, height: 44, objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <div
                    className="rounded-[6px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2 flex-shrink-0"
                    style={{ width: 44, height: 44, fontSize: 16 }}
                  >
                    {previewInitials}
                  </div>
                )}
                <div>
                  <div className="font-serif font-bold text-ink" style={{ fontSize: 14 }}>
                    {name || 'Company name'}
                  </div>
                  <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2, maxWidth: 160 }}>
                    {tagline || 'Your tagline here'}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {industry && (
                      <span style={{ fontSize: 9, padding: '2px 5px', background: 'var(--ls-accent-soft)', color: 'var(--ls-accent-ink)', borderRadius: 3, fontFamily: '"JetBrains Mono", monospace' }}>
                        {INDUSTRY_OPTIONS.find((o) => o.value === industry)?.label ?? industry}
                      </span>
                    )}
                    <span style={{ fontSize: 9, padding: '2px 5px', border: '1px solid var(--ls-line)', color: 'var(--ls-ink-3)', borderRadius: 3, fontFamily: '"JetBrains Mono", monospace' }}>
                      0 posts
                    </span>
                  </div>
                </div>
              </div>
              <div className="font-mono text-ink-3" style={{ fontSize: 11, marginTop: 8 }}>
                lorestack.com/company/{handle || 'your-handle'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--ls-line-soft)' }}>
          <Link
            to={ROUTES.DASHBOARD}
            className="border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors"
            style={{ padding: '10px 20px', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors disabled:opacity-50"
            style={{ padding: '10px 24px', fontSize: 13 }}
          >
            {isPending ? 'Creating…' : 'Create company'}
          </button>
        </div>
      </form>
    </div>
  )
}
