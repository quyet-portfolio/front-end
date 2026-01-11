import EditNotesView from '@/src/app/section/Notes/view/EditNotesView'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import React from 'react'

const EditNotesPage = () => {
  return (
    <ProtectedRoute>
      <EditNotesView />
    </ProtectedRoute>
  )
}

export default EditNotesPage
