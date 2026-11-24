import type { Metadata } from 'next'
import MyBlogsView from '@/src/app/section/Blogs/MyBlogsView'
import BlogsHeader from '@/src/app/section/Blogs/components/BlogsHeader'
import ProtectedRoute from '@/src/components/ProtectedRoute'

// Trang quản trị — xem chú thích ở /blogs/create.
export const metadata: Metadata = {
  title: 'My Blogs',
  robots: { index: false, follow: false },
}

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
