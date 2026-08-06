'use client'

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { blogApi, GetBlogsParams } from '../lib/api/blog'
import { blogKeys } from '../lib/queryKeys'

const listQueryOptions = (params?: GetBlogsParams) => ({
  queryKey: blogKeys.list(params),
  queryFn: ({ signal }: { signal: AbortSignal }) => blogApi.getBlogs(params, signal),
})

/**
 * Danh sách blog có phân trang.
 *
 * Hai điểm khác bản cũ:
 * - `keepPreviousData`: khi đổi trang, dữ liệu trang cũ ở nguyên trên màn hình
 *   cho tới khi trang mới về — không còn cảnh grid biến mất rồi layout nhảy.
 * - Prefetch trang kế ngay sau khi trang hiện tại tải xong, nên lần bấm "Next"
 *   thường không phát sinh request nào cả.
 */
export const useBlogs = (params?: GetBlogsParams) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    ...listQueryOptions(params),
    placeholderData: keepPreviousData,
  })

  const currentPage = params?.page ?? 1
  const hasNextPage = query.data?.pagination.hasNextPage ?? false

  // Chỉ prefetch khi dữ liệu trang hiện tại là thật; lúc còn hiển thị placeholder
  // của trang cũ thì `hasNextPage` chưa thuộc về trang này.
  useEffect(() => {
    if (query.isPlaceholderData || !hasNextPage) return
    queryClient.prefetchQuery(listQueryOptions({ ...params, page: currentPage + 1 }))
  }, [queryClient, params, currentPage, hasNextPage, query.isPlaceholderData])

  return {
    blogs: query.data?.blogs ?? [],
    pagination: query.data?.pagination ?? null,
    // `loading` chỉ đúng cho lần tải đầu (chưa có gì để hiển thị). Khi đổi trang,
    // `isPlaceholderData` mới là tín hiệu để làm mờ danh sách thay vì xoá nó.
    loading: query.isPending,
    isPlaceholderData: query.isPlaceholderData,
    isFetching: query.isFetching,
    error: query.isError ? getBlogsErrorMessage(query.error) : null,
    refetch: query.refetch,
  }
}

/** Prefetch thủ công — dùng khi hover/focus vào nút phân trang. */
export const usePrefetchBlogs = () => {
  const queryClient = useQueryClient()
  return useCallback(
    (params?: GetBlogsParams) => {
      queryClient.prefetchQuery(listQueryOptions(params))
    },
    [queryClient]
  )
}

function getBlogsErrorMessage(error: unknown): string {
  const message = (error as any)?.response?.data?.message
  return typeof message === 'string' ? message : 'Failed to fetch blogs'
}
