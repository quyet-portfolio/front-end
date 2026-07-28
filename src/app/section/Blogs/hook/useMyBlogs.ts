'use client'

import { useCallback, useEffect, useState } from 'react'
import { blogApi } from '@/src/lib/api/blog'
import { Blog, PaginationResponse } from '@/src/lib/types'

interface UseMyBlogsParams {
  page?: number
  limit?: number
}

export const useMyBlogs = ({ page = 1, limit = 9 }: UseMyBlogsParams = {}) => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [pagination, setPagination] = useState<PaginationResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMyBlogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogApi.getMyBlogs({ page, limit })
      setBlogs(data.blogs)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch your blogs')
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchMyBlogs()
  }, [fetchMyBlogs])

  return { blogs, pagination, loading, error, refetch: fetchMyBlogs }
}
