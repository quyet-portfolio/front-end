'use client'

import React from 'react'
import CreateBlogView from '../../../section/Blogs/CreateBlogView'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import BlogsHeader from '../../../section/Blogs/components/BlogsHeader'

const CreateBlogPage = () => {
  return (
    <ProtectedRoute adminOnly={false}>
      <div className="my-6 z-10 flex flex-col gap-6">
        <BlogsHeader />
        <CreateBlogView />
      </div>
    </ProtectedRoute>
  )
}

export default CreateBlogPage
