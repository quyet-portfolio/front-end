import { Blog } from './types'
import { Flashcard } from '@/src/app/section/Flashcards/types'
import { BLOG_LANG, SITE_NAME, SITE_URL, absoluteUrl } from './site'
import { flashcardsRoutes } from '@/src/app/section/Flashcards/routes'

// Bộ thẻ được phép có tới 1000 term. Nhét hết vào JSON-LD là cả trăm KB chữ trong
// <head> trước khi trình duyệt vẽ được gì; 100 thẻ đầu đã đủ để mô tả bộ thẻ.
const QUIZ_MAX_FLASHCARDS = 100

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

/**
 * Bộ thẻ dưới dạng schema.org `Quiz` gồm các `Question` loại "Flashcard".
 *
 * Đây đúng là kiểu Google dùng cho structured data học tập (Education Q&A): mỗi
 * thẻ là một câu hỏi với mặt trước là `text` và mặt sau là `acceptedAnswer`.
 * Nội dung chỉ lấy từ những gì trang thật sự hiển thị, đúng yêu cầu của Google
 * rằng structured data không được mô tả thứ người dùng không thấy.
 */
export function buildFlashcardQuizJsonLd(flashcard: Flashcard, url: string, description?: string) {
  const terms = flashcard.terms ?? []
  const cards = terms.slice(0, QUIZ_MAX_FLASHCARDS)

  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: flashcard.title,
    description,
    url,
    inLanguage: 'en',
    dateCreated: flashcard.createdAt,
    dateModified: flashcard.updatedAt,
    author: flashcard.createdBy?.username ? { '@type': 'Person', name: flashcard.createdBy.username } : undefined,
    publisher: PUBLISHER,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    numberOfQuestions: terms.length,
    hasPart: cards.map((card) => ({
      '@type': 'Question',
      eduQuestionType: 'Flashcard',
      text: card.term,
      acceptedAnswer: { '@type': 'Answer', text: card.definition },
    })),
  }
}

export function buildFlashcardBreadcrumbJsonLd(flashcard: Flashcard, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { name: 'Home', item: absoluteUrl('/') },
      { name: 'Flashcards', item: absoluteUrl(flashcardsRoutes.list) },
      { name: flashcard.title, item: url },
    ].map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  }
}
