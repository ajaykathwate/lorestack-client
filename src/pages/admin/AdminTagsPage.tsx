import { useState } from 'react'
import { useAdminTags } from '@/api/hooks/useAdminQueries'
import { useApproveTag, useDeleteTag, useMergeTags } from '@/api/hooks/useAdminMutations'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { formatDateShort } from '@/lib/utils'

type TagFilter = 'unapproved' | 'all' | 'approved'

export function AdminTagsPage() {
  const [filter, setFilter] = useState<TagFilter>('all')
  const [search, setSearch] = useState('')
  const [mergeTarget, setMergeTarget] = useState<{ id: string; name: string } | null>(null)
  const [mergeSlug, setMergeSlug] = useState('')

  const { data: tags, isLoading } = useAdminTags()
  const { mutate: approveTag, isPending: approving } = useApproveTag()
  const { mutate: deleteTag } = useDeleteTag()
  const { mutate: mergeTags, isPending: merging } = useMergeTags()

  const allTags = tags ?? []
  const unapprovedCount = allTags.filter((t) => !t.isApproved).length

  const filtered = allTags.filter((t) => {
    if (filter === 'unapproved' && t.isApproved) return false
    if (filter === 'approved' && !t.isApproved) return false
    return !search || t.name.toLowerCase().includes(search.toLowerCase())
  })

  const FILTERS: { key: TagFilter; label: string }[] = [
    { key: 'unapproved', label: `Unapproved · ${unapprovedCount}` },
    { key: 'all',        label: 'All tags' },
    { key: 'approved',   label: 'Approved' },
  ]

  function handleMerge() {
    if (!mergeTarget || !mergeSlug.trim()) return
    mergeTags({ sourceId: mergeTarget.id, targetSlug: mergeSlug.trim() }, {
      onSuccess: () => { setMergeTarget(null); setMergeSlug('') },
    })
  }

  return (
    <div className="flex flex-col" style={{ padding: '24px 32px', gap: 20 }}>
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Tags</h1>
          <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
            {allTags.length} platform-wide tags · {unapprovedCount} pending review
          </p>
        </div>
        <div className="flex" style={{ gap: 8 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="⌕ search tags"
            className="border border-line rounded-[4px] text-ink bg-bg placeholder:text-ink-3 focus:outline-none focus:border-line-strong"
            style={{ padding: '6px 10px', fontSize: 12, minWidth: 180 }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex" style={{ gap: 6 }}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="rounded-full border transition-colors font-sans"
            style={{
              padding: '4px 12px',
              fontSize: 12,
              background: filter === key ? 'var(--ls-ink)' : 'var(--ls-bg)',
              color: filter === key ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
              borderColor: filter === key ? 'var(--ls-ink)' : 'var(--ls-line)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Merge modal */}
      {mergeTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setMergeTarget(null)}
        >
          <div
            className="bg-bg rounded-[8px] border border-line shadow-xl"
            style={{ width: 440, padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18, marginBottom: 6 }}>
              Merge <span className="font-mono">#{mergeTarget.name}</span>
            </h3>
            <p className="text-ink-3" style={{ fontSize: 13, marginBottom: 14 }}>
              Enter the target tag slug. The old tag URL will 301-redirect to the new one.
            </p>
            <label className="text-ink-2" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Merge into tag slug
            </label>
            <input
              type="text"
              value={mergeSlug}
              onChange={(e) => setMergeSlug(e.target.value)}
              placeholder="e.g. javascript"
              className="w-full border border-line rounded-[4px] text-ink bg-bg placeholder:text-ink-3 focus:outline-none focus:border-line-strong"
              style={{ padding: '8px 10px', fontSize: 13, marginBottom: 16 }}
            />
            <div className="flex justify-end" style={{ gap: 8 }}>
              <button
                onClick={() => setMergeTarget(null)}
                className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
                style={{ padding: '7px 14px', fontSize: 12 }}
              >
                Cancel
              </button>
              <button
                onClick={handleMerge}
                disabled={merging || !mergeSlug.trim()}
                className="bg-ink text-bg font-medium rounded-[4px] hover:bg-black transition-colors disabled:opacity-50"
                style={{ padding: '7px 14px', fontSize: 12 }}
              >
                {merging ? 'Merging…' : 'Merge tag'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <Spinner size="md" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 48 }}>
          <p className="text-ink-3" style={{ fontSize: 13 }}>
            {filter === 'unapproved' ? 'No unapproved tags.' : 'No tags found.'}
          </p>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {/* Column headers */}
          <div
            className="font-mono uppercase text-ink-3 bg-bg-soft border-b border-line-soft"
            style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 110px 180px', padding: '8px 14px', gap: 10, fontSize: 10, letterSpacing: '0.5px' }}
          >
            <span>Tag</span>
            <span>Status</span>
            <span>Posts</span>
            <span>Created</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filtered.map((tag, i) => (
            <div
              key={tag.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 80px 110px 180px',
                padding: '12px 14px',
                gap: 10,
                alignItems: 'center',
                borderTop: i > 0 ? '1px solid var(--ls-line-soft)' : undefined,
                fontSize: 12,
              }}
            >
              <div>
                <span className="font-mono font-semibold text-ink">#{tag.name}</span>
                {tag.description && (
                  <div className="text-ink-3 truncate" style={{ fontSize: 10, marginTop: 2 }}>{tag.description}</div>
                )}
              </div>
              <span
                className="font-mono rounded-[3px] text-center"
                style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  background: tag.isApproved ? '#dcfce7' : 'var(--ls-bg-tint)',
                  color: tag.isApproved ? '#166534' : 'var(--ls-ink-3)',
                  border: '1px solid var(--ls-line)',
                  width: 'fit-content',
                }}
              >
                {tag.isApproved ? 'approved' : 'pending'}
              </span>
              <span className="text-ink-2">{tag.blogCount}</span>
              <span className="text-ink-3">{formatDateShort(tag.createdAt)}</span>
              <div className="flex justify-end" style={{ gap: 4 }}>
                <button
                  onClick={() => setMergeTarget({ id: tag.id, name: tag.name })}
                  className="border border-line text-ink-2 rounded-[3px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '3px 7px', fontSize: 11 }}
                >
                  Merge
                </button>
                {!tag.isApproved && (
                  <button
                    onClick={() => approveTag(tag.id)}
                    disabled={approving}
                    className="border border-line text-ink-2 rounded-[3px] hover:bg-bg-tint transition-colors disabled:opacity-50"
                    style={{ padding: '3px 7px', fontSize: 11 }}
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm(`Delete tag #${tag.name}?`)) deleteTag(tag.id)
                  }}
                  className="border border-line text-ink-3 rounded-[3px] hover:text-red-500 hover:border-red-300 transition-colors"
                  style={{ padding: '3px 7px', fontSize: 11 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
