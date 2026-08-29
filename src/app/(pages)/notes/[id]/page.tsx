import { notFound } from 'next/navigation'
import NotesDetailView from '@/src/app/section/Notes/view/DetailNotesView'
import { getFlashCardForPage } from '@/src/lib/api/notesServer'

type NotesDetailPageProps = {
  params: Promise<{ id: string }>
}

// Server component để nội dung bộ thẻ có mặt ngay trong HTML đầu tiên thay vì
// hiện spinner rồi mới gọi API ở client.
const NotesDetailPage = async ({ params }: NotesDetailPageProps) => {
  const { id } = await params
  const result = await getFlashCardForPage(id)

  if (result.status === 'not-found') notFound()

  // API chết thì vẫn render view và để client tự thử lại — không biến sự cố tạm
  // thời của back-end thành trang 404 cho một bộ thẻ vẫn còn tồn tại.
  return <NotesDetailView initialFlashcard={result.status === 'ok' ? result.flashcard : undefined} />
}

export default NotesDetailPage
