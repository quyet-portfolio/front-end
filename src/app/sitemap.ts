import type { MetadataRoute } from 'next'
import { getPublishedBlogsForSitemap } from '@/src/lib/api/blogServer'
import { getFlashcardsForSitemap } from '@/src/lib/api/flashcardsServer'
import { SITE_URL } from '@/src/lib/site'
import { flashcardsRoutes } from '@/src/app/section/Flashcards/routes'

// Danh sách bài nằm ở API chứ không ở filesystem, nên sitemap build-time sẽ đóng
// băng tại thời điểm deploy. Revalidate để bài publish sau đó vẫn tự vào sitemap.
export const revalidate = 3600

// Các trang tĩnh muốn Google index. `/gold` là công cụ cá nhân, không
// phải trang nội dung — cố tình để ngoài sitemap (vẫn crawl được nếu có link trỏ
// tới, chỉ là không tự đề xuất). Flashcards từng nằm trong nhóm này; nay các bộ thẻ
// đã có metadata và structured data riêng nên được đưa vào như trang nội dung.
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
  { url: `${SITE_URL}/blogs`, changeFrequency: 'daily', priority: 0.9 },
  { url: `${SITE_URL}${flashcardsRoutes.list}`, changeFrequency: 'weekly', priority: 0.7 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, flashcards] = await Promise.all([getPublishedBlogsForSitemap(), getFlashcardsForSitemap()])

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

  const flashcardRoutes: MetadataRoute.Sitemap = flashcards
    // Bộ thẻ rỗng không có nội dung gì để index — chỉ là một tiêu đề trơ trọi.
    .filter((flashcard) => !!flashcard._id && flashcard.terms?.length > 0)
    .map((flashcard) => ({
      url: `${SITE_URL}${flashcardsRoutes.detail(flashcard._id)}`,
      lastModified: new Date(flashcard.updatedAt || flashcard.createdAt),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  return [...STATIC_ROUTES, ...blogRoutes, ...flashcardRoutes]
}
