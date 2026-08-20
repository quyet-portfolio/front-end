import { GetBlogsParams } from '@/src/lib/api/blog'

export const PAGE_SIZE = 9

export const DEFAULT_CATEGORY = 'All'

export interface BlogListState {
  page: number
  search: string
  category: string
}

/**
 * Trạng thái danh sách suy ra từ query string.
 *
 * Dùng chung cho server component (đọc `searchParams`) và BlogsView (đọc
 * `useSearchParams`). Hai bên lệch nhau một ký tự là query key của react-query
 * lệch theo, và dữ liệu server dựng sẵn sẽ không khớp vào cache.
 */
export function parseBlogListState(raw: {
  page?: string | null
  category?: string | null
  search?: string | null
}): BlogListState {
  return {
    page: Math.max(1, Number(raw.page) || 1),
    search: raw.search || '',
    category: raw.category || DEFAULT_CATEGORY,
  }
}

// Tham số gửi lên API (category 'All' và search rỗng thì bỏ hẳn).
export function buildParams({ page, search, category }: BlogListState): GetBlogsParams {
  const next: GetBlogsParams = { page, limit: PAGE_SIZE }
  if (search) next.search = search
  if (category !== DEFAULT_CATEGORY) next.category = category
  if (!search) next.excludeFeatured = true
  return next
}

/**
 * URL của một trạng thái danh sách. Giá trị mặc định (trang 1, category 'All') bị
 * bỏ khỏi query để mỗi trạng thái chỉ có ĐÚNG MỘT URL — hai URL cùng nội dung là
 * trùng lặp, và canonical sẽ phải chỉ định bản nào mới là bản thật.
 */
export function buildHref({ page, search, category }: BlogListState): string {
  const query = new URLSearchParams()
  if (search) query.set('search', search)
  if (category && category !== DEFAULT_CATEGORY) query.set('category', category)
  if (page > 1) query.set('page', String(page))

  const queryString = query.toString()
  return queryString ? `/blogs?${queryString}` : '/blogs'
}
