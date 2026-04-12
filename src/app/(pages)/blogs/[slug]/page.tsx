'use client'

import React from 'react'
import BlogDetailView from '../../../section/Blogs/BlogDetailView'
import Navbar from '@/src/layouts/navbar'
import { navItems } from '../../../data/helper'

export default function BlogDetailPage() {
  return (
    <div>
      <Navbar navItems={navItems} isShowLoginButton={true} />
      <div className="relative z-10 pt-20">
        <BlogDetailView />
      </div>
    </div>
  )
}
