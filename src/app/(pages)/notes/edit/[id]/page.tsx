import type { Metadata } from 'next'
import EditNotesView from '@/src/app/section/Notes/view/EditNotesView'
import ProtectedRoute from '@/src/components/ProtectedRoute'

// Trang quản trị — xem chú thích ở /blogs/create.
export const metadata: Metadata = {
  title: 'Edit Note',
  robots: { index: false, follow: false },
}

const EditNotesPage = () => {
  return (
    <ProtectedRoute>
      <EditNotesView />
    </ProtectedRoute>
  )
}

export default EditNotesPage
