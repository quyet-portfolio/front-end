'use client'

import MyBlogsView from '@/src/app/section/Blogs/MyBlogsView'
import BlogsHeader from '@/src/app/section/Blogs/components/BlogsHeader'
import ProtectedRoute from '@/src/components/ProtectedRoute'

const MyBlogsPage = () => {
  return (
    <ProtectedRoute>
      <div className="my-6 z-10 flex flex-col gap-6">
        <BlogsHeader />
        <MyBlogsView />
      </div>
    </ProtectedRoute>
  )
}

export default MyBlogsPage
