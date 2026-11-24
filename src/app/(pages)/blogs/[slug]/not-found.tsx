import React from 'react'
import type { Metadata } from 'next'
import BlogDetailView from '../../../section/Blogs/BlogDetailView'
import BlogsHeader from '../../../section/Blogs/components/BlogsHeader'
import { BLOG_LANG } from '@/src/lib/site'

/**
 * Trang này chạy khi server không đọc được bài (HTTP 404).
 *
 * Nó dựng lại đúng cây component của trang chi tiết, chỉ khác là KHÔNG có
 * `initialBlog`. Lý do: request phía server luôn ẩn danh, nên bản nháp của chính
 * tác giả cũng bị API trả 404. BlogDetailView sẽ fetch lại ở client kèm token —
 * tác giả xem được bản nháp, còn người lạ và crawler nhận đúng trạng thái 404 và
 * thấy giao diện "Blog not found" có sẵn trong component.
 */
// Cần khai báo tường minh: metadata của page.tsx bị bỏ qua khi notFound() được
// gọi, nên nếu không có dòng này trang sẽ kế thừa `index, follow` từ root layout
// và nằm cạnh thẻ noindex mà Next tự chèn — hai chỉ thị mâu thuẫn trên cùng một trang.
export const metadata: Metadata = {
  title: 'Blog not found',
  robots: { index: false, follow: true },
}

export default function BlogNotFound() {
  return (
    <div className="my-6 z-10 flex flex-col gap-6">
      <BlogsHeader />
      <div lang={BLOG_LANG}>
        <BlogDetailView />
      </div>
    </div>
  )
}
