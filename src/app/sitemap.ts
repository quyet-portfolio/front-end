import type { MetadataRoute } from 'next'
import { getPublishedBlogsForSitemap } from '@/src/lib/api/blogServer'
import { SITE_URL } from '@/src/lib/site'

// Danh sách bài nằm ở API chứ không ở filesystem, nên sitemap build-time sẽ đóng
// băng tại thời điểm deploy. Revalidate để bài publish sau đó vẫn tự vào sitemap.
export const revalidate = 3600

// Các trang tĩnh muốn Google index. `/notes`, `/social`, `/gold` là công cụ cá
// nhân, không phải trang nội dung — cố tình để ngoài sitemap (vẫn crawl được nếu
// có link trỏ tới, chỉ là không tự đề xuất).
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
  { url: `${SITE_URL}/blogs`, changeFrequency: 'daily', priority: 0.9 },
  { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${SITE_URL}/terms-of-service`, changeFrequency: 'yearly', priority: 0.2 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getPublishedBlogsForSitemap()

  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((blog) => !!blog.slug)
    .map((blog) => ({
      url: `${SITE_URL}/blogs/${blog.slug}`,
      // updatedAt chứ không phải publishedAt: lastModified báo cho crawler biết
      // bài đã được sửa, đó mới là lý do nó cần quay lại.
      lastModified: new Date(blog.updatedAt || blog.publishedAt || blog.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  return [...STATIC_ROUTES, ...blogRoutes]
}
