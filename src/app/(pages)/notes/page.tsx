import type { Metadata } from 'next'
import NotesView from '../../section/Notes/view/NotesView'
import { NOTES_PAGE_SIZE } from '../../section/Notes/constants'
import { getFlashCardsForList } from '@/src/lib/api/notesServer'
import { NOTES_DESCRIPTION, NOTES_LOCALE, SITE_NAME, absoluteUrl } from '@/src/lib/site'

const NOTES_TITLE = 'Notes'

// Từ khoá tìm kiếm và số trang của /notes nằm trong store phía client chứ không
// nằm trên URL, nên chỉ có đúng một URL để khai canonical — không cần nhánh
// noindex cho trang kết quả tìm kiếm như /blogs.
export const metadata: Metadata = {
  title: NOTES_TITLE,
  description: NOTES_DESCRIPTION,
  alternates: { canonical: absoluteUrl('/notes') },
  openGraph: {
    type: 'website',
    title: `${NOTES_TITLE} | ${SITE_NAME}`,
    description: NOTES_DESCRIPTION,
    url: absoluteUrl('/notes'),
    siteName: SITE_NAME,
    locale: NOTES_LOCALE,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${NOTES_TITLE} | ${SITE_NAME}`,
    description: NOTES_DESCRIPTION,
  },
}

export default async function NotesPage() {
  // Dựng sẵn trang đầu ở server. Thiếu bước này thì HTML đầu tiên chỉ có spinner,
  // nghĩa là không có link <a> nào tới trang chi tiết cho tới khi JS chạy.
  const initialData = await getFlashCardsForList(NOTES_PAGE_SIZE)

  return <NotesView initialData={initialData ?? undefined} />
}
