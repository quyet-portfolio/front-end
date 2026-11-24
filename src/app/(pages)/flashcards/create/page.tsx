import type { Metadata } from 'next'
import CreateFlashcardView from '@/src/app/section/Flashcards/view/CreateFlashcardView'
import ProtectedRoute from '@/src/components/ProtectedRoute'

// Trang quản trị — xem chú thích ở /blogs/create.
export const metadata: Metadata = {
  title: 'Create a Flashcard Set',
  robots: { index: false, follow: false },
}

const CreateFlashcardPage = () => {
  return (
    <ProtectedRoute>
      <CreateFlashcardView />
    </ProtectedRoute>
  )
}

export default CreateFlashcardPage
