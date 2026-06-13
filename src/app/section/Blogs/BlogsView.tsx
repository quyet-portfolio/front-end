'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button from 'antd/es/button'
import { useEffect, useMemo, useState } from 'react'
import BlogsHeader from './components/BlogsHeader'
import BlogHeading from './BlogsHeading'
import { useBlogs } from '@/src/hooks/useBlogs'
import { blogApi, GetBlogsParams } from '@/src/lib/api/blog'
import { stripHtml } from '@/src/utils/stringUtils'

const PAGE_SIZE = 9

const BlogsView = () => {
  const [search, setSearch] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [page, setPage] = useState<number>(1)
  const [categories, setCategories] = useState<string[]>([])

  // Build server-side query params (category 'All' / empty search are omitted)
  const params = useMemo<GetBlogsParams>(() => {
    const next: GetBlogsParams = { page, limit: PAGE_SIZE }
    if (search) next.search = search
    if (selectedCategory !== 'All') next.category = selectedCategory
    return next
  }, [page, search, selectedCategory])

  const { blogs, pagination, loading, error } = useBlogs(params)

  // Categories are fetched once, independent of search/pagination
  useEffect(() => {
    blogApi
      .getCategories()
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories([]))
  }, [])

  const categoryTabs = useMemo<string[]>(() => ['All', ...categories], [categories])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat)
    setPage(1)
  }

  const hasActiveFilter = search !== '' || selectedCategory !== 'All'

  return (
    <div className="h-full my-6 z-10 flex flex-col items-center justify-center gap-6">
      <BlogsHeader defaultValue={search} onSearch={handleSearch} />

      <BlogHeading />

      <div className="w-full">
        {/* Toolbar: category filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                ${
                  selectedCategory === cat
                    ? 'bg-primary border-primary text-white'
                    : 'bg-transparent border-blue-950 text-white-100 hover:border-blue-500 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

          {/* Active search summary */}
          {search && (
            <div className="mb-4 text-sm text-white-200">
              Showing results for <span className="font-semibold text-white">&quot;{search}&quot;</span>
              {pagination ? ` — ${pagination.totalBlogs} found` : ''}
            </div>
          )}

          {loading ? (
            <div className="text-white text-center py-20">Loading blogs...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-20">Error loading blogs: {error}</div>
          ) : blogs.length === 0 ? (
            <div className="text-white text-center py-20">
              {hasActiveFilter ? 'No blogs match your filters.' : 'No blogs published yet.'}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
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
                          <span className="text-xs font-semibold text-white-100">
                            By: {blog.author?.username || 'Unknown'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <Button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-white-100">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
    </div>
  )
}

export default BlogsView
