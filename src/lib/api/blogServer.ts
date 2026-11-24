import { Blog, BlogListItem, BlogsResponse } from '../types'
import { CategoriesResponse } from './category'
import { GetBlogsParams } from './blog'

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

/**
 * Trang danh sách cho lần render đầu.
 *
 * Không có nó thì HTML server chỉ chứa dòng "Loading blogs..." — nghĩa là các link
 * phân trang và tab category không tồn tại cho tới khi JS chạy, và crawler không
 * có đường nào đi tới trang 2.
 */
export async function getBlogsForList(params: GetBlogsParams): Promise<BlogsResponse | null> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })

  try {
    const res = await fetch(`${API_URL}/blogs?${query.toString()}`, {
      next: { revalidate: DETAIL_REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    return (await res.json()) as BlogsResponse
  } catch {
    // Client sẽ tự fetch lại — mất SSR ở lần này nhưng trang vẫn dùng được.
    return null
  }
}

/** Danh mục dùng cho tab lọc; cần ở server để tab là link thật trong HTML đầu tiên. */
export async function getBlogCategories(): Promise<CategoriesResponse | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/categories?inUse=true`, {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    return (await res.json()) as CategoriesResponse
  } catch {
    return null
  }
}

/**
 * Ba bài được ghim lên carousel đầu trang.
 *
 * Danh sách chính loại chúng ra (`excludeFeatured=true`), nên carousel là đường
 * link nội bộ DUY NHẤT trỏ tới các bài này. Fetch phía client thì HTML server
 * không có link nào và crawler chỉ còn cách dựa vào sitemap.
 */
export async function getFeaturedBlogs(): Promise<{ blogs: Blog[] } | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/featured`, {
      next: { revalidate: DETAIL_REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    return (await res.json()) as { blogs: Blog[] }
  } catch {
    return null
  }
}

/** Bài liên quan ở cuối trang chi tiết — nguồn link nội bộ chính giữa các bài. */
export async function getRelatedBlogs(slug: string): Promise<BlogListItem[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/${encodeURIComponent(slug)}/related`, {
      next: { revalidate: DETAIL_REVALIDATE_SECONDS },
    })
    if (!res.ok) return []

    const data = (await res.json()) as { blogs?: BlogListItem[] }
    return data.blogs ?? []
  } catch {
    // Block phụ ở cuối trang — hỏng thì ẩn đi, không kéo cả trang xuống theo.
    return []
  }
}
