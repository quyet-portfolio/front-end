import { Blog, BlogListItem } from '../types'

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '')

// generateMetadata chạy lại ở MỖI request. Back-end nằm trên Render free tier
// (cold start vài giây) nên phải cache, nếu không mỗi lượt mở bài là một round-trip
// và trang sẽ đứng chờ metadata trước khi stream được gì.
const DETAIL_REVALIDATE_SECONDS = 300

// Sitemap chỉ đổi khi có bài mới được publish — một giờ là đủ tươi.
const SITEMAP_REVALIDATE_SECONDS = 3600

// `limit` của GET /api/blogs bị validator chặn ở 100.
const SITEMAP_PAGE_SIZE = 100

// Chặn vòng lặp vô hạn nếu API trả `hasNextPage` sai. 50 trang = 5.000 bài,
// vượt xa quy mô hiện tại.
const SITEMAP_MAX_PAGES = 50

/**
 * Lấy bài viết cho generateMetadata.
 *
 * `countView=false` là bắt buộc: endpoint chi tiết cộng views mỗi lần gọi, mà
 * request này chạy song song với lần fetch của client. Thiếu tham số đó thì mỗi
 * lượt mở trang bị đếm thành hai.
 */
export async function getBlogForMetadata(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/${encodeURIComponent(slug)}?countView=false`, {
      next: { revalidate: DETAIL_REVALIDATE_SECONDS },
    })
    if (!res.ok) return null

    const data = (await res.json()) as { blog?: Blog }
    return data.blog ?? null
  } catch {
    // Metadata không được phép làm sập trang: API lỗi thì rơi về metadata mặc
    // định của layout, nội dung vẫn render bình thường ở phía client.
    return null
  }
}

/** Toàn bộ bài đã publish, dùng để dựng sitemap.xml. */
export async function getPublishedBlogsForSitemap(): Promise<BlogListItem[]> {
  const blogs: BlogListItem[] = []

  try {
    for (let page = 1; page <= SITEMAP_MAX_PAGES; page += 1) {
      const res = await fetch(`${API_URL}/blogs?limit=${SITEMAP_PAGE_SIZE}&page=${page}`, {
        next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
      })
      if (!res.ok) break

      const data = (await res.json()) as {
        blogs?: BlogListItem[]
        pagination?: { hasNextPage?: boolean }
      }

      blogs.push(...(data.blogs ?? []))
      if (!data.pagination?.hasNextPage) break
    }
  } catch {
    // Trả về phần đã lấy được: sitemap thiếu bài vẫn tốt hơn sitemap lỗi 500,
    // thứ khiến Search Console đánh dấu "Couldn't fetch".
  }

  return blogs
}
