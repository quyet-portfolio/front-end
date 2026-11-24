/**
 * MyPortfolioCard — Tổng quan portfolio của user ở trang /portfolio-builder:
 * thumbnail (bản live nếu đã publish, bản nháp nếu chưa), trạng thái publish,
 * link public + copy, và các hành động Edit / View live / Preview draft.
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from 'antd/es/button'
import Tooltip from 'antd/es/tooltip'
import { CopyOutlined, EditOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { PortfolioThumbnail } from './PortfolioThumbnail'

export interface MyPortfolioSummary {
  _id: string
  slug?: string
  status: 'draft' | 'published'
  publishedAt?: string
  hasUnpublishedChanges?: boolean
  seo?: { title?: string }
  layout?: { lastModified?: string }
  /** populate('templateId', 'name slug category') */
  templateId?: { _id: string; name: string; category?: string } | string
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

/** "2 hours ago", "yesterday", "just now"... */
function timeAgo(iso?: string): string | null {
  if (!iso) return null
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000
  if (Number.isNaN(seconds)) return null
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

export const MyPortfolioCard = ({ portfolio }: { portfolio: MyPortfolioSummary }) => {
  const router = useRouter()
  const messageApi = useMessageApi()
  // Chỉ render phía client (sau ProtectedRoute) → đọc origin trực tiếp được
  const [origin] = useState(() => (typeof window !== 'undefined' ? window.location.origin : ''))

  const isPublished = portfolio.status === 'published' && Boolean(portfolio.slug)
  const livePath = `/p/${portfolio.slug}`
  const draftPreviewPath = `/portfolio-builder/preview/${portfolio._id}`
  const editPath = `/portfolio-builder/editor/${portfolio._id}`
  const templateName = typeof portfolio.templateId === 'object' ? portfolio.templateId.name : undefined
  const title = portfolio.seo?.title || 'My Portfolio'

  const publishedAgo = timeAgo(portfolio.publishedAt)
  const editedAgo = timeAgo(portfolio.layout?.lastModified)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${origin}${livePath}`)
      messageApi?.success('Link copied')
    } catch {
      messageApi?.error('Could not copy link')
    }
  }

  return (
    <section className="grid md:grid-cols-[3fr_2fr] rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/70 shadow-xl shadow-black/30">
      {/* Thumbnail — click để mở trang tương ứng */}
      <a
        href={isPublished ? livePath : draftPreviewPath}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block border-b md:border-b-0 md:border-r border-slate-700/60"
        aria-label={isPublished ? 'Open live page' : 'Open draft preview'}
      >
        <PortfolioThumbnail
          src={isPublished ? livePath : `${draftPreviewPath}?embed=1`}
          title={isPublished ? `${title} — live` : `${title} — draft preview`}
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border ${
            isPublished
              ? 'bg-green-500/20 text-green-300 border-green-500/30'
              : 'bg-slate-900/70 text-slate-300 border-slate-600'
          }`}
        >
          {isPublished ? '● Live version' : 'Draft preview'}
        </span>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold text-white bg-slate-900/80 px-4 py-2 rounded-full border border-slate-600">
            {isPublished ? 'Open live page ↗' : 'Open preview ↗'}
          </span>
        </div>
      </a>

      {/* Info + actions */}
      <div className="flex flex-col gap-5 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Your portfolio</p>
          <h2 className="text-2xl font-bold text-white truncate">{title}</h2>
          {templateName && <p className="text-sm text-slate-400 mt-0.5">Template: {templateName}</p>}
        </div>

        {/* Trạng thái */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {isPublished ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                Published
              </span>
            ) : (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600">
                Draft
              </span>
            )}
            <span className="text-slate-400">
              {isPublished
                ? publishedAgo && `Published ${publishedAgo}`
                : 'Not published yet'}
            </span>
          </div>
          {editedAgo && <p className="text-slate-500">Last edited {editedAgo}</p>}
          {isPublished && portfolio.hasUnpublishedChanges && (
            <p className="text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-xs leading-relaxed">
              You have unpublished changes. Open the editor and click <b>Publish changes</b> to update your live page.
            </p>
          )}
        </div>

        {/* Link public */}
        {isPublished && (
          <div className="flex items-center gap-2 rounded-lg bg-slate-950/60 border border-slate-700/60 pl-3 pr-1 py-1">
            <span className="flex-1 min-w-0 truncate text-sm text-slate-300 font-mono">
              {origin.replace(/^https?:\/\//, '')}
              {livePath}
            </span>
            <Tooltip title="Copy link">
              <Button type="text" size="small" icon={<CopyOutlined />} aria-label="Copy link" onClick={copyLink} />
            </Tooltip>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
          <Button type="primary" icon={<EditOutlined />} onClick={() => router.push(editPath)}>
            Edit portfolio
          </Button>
          {isPublished && (
            <Button icon={<ExportOutlined />} href={livePath} target="_blank" rel="noopener noreferrer">
              View live
            </Button>
          )}
          <Tooltip title="Preview draft">
            <Button
              icon={<EyeOutlined />}
              aria-label="Preview draft"
              href={draftPreviewPath}
              target="_blank"
              rel="noopener noreferrer"
            />
          </Tooltip>
        </div>
      </div>
    </section>
  )
}
