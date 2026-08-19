import React from 'react'
import type { Metadata } from 'next'
import EditBlogView from '../../../../section/Blogs/EditBlogView'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import BlogsHeader from '../../../../section/Blogs/components/BlogsHeader'

// Trang quản trị — xem chú thích ở /blogs/create.
export const metadata: Metadata = {
  title: 'Edit Blog',
  robots: { index: false, follow: false },
}

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
