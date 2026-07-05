'use client'

import React from 'react'
import BlogDetailView from '../../../section/Blogs/BlogDetailView'
import BlogsHeader from '../../../section/Blogs/components/BlogsHeader'

export default function BlogDetailPage() {
  return (
    <div className="my-6 z-10 flex flex-col gap-6">
      <BlogsHeader />
      <BlogDetailView />
    </div>
  )
}
