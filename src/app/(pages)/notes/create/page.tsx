import CreateNotesView from '@/src/app/section/Notes/view/CreatNoteView'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import React from 'react'

const CreateNotesPage = () => {
  return (
    <ProtectedRoute>
      <CreateNotesView />
    </ProtectedRoute>
  )
}

export default CreateNotesPage
