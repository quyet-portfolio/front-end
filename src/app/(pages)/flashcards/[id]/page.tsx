import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FlashcardDetailView from '@/src/app/section/Flashcards/view/FlashcardDetailView'
import { getFlashcardForPage } from '@/src/lib/api/flashcardsServer'
import { buildFlashcardQuizJsonLd, buildFlashcardBreadcrumbJsonLd, serializeJsonLd } from '@/src/lib/jsonLd'
import { FLASHCARDS_LOCALE, SITE_NAME, absoluteUrl } from '@/src/lib/site'
import { toFlashcardDescription } from '@/src/utils/seo'
import { flashcardsRoutes } from '@/src/app/section/Flashcards/routes'

// Server component: `generateMetadata` chỉ chạy được ở đây, và đây cũng là nơi
// duy nhất đưa được nội dung bộ thẻ vào HTML đầu tiên.
type FlashcardDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: FlashcardDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const canonical = absoluteUrl(flashcardsRoutes.detail(id))
  const result = await getFlashcardForPage(id)

  if (result.status !== 'ok') {
    // API tạm chết thì KHÔNG được khai noindex: Google gặp đúng lúc đó sẽ gỡ một
    // trang hợp lệ khỏi index. Chỉ trả về metadata tối thiểu và để lần crawl sau
    // lấy bản đầy đủ. Trường hợp not-found đã có metadata riêng ở not-found.tsx.
    return { title: 'Flashcards', alternates: { canonical } }
  }

  const { flashcard } = result
  const description = toFlashcardDescription(flashcard)
  const author = flashcard.createdBy?.username

  return {
    title: flashcard.title,
    description,
    keywords: (flashcard.terms ?? []).slice(0, 10).map((t) => t.term),
    authors: author ? [{ name: author }] : undefined,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: `${flashcard.title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: FLASHCARDS_LOCALE,
      publishedTime: flashcard.createdAt,
      modifiedTime: flashcard.updatedAt,
      authors: author ? [author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${flashcard.title} | ${SITE_NAME}`,
      description,
    },
  }
}

const FlashcardDetailPage = async ({ params }: FlashcardDetailPageProps) => {
  const { id } = await params

  // Cùng tham số với lần gọi trong generateMetadata, và hàm đã bọc cache() nên chỉ
  // có một request cho mỗi lượt render.
  const result = await getFlashcardForPage(id)

  if (result.status === 'not-found') notFound()

  // API chết thì vẫn render view và để client tự thử lại — không biến sự cố tạm
  // thời của back-end thành trang 404 cho một bộ thẻ vẫn còn tồn tại.
  if (result.status === 'unavailable') return <FlashcardDetailView />

  const { flashcard } = result
  const canonical = absoluteUrl(flashcardsRoutes.detail(flashcard._id))
  const description = toFlashcardDescription(flashcard)

  return (
    <>
      {/* JSON-LD: Quiz gồm các Question loại "Flashcard" là kiểu structured data
          Google dùng cho nội dung học tập, cộng breadcrumb cho đường dẫn phân cấp
          trên SERP. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFlashcardQuizJsonLd(flashcard, canonical, description)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFlashcardBreadcrumbJsonLd(flashcard, canonical)) }}
      />
      <FlashcardDetailView initialFlashcard={flashcard} />
    </>
  )
}

export default FlashcardDetailPage
