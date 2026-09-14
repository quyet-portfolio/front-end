import type { Metadata } from 'next'
import FlashcardsView from '../../section/Flashcards/view/FlashcardsView'
import { FLASHCARDS_PAGE_SIZE } from '../../section/Flashcards/constants'
import { getFlashcardsForList } from '@/src/lib/api/flashcardsServer'
import { FLASHCARDS_DESCRIPTION, FLASHCARDS_LOCALE, SITE_NAME, absoluteUrl } from '@/src/lib/site'
import { flashcardsRoutes } from '@/src/app/section/Flashcards/routes'

const FLASHCARDS_TITLE = 'Flashcards'

// Từ khoá tìm kiếm và số trang của /flashcards nằm trong store phía client chứ không
// nằm trên URL, nên chỉ có đúng một URL để khai canonical — không cần nhánh
// noindex cho trang kết quả tìm kiếm như /blogs.
export const metadata: Metadata = {
  title: FLASHCARDS_TITLE,
  description: FLASHCARDS_DESCRIPTION,
  alternates: { canonical: absoluteUrl(flashcardsRoutes.list) },
  openGraph: {
    type: 'website',
    title: `${FLASHCARDS_TITLE} | ${SITE_NAME}`,
    description: FLASHCARDS_DESCRIPTION,
    url: absoluteUrl(flashcardsRoutes.list),
    siteName: SITE_NAME,
    locale: FLASHCARDS_LOCALE,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${FLASHCARDS_TITLE} | ${SITE_NAME}`,
    description: FLASHCARDS_DESCRIPTION,
  },
}

export default async function FlashcardsPage() {
  // Dựng sẵn trang đầu ở server. Thiếu bước này thì HTML đầu tiên chỉ có spinner,
  // nghĩa là không có link <a> nào tới trang chi tiết cho tới khi JS chạy.
  const initialData = await getFlashcardsForList(FLASHCARDS_PAGE_SIZE)

  return <FlashcardsView initialData={initialData ?? undefined} />
}
