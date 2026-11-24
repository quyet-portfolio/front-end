import React from 'react'
import type { Metadata } from 'next'
import CreateBlogView from '../../../section/Blogs/CreateBlogView'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import BlogsHeader from '../../../section/Blogs/components/BlogsHeader'

// Trang quản trị: chặn cả index lẫn follow. ProtectedRoute chỉ redirect ở phía
// client nên crawler vẫn nhận được HTML của trang — noindex mới là thứ giữ nó
// khỏi kết quả tìm kiếm.
export const metadata: Metadata = {
  title: 'Create a New Blog',
  robots: { index: false, follow: false },
}

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
