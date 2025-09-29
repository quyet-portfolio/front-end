'use client'

import React from 'react'
import Spotlight from '../../components/Layout/ui/Spotlight'
import { dataBlogs } from '../../data/blogs'
import CardContainer from '../../components/Layout/ui/CardContainer'
import Image from 'next/image'
import BlogsView from '../../section/Blogs/BlogsView'

const BlogPage = () => {
  return (
    <BlogsView />
  )
}

export default BlogPage
