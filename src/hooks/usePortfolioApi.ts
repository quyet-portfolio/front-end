/**
 * usePortfolioApi — Hook gọi API portfolio builder.
 */
import { useCallback } from 'react'

const BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/portfolio-builder`

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('accessToken') ?? '' : ''

export function usePortfolioApi() {
  const headers = useCallback(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    }),
    []
  )

  /** Lấy tất cả templates public */
  const fetchTemplates = useCallback(
    async (category?: string) => {
      const url = category ? `${BASE}/templates?category=${category}` : `${BASE}/templates`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch templates')
      return res.json()
    },
    []
  )

  /** Lấy 1 template chi tiết kèm craftJson */
  const fetchTemplateById = useCallback(async (id: string) => {
    const res = await fetch(`${BASE}/templates/${id}`)
    if (!res.ok) throw new Error('Failed to fetch template')
    return res.json()
  }, [])

  /** Tạo portfolio từ template */
  const createPortfolioFromTemplate = useCallback(
    async (templateId: string) => {
      const res = await fetch(`${BASE}/portfolios/from-template/${templateId}`, {
        method: 'POST',
        headers: headers(),
      })
      if (!res.ok) throw new Error('Failed to create portfolio')
      return res.json()
    },
    [headers]
  )

  /** Lấy portfolio của user hiện tại */
  const fetchMyPortfolio = useCallback(async () => {
    const res = await fetch(`${BASE}/portfolios/my`, { headers: headers() })
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to fetch portfolio')
    return res.json()
  }, [headers])

  /** Lấy portfolio theo ID */
  const fetchPortfolioById = useCallback(
    async (id: string) => {
      const res = await fetch(`${BASE}/portfolios/${id}`, { headers: headers() })
      if (!res.ok) throw new Error('Failed to fetch portfolio')
      return res.json()
    },
    [headers]
  )

  /** Lưu layout (craftJson) */
  const saveLayout = useCallback(
    async (id: string, craftJson: Record<string, any>) => {
      const res = await fetch(`${BASE}/portfolios/${id}/layout`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ craftJson }),
      })
      if (!res.ok) throw new Error('Failed to save layout')
      return res.json()
    },
    [headers]
  )

  /** Cập nhật theme */
  const updateTheme = useCallback(
    async (id: string, theme: { colors?: Record<string, string>; font?: { heading?: string; body?: string } }) => {
      const res = await fetch(`${BASE}/portfolios/${id}/theme`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(theme),
      })
      if (!res.ok) throw new Error('Failed to update theme')
      return res.json()
    },
    [headers]
  )

  /** Cập nhật SEO */
  const updateSeo = useCallback(
    async (id: string, seo: { title?: string; description?: string; ogImage?: string }) => {
      const res = await fetch(`${BASE}/portfolios/${id}/seo`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(seo),
      })
      if (!res.ok) throw new Error('Failed to update SEO')
      return res.json()
    },
    [headers]
  )

  /** Publish portfolio */
  const publishPortfolio = useCallback(
    async (id: string) => {
      const res = await fetch(`${BASE}/portfolios/${id}/publish`, {
        method: 'POST',
        headers: headers(),
      })
      if (!res.ok) throw new Error('Failed to publish')
      return res.json()
    },
    [headers]
  )

  /** Unpublish portfolio */
  const unpublishPortfolio = useCallback(
    async (id: string) => {
      const res = await fetch(`${BASE}/portfolios/${id}/unpublish`, {
        method: 'POST',
        headers: headers(),
      })
      if (!res.ok) throw new Error('Failed to unpublish')
      return res.json()
    },
    [headers]
  )

  return {
    fetchTemplates,
    fetchTemplateById,
    createPortfolioFromTemplate,
    fetchMyPortfolio,
    fetchPortfolioById,
    saveLayout,
    updateTheme,
    updateSeo,
    publishPortfolio,
    unpublishPortfolio,
  }
}
