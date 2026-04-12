'use client'

import React from 'react'
import EditBlogView from '../../../../section/Blogs/EditBlogView'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import Navbar from '@/src/layouts/navbar'
import { navItems } from '../../../../data/helper'

export default function EditBlogPage() {
  return (
    <ProtectedRoute adminOnly={false}>
      <div>
        <Navbar navItems={navItems} isShowLoginButton={true} />
        <div className="relative z-10 pt-20">
          <EditBlogView />
        </div>
      </div>
    </ProtectedRoute>
  )
}
