import type { Metadata } from 'next'
import { Button, Result } from 'antd'
import { flashcardsRoutes } from '@/src/app/section/Flashcards/routes'

// Cần khai báo tường minh: metadata của page.tsx bị bỏ qua khi notFound() được
// gọi, nên nếu không có dòng này trang sẽ kế thừa `index, follow` từ root layout
// và nằm cạnh thẻ noindex mà Next tự chèn — hai chỉ thị mâu thuẫn trên cùng một trang.
export const metadata: Metadata = {
  title: 'Flashcard set not found',
  robots: { index: false, follow: true },
}

const FlashcardNotFound = () => (
  <Result
    status="404"
    title="Flashcard set not found"
    subTitle="This flashcard set does not exist, or it has been deleted."
    extra={
      <Button type="primary" href={flashcardsRoutes.list}>
        Back to flashcards
      </Button>
    }
  />
)

export default FlashcardNotFound
