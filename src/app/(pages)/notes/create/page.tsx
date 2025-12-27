import CreateNotesView from '@/src/app/section/Notes/create-notes'
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
