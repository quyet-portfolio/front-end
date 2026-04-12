'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button from 'antd/es/button'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import Navbar from '@/src/layouts/navbar'
import { navItems } from '../../data/helper'
import BlogHeading from './BlogsHeading'
import { useBlogs } from '@/src/hooks/useBlogs'
import { useAuth } from '@/src/contexts/AuthContext'
import { stripHtml } from '@/src/utils/stringUtils'

const BlogsView = () => {
  const router = useRouter()
  const { blogs, loading, error } = useBlogs()
  const { isAuthenticated } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Derive unique categories from blog data
  const categories = useMemo<string[]>(() => {
    const cats = blogs.map((b) => b.category).filter(Boolean) as string[]
    return ['All', ...Array.from(new Set(cats))]
  }, [blogs])

  const filteredBlogs = useMemo(
    () => (selectedCategory === 'All' ? blogs : blogs.filter((b) => b.category === selectedCategory)),
    [blogs, selectedCategory],
  )

  return (
    <div>
      <Navbar navItems={navItems} isShowLoginButton={true} />
      <div className="relative my-16 z-10 flex flex-col items-center justify-center gap-4 px-4">
        <BlogHeading />

        {loading ? (
          <div className="text-white">Loading blogs...</div>
        ) : error ? (
          <div className="text-red-500">Error loading blogs: {error}</div>
        ) : (
          <div className="w-full max-w-7xl">
            {/* Toolbar: category filter + create button */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                      ${selectedCategory === cat
                        ? 'bg-primary border-primary text-white'
                        : 'bg-transparent border-blue-950 text-white-100 hover:border-blue-500 hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {isAuthenticated && (
                <Button type="primary" onClick={() => router.push('/blogs/create')}>
                  Create Blog
                </Button>
              )}
            </div>

            {filteredBlogs.length === 0 ? (
              <div className="text-white text-center py-20">No blogs in this category yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <Link href={`/blogs/${blog.slug}`} key={blog._id} className="flex">
                    <div className="flex flex-col w-full rounded-md border-4 border-blue-950 bg-black-100 overflow-hidden shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:border-blue-600 cursor-pointer">
                      {/* Thumbnail */}
                      <div className="relative w-full h-48 flex-shrink-0">
                        <Image
                          fill
                          className="object-cover"
                          src={blog.featuredImage || '/images/next-js-a-react-js-framework.jpg'}
                          alt={blog.title}
                        />
                        {blog.category && (
                          <span className="absolute top-3 left-3 bg-[#6366F1] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
                            {blog.category}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-col flex-1 px-5 py-4 gap-2">
                        <h3 className="font-bold text-base text-white leading-snug line-clamp-2">{blog.title}</h3>
                        <p className="text-white-200 text-sm leading-relaxed line-clamp-3 flex-1">
                          {stripHtml(blog.excerpt || blog.content)}
                        </p>

                        {/* Footer pinned to bottom */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-800 mt-auto">
                          <span className="text-xs font-semibold text-white-100">By: {blog.author?.username || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogsView
