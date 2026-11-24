import type { Metadata } from 'next'
import EditFlashcardView from '@/src/app/section/Flashcards/view/EditFlashcardView'
import ProtectedRoute from '@/src/components/ProtectedRoute'

// Trang quản trị — xem chú thích ở /blogs/create.
export const metadata: Metadata = {
  title: 'Edit Flashcard Set',
  robots: { index: false, follow: false },
}

const EditFlashcardPage = () => {
  return (
    <ProtectedRoute>
      <EditFlashcardView />
    </ProtectedRoute>
  )
}

export default EditFlashcardPage
