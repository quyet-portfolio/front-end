import type { Metadata } from 'next'
import CreateNoteView from '@/src/app/section/Notes/view/CreateNoteView'
import ProtectedRoute from '@/src/components/ProtectedRoute'

// Trang quản trị — xem chú thích ở /blogs/create.
export const metadata: Metadata = {
  title: 'Create a New Note',
  robots: { index: false, follow: false },
}

const CreateNotesPage = () => {
  return (
    <ProtectedRoute>
      <CreateNoteView />
    </ProtectedRoute>
  )
}

export default CreateNotesPage
