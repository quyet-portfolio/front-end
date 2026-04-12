'use client'

import React from 'react'
import CreateBlogView from '../../../section/Blogs/CreateBlogView'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import Navbar from '@/src/layouts/navbar'
import { navItems } from '../../../data/helper'

const CreateBlogPage = () => {
  return (
    <ProtectedRoute adminOnly={false}>
      <div>
        <Navbar navItems={navItems} isShowLoginButton={true} />
        <div className="relative z-10 pt-20">
          <CreateBlogView />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default CreateBlogPage
