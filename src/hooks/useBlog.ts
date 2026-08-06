'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { blogApi } from '../lib/api/blog'
import { blogKeys } from '../lib/queryKeys'

const detailQueryOptions = (slug: string) => ({
  queryKey: blogKeys.detail(slug),
  queryFn: ({ signal }: { signal: AbortSignal }) => blogApi.getBlogBySlug(slug, signal),
})

export const useBlog = (slug: string) => {
  const query = useQuery({
    ...detailQueryOptions(slug),
    enabled: !!slug,
  })

  return {
    blog: query.data?.blog ?? null,
    loading: query.isPending,
    isFetching: query.isFetching,
    error: query.isError ? getBlogErrorMessage(query.error) : null,
    refetch: query.refetch,
  }
}

/**
 * Prefetch bài chi tiết.
 *
 * Cố tình gắn vào `pointerdown` chứ không phải `mouseenter`: endpoint chi tiết
 * cộng `views` mỗi lần gọi (back-end/routes/blog.ts), nên prefetch theo hover sẽ
 * thổi phồng lượt xem của những bài người dùng chỉ lướt qua. `pointerdown` bắn
 * ngay trước `click` — vẫn tiết kiệm được quãng chờ chuyển route.
 */
export const usePrefetchBlog = () => {
  const queryClient = useQueryClient()
  return useCallback(
    (slug: string) => {
      if (!slug) return
      queryClient.prefetchQuery(detailQueryOptions(slug))
    },
    [queryClient]
  )
}

function getBlogErrorMessage(error: unknown): string {
  const message = (error as any)?.response?.data?.message
  return typeof message === 'string' ? message : 'Blog not found'
}
