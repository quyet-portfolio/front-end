'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { blogApi } from '@/src/lib/api/blog'
import { BlogListItem, BlogStatusFilter } from '@/src/lib/types'
import { MY_BLOGS_PAGE_SIZE } from '../constants/myBlogs'

interface UseMyBlogsParams {
  status: BlogStatusFilter
  // Mốc thời gian neo feed khi nhảy năm; null = bắt đầu từ bài mới nhất
  before: string | null
  limit?: number
}

interface MyBlogsFeedState {
  blogs: BlogListItem[]
  total: number | null
  hasMore: boolean
  loading: boolean
  loadingMore: boolean
  error: string | null
  // Số bài đã có TRƯỚC batch mới nhất — chỉ phục vụ animation
  revealFromIndex: number
}

const INITIAL_STATE: MyBlogsFeedState = {
  blogs: [],
  total: null,
  hasMore: true,
  loading: true,
  loadingMore: false,
  error: null,
  revealFromIndex: 0,
}

// Hai trang cursor có thể chồng nhau sau khi xoá bài — không bao giờ render trùng
function mergeBlogs(prev: BlogListItem[], next: BlogListItem[]): BlogListItem[] {
  const seen = new Set(prev.map((blog) => blog._id))
  return prev.concat(next.filter((blog) => !seen.has(blog._id)))
}

export const useMyBlogs = ({ status, before, limit = MY_BLOGS_PAGE_SIZE }: UseMyBlogsParams) => {
  const [state, setState] = useState<MyBlogsFeedState>(INITIAL_STATE)

  const cursorRef = useRef<string | null>(null)
  const hasMoreRef = useRef<boolean>(true)
  const isFetchingRef = useRef<boolean>(false)
  // Tăng mỗi lần reset — response mang id cũ sẽ bị bỏ qua
  const feedIdRef = useRef<number>(0)

  const fetchPage = useCallback(
    async (mode: 'reset' | 'append') => {
      // Reset luôn được ưu tiên; chỉ append mới bị chặn trùng
      if (mode === 'append' && (isFetchingRef.current || !hasMoreRef.current)) return

      if (mode === 'reset') {
        feedIdRef.current += 1
        cursorRef.current = null
        hasMoreRef.current = true
      }
      const feedId = feedIdRef.current
      isFetchingRef.current = true

      setState((prev) =>
        mode === 'reset' ? { ...INITIAL_STATE, loading: true } : { ...prev, loadingMore: true, error: null }
      )

      try {
        const data = await blogApi.getMyBlogs({
          status,
          limit,
          before: before ?? undefined,
          cursor: mode === 'append' ? cursorRef.current ?? undefined : undefined,
        })
        if (feedId !== feedIdRef.current) return

        cursorRef.current = data.pagination.nextCursor
        hasMoreRef.current = data.pagination.hasNextPage

        setState((prev) => ({
          blogs: mode === 'reset' ? data.blogs : mergeBlogs(prev.blogs, data.blogs),
          total: data.pagination.totalBlogs ?? prev.total,
          hasMore: data.pagination.hasNextPage,
          loading: false,
          loadingMore: false,
          error: null,
          revealFromIndex: mode === 'reset' ? 0 : prev.blogs.length,
        }))
      } catch (err: any) {
        if (feedId !== feedIdRef.current) return
        const message = err.response?.data?.message || 'Failed to fetch your blogs'
        setState((prev) => ({ ...prev, loading: false, loadingMore: false, error: message }))
      } finally {
        // Chỉ request mới nhất mới được nhả khoá, nếu không một append cũ resolve
        // sau reset sẽ mở khoá trong lúc reset còn đang bay
        if (feedId === feedIdRef.current) isFetchingRef.current = false
      }
    },
    [status, before, limit]
  )

  useEffect(() => {
    fetchPage('reset')
  }, [fetchPage])

  const loadMore = useCallback(() => {
    fetchPage('append')
  }, [fetchPage])

  const reload = useCallback(() => {
    fetchPage('reset')
  }, [fetchPage])

  // Xoá tại chỗ sau khi delete thành công — không refetch nên không nhảy scroll
  // và không chạy lại animation. Dựa vào việc cursor ổn định khi xoá.
  const removeBlog = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      blogs: prev.blogs.filter((blog) => blog._id !== id),
      total: prev.total === null ? null : Math.max(0, prev.total - 1),
    }))
  }, [])

  return { ...state, loadMore, reload, removeBlog }
}
