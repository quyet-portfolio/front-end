// Query keys tập trung một chỗ để prefetch và useQuery không bao giờ lệch key —
// lệch key nghĩa là prefetch xong vẫn fetch lại, tức là mất trắng phần tối ưu.
import { GetBlogsParams } from './api/blog'
import { GetCategoriesParams } from './api/category'

export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (params?: GetBlogsParams) => [...blogKeys.lists(), params ?? {}] as const,
  featured: () => [...blogKeys.all, 'featured'] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (slug: string) => [...blogKeys.details(), slug] as const,
}

export const categoryKeys = {
  all: ['categories'] as const,
  list: (params?: GetCategoriesParams) => [...categoryKeys.all, 'list', params ?? {}] as const,
}
