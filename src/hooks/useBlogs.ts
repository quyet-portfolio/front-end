'use client'

import { useState, useEffect } from 'react'
import { blogApi, GetBlogsParams } from '../lib/api/blog'
import { Blog, PaginationResponse } from '../lib/types'

export const useBlogs = (params?: GetBlogsParams) => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [pagination, setPagination] = useState<PaginationResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogApi.getBlogs(params)
      setBlogs(data.blogs)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [JSON.stringify(params)])

  return { blogs, pagination, loading, error, refetch: fetchBlogs }
}
