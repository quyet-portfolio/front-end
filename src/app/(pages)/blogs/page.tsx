import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import BlogsView from '../../section/Blogs/BlogsView'
import { BLOG_LOCALE, SITE_NAME, absoluteUrl } from '@/src/lib/site'

const BLOGS_DESCRIPTION =
  'Bài viết về lập trình web, hiệu năng Next.js, kiến trúc hệ thống — cùng những ghi chép về sức khoẻ và tâm lý.'

export const metadata: Metadata = {
  title: 'Blogs',
  description: BLOGS_DESCRIPTION,
  alternates: { canonical: absoluteUrl('/blogs') },
  openGraph: {
    type: 'website',
    title: `Blogs | ${SITE_NAME}`,
    description: BLOGS_DESCRIPTION,
    url: absoluteUrl('/blogs'),
    siteName: SITE_NAME,
    locale: BLOG_LOCALE,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blogs | ${SITE_NAME}`,
    description: BLOGS_DESCRIPTION,
  },
}

const BlogPage = () => {
  return (
    <Suspense>
      <BlogsView />
    </Suspense>
  )
}

export default BlogPage
