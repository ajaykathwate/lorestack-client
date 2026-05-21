import { useState } from 'react'
import { useAdminFeatured } from '@/api/hooks/useAdminQueries'
import { useAddFeatured, useRemoveFeatured } from '@/api/hooks/useAdminMutations'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function AdminFeaturedPage() {
  const { data: featured, isLoading } = useAdminFeatured()
  const { mutate: add, isPending: adding } = useAddFeatured()
  const { mutate: remove } = useRemoveFeatured()

  const [showAdd, setShowAdd] = useState(false)
  const [companyId, setCompanyId] = useState('')

  const list = featured ?? []

  function handleAdd() {
    if (!companyId.trim()) return
    add(companyId.trim(), {
      onSuccess: () => { setCompanyId(''); setShowAdd(false) },
    })
  }

  return (
    <div className="flex flex-col" style={{ padding: '24px 32px', gap: 20 }}>
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Featured companies</h1>
          <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
            These appear in the "Featured companies" strip on the homepage. Max 8 slots.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
          style={{ padding: '6px 14px', fontSize: 12 }}
        >
          + Add slot
        </button>
      </div>

      {/* Add company form */}
      {showAdd && (
        <div className="rounded-[6px] border border-line bg-bg-soft" style={{ padding: 16 }}>
          <p className="text-ink-2" style={{ fontSize: 13, marginBottom: 10 }}>
            Enter the company ID to feature it on the homepage.
          </p>
          <div className="flex" style={{ gap: 8 }}>
            <input
              type="text"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              placeholder="Company ID (UUID)"
              className="flex-1 rounded-[4px] border border-line bg-bg text-ink placeholder:text-ink-3 focus:outline-none focus:border-line-strong"
              style={{ padding: '8px 10px', fontSize: 13 }}
            />
            <button
              onClick={handleAdd}
              disabled={adding || !companyId.trim()}
              className="bg-ink text-bg font-medium rounded-[4px] hover:bg-black transition-colors disabled:opacity-50"
              style={{ padding: '8px 14px', fontSize: 12 }}
            >
              {adding ? 'Adding…' : 'Add'}
            </button>
            <button
              onClick={() => { setShowAdd(false); setCompanyId('') }}
              className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
              style={{ padding: '8px 12px', fontSize: 12 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Featured list */}
      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <Spinner size="md" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 48, gap: 10 }}>
          <span style={{ fontSize: 32 }}>★</span>
          <h3 className="font-serif font-semibold text-ink" style={{ fontSize: 16 }}>No featured companies</h3>
          <p className="text-ink-3" style={{ fontSize: 13 }}>Add companies to feature them on the homepage.</p>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          <div
            className="font-mono uppercase text-ink-3 bg-bg-soft border-b border-line-soft"
            style={{ display: 'grid', gridTemplateColumns: '40px 1fr 120px', padding: '8px 14px', fontSize: 10, letterSpacing: '0.5px' }}
          >
            <span>#</span>
            <span>Company</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>
          {list.map((co, i) => (
            <div
              key={co.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 120px',
                padding: '12px 14px',
                gap: 10,
                alignItems: 'center',
                borderTop: i > 0 ? '1px solid var(--ls-line-soft)' : undefined,
              }}
            >
              <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>{i + 1}</span>
              <div className="flex items-center" style={{ gap: 10 }}>
                <div
                  className="rounded-[4px] bg-bg-tint border border-line flex items-center justify-center font-mono font-semibold text-ink-2 flex-shrink-0"
                  style={{ width: 28, height: 28, fontSize: 11 }}
                >
                  {co.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-ink" style={{ fontSize: 13 }}>{co.name}</div>
                  <div className="font-mono text-ink-3" style={{ fontSize: 10 }}>/{co.handle}</div>
                </div>
              </div>
              <div className="flex justify-end" style={{ gap: 6 }}>
                <span className="text-ink-3" style={{ fontSize: 11, alignSelf: 'center' }}>≡ drag</span>
                <button
                  onClick={() => remove(co.id)}
                  className="text-ink-3 hover:text-red-500 transition-colors border border-line rounded-[4px] hover:border-red-300"
                  style={{ padding: '3px 8px', fontSize: 11 }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[6px] border border-line bg-bg-soft" style={{ padding: '10px 14px' }}>
        <p className="text-ink-3" style={{ fontSize: 12 }}>
          <span className="font-mono text-ink-2">ⓘ</span>{' '}
          Changes take effect immediately on the homepage. Drag rows to reorder (drag-and-drop coming soon).
        </p>
      </div>
    </div>
  )
}
