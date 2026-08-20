import { Blog } from './types'
import { BLOG_LANG, SITE_NAME, SITE_URL, absoluteUrl } from './site'

// schema.org khuyến nghị headline không quá 110 ký tự; Google bỏ qua structured
// data có headline dài hơn.
const HEADLINE_MAX = 110

const PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/avt.jpg'),
  },
} as const

export function buildBlogPostingJsonLd(blog: Blog, url: string, description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title.length > HEADLINE_MAX ? `${blog.title.slice(0, HEADLINE_MAX - 1)}…` : blog.title,
    description,
    image: blog.featuredImage ? [blog.featuredImage] : undefined,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    author: blog.author?.username ? { '@type': 'Person', name: blog.author.username } : undefined,
    publisher: PUBLISHER,
    // mainEntityOfPage nói cho Google biết structured data này mô tả CHÍNH trang
    // đang xem, không phải một bài được trích dẫn ở đâu đó.
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: BLOG_LANG,
    articleSection: blog.category || undefined,
    keywords: blog.tags?.length ? blog.tags.join(', ') : undefined,
  }
}

export function buildBreadcrumbJsonLd(blog: Blog, url: string) {
  // `position` phải liên tục từ 1; category không phải một trang thật nên chỉ có
  // `name`, không kèm `item` — đúng theo spec cho phần tử breadcrumb không link.
  const items: Array<{ name: string; item?: string }> = [
    { name: 'Home', item: absoluteUrl('/') },
    { name: 'Blogs', item: absoluteUrl('/blogs') },
  ]

  if (blog.category) items.push({ name: blog.category })
  items.push({ name: blog.title, item: url })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  }
}

/**
 * Nội dung bài do người dùng nhập nên có thể chứa "</script>". Escape "<" thành
 * dạng unicode để chuỗi không đóng sớm thẻ <script> và biến JSON-LD thành lỗ XSS.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
