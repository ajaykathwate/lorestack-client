import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useCompanyByHandle } from '@/api/hooks/useCompanyQueries'
import { useUpdateCompany } from '@/api/hooks/useCompanyMutations'
import { Spinner } from '@/shared/components/feedback/Spinner'

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

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid var(--ls-line)', borderRadius: 4,
  padding: '9px 12px', fontSize: 13, background: 'var(--ls-bg)',
  color: 'var(--ls-ink)', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'var(--font-sans, Inter, sans-serif)', height: 40,
}

export function CompanySettingsPage() {
  const { handle = '' } = useParams()
  const { data: company, isLoading } = useCompanyByHandle(handle)
  const { mutate: updateCompany, isPending } = useUpdateCompany(handle)

  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [industry, setIndustry] = useState('')
  const [stage, setStage] = useState('')
  const [founderSocialLink, setFounderSocialLink] = useState('')
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [populated, setPopulated] = useState(false)

  useEffect(() => {
    if (company && !populated) {
      setName(company.name ?? '')
      setTagline(company.tagline ?? '')
      setWebsiteUrl(company.websiteUrl ?? '')
      setLogoUrl(company.logoUrl ?? '')
      setIndustry(company.industry ?? '')
      setStage(company.stage ?? '')
      setFounderSocialLink(company.founderSocialLink ?? '')
      setTechStack(company.techStack ?? [])
      setIsPublic(company.isPublic ?? true)
      setPopulated(true)
    }
  }, [company, populated])

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
    if (!tagline.trim()) { toast.error('Tagline is required.'); return }

    updateCompany({
      name: name.trim(),
      tagline: tagline.trim(),
      ...(websiteUrl ? { websiteUrl } : {}),
      ...(logoUrl ? { logoUrl } : {}),
      ...(industry ? { industry } : {}),
      ...(stage ? { stage } : {}),
      ...(founderSocialLink ? { founderSocialLink } : {}),
      ...(techStack.length ? { techStack } : {}),
      isPublic,
    }, {
      onSuccess: () => toast.success('Company settings saved.'),
      onError: (err: any) => {
        const msg = err?.response?.data?.message ?? 'Failed to save settings.'
        toast.error(msg)
      },
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
    <div className="flex flex-col" style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 24 }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Settings</span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>{company?.name ?? 'Company'} settings</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

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

        {/* Handle (read-only) */}
        <div>
          <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Handle</label>
          <div
            className="border border-line rounded-[4px] bg-bg-soft text-ink-3"
            style={{ height: 40, padding: '0 12px', fontSize: 13, display: 'flex', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace' }}
          >
            lorestack.com/company/{handle}
          </div>
          <p className="text-ink-3" style={{ fontSize: 11, marginTop: 4 }}>Handle cannot be changed.</p>
        </div>

        {/* Tagline */}
        <div>
          <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Tagline <span className="text-red-500">*</span>
            <span className="font-normal text-ink-3"> (max 160 chars)</span>
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
          <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Logo URL</label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            style={inputStyle}
          />
          <p className="text-ink-3" style={{ fontSize: 11, marginTop: 4 }}>Square image recommended. PNG, JPG, or SVG.</p>
        </div>

        {/* Public toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <span className="text-ink-2" style={{ fontSize: 13 }}>Make this company page public</span>
        </label>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid var(--ls-line-soft)', marginTop: 8 }}>
          <button
            type="submit"
            disabled={isPending}
            className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors disabled:opacity-50"
            style={{ padding: '10px 24px', fontSize: 13 }}
          >
            {isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
