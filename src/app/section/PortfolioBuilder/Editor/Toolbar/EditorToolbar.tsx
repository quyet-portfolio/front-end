/**
 * EditorToolbar — Top bar của editor.
 * Chứa: nút back, tên portfolio, save status, preview, publish.
 */
'use client'

import { useEditor } from '@craftjs/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface EditorToolbarProps {
  portfolioId: string
  portfolioName?: string
  status?: 'draft' | 'published'
  slug?: string
  onPublishSuccess?: (slug: string) => void
}

const AUTOSAVE_DELAY = 2000 // 2 giây

export const EditorToolbar = ({
  portfolioId,
  portfolioName = 'My Portfolio',
  status = 'draft',
  slug,
  onPublishSuccess,
}: EditorToolbarProps) => {
  const router = useRouter()
  const { query } = useEditor()
  const { saveLayout, publishPortfolio } = usePortfolioApi()

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishedSlug, setPublishedSlug] = useState(slug)
  const [isPublished, setIsPublished] = useState(status === 'published')
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── Auto-save on every editor state change ───────────────────────────────
  useEditor((state) => {
    // Debounce: reset timer mỗi khi có thay đổi
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      try {
        setSaveStatus('saving')
        const craftJson = JSON.parse(query.serialize())
        await saveLayout(portfolioId, craftJson)
        setSaveStatus('saved')
        // Reset về idle sau 3s
        setTimeout(() => setSaveStatus('idle'), 3000)
      } catch {
        setSaveStatus('error')
      }
    }, AUTOSAVE_DELAY)
  })

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      const data = await publishPortfolio(portfolioId)
      setPublishedSlug(data.slug)
      setIsPublished(true)
      onPublishSuccess?.(data.slug)
    } catch (err) {
      console.error('Publish failed:', err)
    } finally {
      setIsPublishing(false)
    }
  }

  const saveStatusLabel: Record<SaveStatus, { text: string; className: string }> = {
    idle: { text: '', className: '' },
    saving: { text: '↑ Saving...', className: 'text-yellow-400' },
    saved: { text: '✓ Saved', className: 'text-green-400' },
    error: { text: '✗ Save failed', className: 'text-red-400' },
  }

  const { text: statusText, className: statusClass } = saveStatusLabel[saveStatus]

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-700/70
      shadow-lg shadow-black/30 z-50 relative"
    >
      {/* Left: Back + Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/portfolio-builder')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium
            transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
        >
          ← Back
        </button>
        <div className="w-px h-5 bg-slate-700" />
        <span className="text-sm font-semibold text-white">{portfolioName}</span>
        {isPublished && (
          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-medium">
            Published
          </span>
        )}
      </div>

      {/* Center: Save status */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className={`text-xs font-medium transition-all duration-300 ${statusClass}`}>
          {statusText}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {publishedSlug && (
          <a
            href={`/p/${publishedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-indigo-400 transition-colors underline underline-offset-2"
          >
            View live ↗
          </a>
        )}
        <button
          onClick={() => window.open(`/portfolio-builder/preview/${portfolioId}`, '_blank')}
          className="px-3 py-1.5 text-sm font-medium text-slate-300 border border-slate-600
            rounded-lg hover:border-slate-500 hover:text-white transition-all"
        >
          Preview
        </button>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="px-4 py-1.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg
            hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all
            shadow-md shadow-indigo-600/30"
        >
          {isPublishing ? 'Publishing...' : isPublished ? 'Republish' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
