/**
 * usePortfolioApi — Hook gọi API portfolio builder.
 * Dùng axios instance chung (lib/axios) → tự gắn token + tự refresh khi access
 * token hết hạn, nên autosave không bị 401 giữa chừng khi user sửa lâu.
 */
import { useCallback, useMemo } from 'react'
import axiosInstance from '@/src/lib/axios'

const BASE = '/portfolio-builder'

export interface PortfolioThemePayload {
  colors?: Record<string, string | undefined>
  font?: { heading?: string; body?: string }
}

export function usePortfolioApi() {
  /** Lấy tất cả templates public */
  const fetchTemplates = useCallback(async (category?: string) => {
    const { data } = await axiosInstance.get(`${BASE}/templates`, {
      params: category ? { category } : undefined,
    })
    return data
  }, [])

  /** Lấy 1 template chi tiết kèm craftJson */
  const fetchTemplateById = useCallback(async (id: string) => {
    const { data } = await axiosInstance.get(`${BASE}/templates/${id}`)
    return data
  }, [])

  /**
   * Tạo portfolio từ template. Mỗi user chỉ có 1 portfolio: nếu đã có, server trả
   * 409 trừ khi `replace: true` (thay layout + theme của portfolio hiện tại).
   */
  const createPortfolioFromTemplate = useCallback(
    async (templateId: string, options?: { replace?: boolean }) => {
      const { data } = await axiosInstance.post(
        `${BASE}/portfolios/from-template/${templateId}`,
        null,
        { params: options?.replace ? { replace: 'true' } : undefined }
      )
      return data
    },
    []
  )

  /** Lấy portfolio của user hiện tại (null nếu chưa có) */
  const fetchMyPortfolio = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`${BASE}/portfolios/my`)
      return data
    } catch (err: any) {
      if (err?.response?.status === 404) return null
      throw err
    }
  }, [])

  /** Lấy portfolio theo ID */
  const fetchPortfolioById = useCallback(async (id: string) => {
    const { data } = await axiosInstance.get(`${BASE}/portfolios/${id}`)
    return data
  }, [])

  /** Lưu layout (craftJson) — bản nháp */
  const saveLayout = useCallback(async (id: string, craftJson: Record<string, any>) => {
    const { data } = await axiosInstance.put(`${BASE}/portfolios/${id}/layout`, { craftJson })
    return data
  }, [])

  /** Cập nhật theme */
  const updateTheme = useCallback(async (id: string, theme: PortfolioThemePayload) => {
    const { data } = await axiosInstance.put(`${BASE}/portfolios/${id}/theme`, theme)
    return data
  }, [])

  /** Cập nhật SEO */
  const updateSeo = useCallback(
    async (id: string, seo: { title?: string; description?: string; ogImage?: string }) => {
      const { data } = await axiosInstance.put(`${BASE}/portfolios/${id}/seo`, seo)
      return data
    },
    []
  )

  /** Publish portfolio — chụp snapshot bản nháp hiện tại lên trang public */
  const publishPortfolio = useCallback(async (id: string) => {
    const { data } = await axiosInstance.post(`${BASE}/portfolios/${id}/publish`)
    return data
  }, [])

  /** Unpublish portfolio */
  const unpublishPortfolio = useCallback(async (id: string) => {
    const { data } = await axiosInstance.post(`${BASE}/portfolios/${id}/unpublish`)
    return data
  }, [])

  return useMemo(
    () => ({
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
    }),
    [
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
    ]
  )
}
