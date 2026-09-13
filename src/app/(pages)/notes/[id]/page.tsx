import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NotesDetailView from '@/src/app/section/Notes/view/DetailNotesView'
import { getFlashCardForPage } from '@/src/lib/api/notesServer'
import { buildFlashcardQuizJsonLd, buildNoteBreadcrumbJsonLd, serializeJsonLd } from '@/src/lib/jsonLd'
import { NOTES_LOCALE, SITE_NAME, absoluteUrl } from '@/src/lib/site'
import { toNoteDescription } from '@/src/utils/seo'

// Server component: `generateMetadata` chỉ chạy được ở đây, và đây cũng là nơi
// duy nhất đưa được nội dung bộ thẻ vào HTML đầu tiên.
type NotesDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: NotesDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const canonical = absoluteUrl(`/notes/${id}`)
  const result = await getFlashCardForPage(id)

  if (result.status !== 'ok') {
    // API tạm chết thì KHÔNG được khai noindex: Google gặp đúng lúc đó sẽ gỡ một
    // trang hợp lệ khỏi index. Chỉ trả về metadata tối thiểu và để lần crawl sau
    // lấy bản đầy đủ. Trường hợp not-found đã có metadata riêng ở not-found.tsx.
    return { title: 'Notes', alternates: { canonical } }
  }

  const { flashcard } = result
  const description = toNoteDescription(flashcard)
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
      locale: NOTES_LOCALE,
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

const NotesDetailPage = async ({ params }: NotesDetailPageProps) => {
  const { id } = await params

  // Cùng tham số với lần gọi trong generateMetadata, và hàm đã bọc cache() nên chỉ
  // có một request cho mỗi lượt render.
  const result = await getFlashCardForPage(id)

  if (result.status === 'not-found') notFound()

  // API chết thì vẫn render view và để client tự thử lại — không biến sự cố tạm
  // thời của back-end thành trang 404 cho một bộ thẻ vẫn còn tồn tại.
  if (result.status === 'unavailable') return <NotesDetailView />

  const { flashcard } = result
  const canonical = absoluteUrl(`/notes/${flashcard._id}`)
  const description = toNoteDescription(flashcard)

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
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildNoteBreadcrumbJsonLd(flashcard, canonical)) }}
      />
      <NotesDetailView initialFlashcard={flashcard} />
    </>
  )
}

export default NotesDetailPage
