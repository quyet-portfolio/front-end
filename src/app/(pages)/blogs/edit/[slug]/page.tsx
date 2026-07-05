'use client'

import React from 'react'
import EditBlogView from '../../../../section/Blogs/EditBlogView'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import BlogsHeader from '../../../../section/Blogs/components/BlogsHeader'

export default function EditBlogPage() {
  return (
    <ProtectedRoute adminOnly={false}>
      <div className="my-6 z-10 flex flex-col gap-6">
        <BlogsHeader />
        <EditBlogView />
      </div>
    </ProtectedRoute>
  )
}
