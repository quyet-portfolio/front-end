'use client'

import { useQuery } from '@tanstack/react-query'
import { categoryApi, GetCategoriesParams } from '../lib/api/category'
import { categoryKeys } from '../lib/queryKeys'

// Danh mục gần như tĩnh trong một phiên làm việc.
const CATEGORIES_STALE_TIME = 10 * 60 * 1000

export const useBlogCategories = (params?: GetCategoriesParams) => {
  const query = useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: ({ signal }) => categoryApi.getCategories(params, signal),
    staleTime: CATEGORIES_STALE_TIME,
  })

  return {
    categories: query.data?.categories ?? [],
    loading: query.isPending,
    error: query.isError,
  }
}
