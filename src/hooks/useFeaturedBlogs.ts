'use client'

import { useQuery } from '@tanstack/react-query'
import { blogApi } from '../lib/api/blog'
import { blogKeys } from '../lib/queryKeys'
import { Blog } from '../lib/types'

// Danh sách ghim tối đa 3 bài và hiếm khi đổi — không cần làm mới liên tục.
const FEATURED_STALE_TIME = 10 * 60 * 1000

export const useFeaturedBlogs = (initialData?: { blogs: Blog[] }) => {
  const query = useQuery({
    queryKey: blogKeys.featured(),
    queryFn: ({ signal }) => blogApi.getFeaturedBlogs(signal),
    staleTime: FEATURED_STALE_TIME,
    initialData,
  })

  return {
    featuredBlogs: query.data?.blogs ?? [],
    loading: query.isPending,
    error: query.isError,
  }
}
