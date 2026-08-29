import CreateNoteView from '@/src/app/section/Notes/view/CreateNoteView'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import React from 'react'

const CreateNotesPage = () => {
  return (
    <ProtectedRoute>
      <CreateNoteView />
    </ProtectedRoute>
  )
}

export default CreateNotesPage
