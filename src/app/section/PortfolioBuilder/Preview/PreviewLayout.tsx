/**
 * PreviewLayout — Xem trước BẢN NHÁP của portfolio, render y hệt trang public
 * (cùng PortfolioView / CraftRenderer), chỉ khác nguồn dữ liệu là bản nháp.
 */
'use client'

import { useEffect, useState } from 'react'
import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'
import { PortfolioView } from '../PortfolioView'
import type { PortfolioTheme } from '../theme'

interface PreviewLayoutProps {
  portfolioId: string
  /** Nhúng trong iframe thumbnail → ẩn banner */
  embed?: boolean
}

interface DraftData {
  craftJson: Record<string, any>
  theme?: PortfolioTheme
}

export const PreviewLayout = ({ portfolioId, embed = false }: PreviewLayoutProps) => {
  const { fetchPortfolioById } = usePortfolioApi()
  const [draft, setDraft] = useState<DraftData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolioById(portfolioId)
      .then((data) =>
        setDraft({ craftJson: data.portfolio.layout.craftJson, theme: data.portfolio.themeOverride })
      )
      .catch(() => setError('Failed to load portfolio'))
      .finally(() => setLoading(false))
  }, [portfolioId, fetchPortfolioById])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !draft) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <p className="text-red-400">{error ?? 'Could not load portfolio'}</p>
      </div>
    )
  }

  return (
    <>
      {!embed && (
        <div className="sticky top-0 z-50 py-1.5 text-center text-xs font-medium bg-amber-500 text-black">
          Preview — draft version. Publish from the editor to update your live page.
        </div>
      )}
      <PortfolioView craftJson={draft.craftJson} theme={draft.theme} />
    </>
  )
}
