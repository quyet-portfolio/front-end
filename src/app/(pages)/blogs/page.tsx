'use client'

import React, { Suspense } from 'react'
import BlogsView from '../../section/Blogs/BlogsView'

const BlogPage = () => {
  return (
    <Suspense>
      <BlogsView />
    </Suspense>
  )
}

export default BlogPage
