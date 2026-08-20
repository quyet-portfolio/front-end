'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BlogsHeader from './components/BlogsHeader'
import BlogHeading, { FALLBACK_IMAGE_BLOG } from './BlogsHeading'
import { useBlogs, usePrefetchBlogs } from '@/src/hooks/useBlogs'
import { usePrefetchBlog } from '@/src/hooks/useBlog'
import { useBlogCategories } from '@/src/hooks/useBlogCategories'
import { GetBlogsParams } from '@/src/lib/api/blog'
import { CategoriesResponse } from '@/src/lib/api/category'
import { Blog, BlogsResponse } from '@/src/lib/types'
import { stripHtml } from '@/src/utils/stringUtils'
import { recoverEscapedHtml } from '@/src/utils/htmlContent'
import { BlogListState, DEFAULT_CATEGORY, buildHref, buildParams, parseBlogListState } from './utils/listParams'

// Kiểu dáng dùng chung cho tab category và nút chuyển trang — cả hai giờ đều là
// thẻ <a> thật để crawler đi tiếp được, không còn là <button> chỉ đổi state.
const PILL_BASE = 'px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200'
const PILL_ACTIVE = 'bg-primary border-primary text-white'
const PILL_IDLE = 'bg-transparent border-blue-950 text-white-100 hover:border-blue-500 hover:text-white'
const PILL_DISABLED = 'bg-transparent border-blue-950/50 text-gray-600 cursor-not-allowed'

interface BlogsViewProps {
  // Trang danh sách do server dựng sẵn, kèm chính trạng thái mà server đã dùng.
  initialState?: BlogListState
  initialBlogs?: BlogsResponse
  initialCategories?: CategoriesResponse
  initialFeatured?: { blogs: Blog[] }
}

const BlogsView = ({ initialState, initialBlogs, initialCategories, initialFeatured }: BlogsViewProps = {}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Trạng thái danh sách đọc TỪ URL chứ không giữ trong useState. Trước đây trang
  // 2 và các category không có địa chỉ riêng, nên crawler chỉ thấy được 9 bài đầu
  // và những bài còn lại không có đường nào dẫn tới.
  const { page, search, category: selectedCategory } = parseBlogListState({
    page: searchParams.get('page'),
    category: searchParams.get('category'),
    search: searchParams.get('search'),
  })

  const listTopRef = useRef<HTMLDivElement>(null)

  // Deps là ba giá trị nguyên thuỷ chứ không phải `state`: object mới mỗi lần
  // render sẽ làm useMemo vô nghĩa, kéo theo effect prefetch trong useBlogs chạy
  // lại sau từng lần render.
  const params = useMemo<GetBlogsParams>(
    () => buildParams({ page, search, category: selectedCategory }),
    [page, search, selectedCategory],
  )

  // URL đổi ngay khi bắt đầu điều hướng, còn props mới thì phải chờ RSC payload
  // về. Trong khoảng đó `state` đã là trang 2 trong khi `initialBlogs` vẫn là dữ
  // liệu trang 1 — dùng thẳng sẽ nhét dữ liệu trang 1 vào cache của trang 2.
  const serverBlogs =
    initialState &&
    initialState.page === page &&
    initialState.search === search &&
    initialState.category === selectedCategory
      ? initialBlogs
      : undefined

  const { blogs, pagination, loading, error, isPlaceholderData } = useBlogs(params, serverBlogs)
  const prefetchBlogs = usePrefetchBlogs()
  const prefetchBlog = usePrefetchBlog()

  // Categories are fetched once, independent of search/pagination
  const { categories } = useBlogCategories({ inUse: true }, initialCategories)

  const categoryTabs = useMemo<string[]>(
    () => [DEFAULT_CATEGORY, ...categories.map((category) => category.name)],
    [categories]
  )

  // Hover là tín hiệu ý định rẻ tiền: kéo sẵn dữ liệu trước cả cú click.
  // Trùng với prefetch tự động trong useBlogs cũng vô hại — react-query dedupe.
  const prefetchPage = (target: number) => {
    if (target < 1) return
    prefetchBlogs(buildParams({ page: target, search, category: selectedCategory }))
  }

  const prefetchCategory = (category: string) => {
    if (category === selectedCategory) return
    prefetchBlogs(buildParams({ page: 1, search, category }))
  }

  // Danh sách cũ giờ không còn bị xoá khi đổi trang, nên phải tự đưa người dùng
  // về đầu danh sách — nếu không họ sẽ đứng ở cuối trang mới và bỏ lỡ phần đầu.
  // Link đi kèm scroll={false} để Next không nhảy lên đỉnh trang trước đã.
  const scrollToListTop = () => {
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Ô tìm kiếm nằm trong BlogsHeader nên vẫn phải điều hướng bằng tay.
  // push (không phải replace) để nút Back của trình duyệt quay lại được kết quả trước.
  const handleSearch = (value: string) => {
    router.push(buildHref({ page: 1, search: value, category: selectedCategory }))
  }

  const hasActiveFilter = search !== '' || selectedCategory !== 'All'

  return (
    <div className="h-full my-6 z-10 flex flex-col items-center justify-center gap-6">
      <BlogsHeader defaultValue={search} onSearch={handleSearch} />

      {search === '' && <BlogHeading initialFeatured={initialFeatured} />}

      <div className="w-full" ref={listTopRef}>
        {/* Toolbar: category filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categoryTabs.map((cat) => (
            <Link
              key={cat}
              href={buildHref({ page: 1, search, category: cat })}
              scroll={false}
              aria-current={selectedCategory === cat ? 'page' : undefined}
              onMouseEnter={() => prefetchCategory(cat)}
              onFocus={() => prefetchCategory(cat)}
              className={`${PILL_BASE} ${selectedCategory === cat ? PILL_ACTIVE : PILL_IDLE}`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Active search summary */}
        {search && (
          <div className="mb-4 text-sm text-white-200">
            Showing results for <span className="font-semibold text-white">&quot;{search}&quot;</span>
            {pagination ? ` — ${pagination.totalBlogs} found` : ''}
          </div>
        )}

        {/* Lỗi khi đã có dữ liệu cũ trên màn hình: báo bằng banner và giữ nguyên
            danh sách, thay vì đổi cả trang lấy một dòng chữ đỏ. */}
        {error && blogs.length > 0 && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            Could not load this page: {error}
          </div>
        )}

        {loading ? (
          <div className="text-white text-center py-20">Loading blogs...</div>
        ) : error && blogs.length === 0 ? (
          <div className="text-red-500 text-center py-20">Error loading blogs: {error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-white text-center py-20">
            {hasActiveFilter ? 'No blogs match your filters.' : 'No blogs published yet.'}
          </div>
        ) : (
          <>
            {/* Trang cũ được giữ lại và làm mờ trong lúc chờ trang mới — tránh
                việc grid biến mất khiến layout nhảy và mất vị trí cuộn. */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${
                isPlaceholderData ? 'opacity-50 pointer-events-none' : 'opacity-100'
              }`}
              aria-busy={isPlaceholderData}
            >
              {blogs.map((blog) => (
                <Link
                  href={`/blogs/${blog.slug}`}
                  key={blog._id}
                  className="flex"
                  onPointerDown={() => prefetchBlog(blog.slug)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="group relative flex flex-col w-full rounded-xl overflow-hidden cursor-pointer
                      bg-gradient-to-br from-[#0d1433] to-[#0a0f24]
                      border border-white/5 hover:border-indigo-500/60
                      shadow-sm hover:shadow-indigo-900/30 hover:shadow-lg
                      transition-all duration-300"
                  >
                    {/* Decorative accent line */}
                    <div className="absolute bottom-0 left-0 z-10 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-b-xl" />

                    {/* Thumbnail */}
                    <div className="relative w-full h-48 flex-shrink-0">
                      <Image
                        fill
                        className="object-cover"
                        src={blog.featuredImage || FALLBACK_IMAGE_BLOG}
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
                      <p className="text-white-200 text-sm leading-relaxed line-clamp-1 flex-1">
                        {stripHtml(recoverEscapedHtml(blog.excerpt || blog.content))}
                      </p>

                      {/* Footer pinned to bottom */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-800 mt-auto">
                        <span className="text-xs font-semibold text-white-100">
                          By: {blog.author?.username || 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <nav className="flex items-center justify-center gap-4 mt-10" aria-label="Blog pagination">
                {pagination.hasPrevPage ? (
                  <Link
                    href={buildHref({ page: page - 1, search, category: selectedCategory })}
                    scroll={false}
                    rel="prev"
                    onMouseEnter={() => prefetchPage(page - 1)}
                    onFocus={() => prefetchPage(page - 1)}
                    onClick={scrollToListTop}
                    className={`${PILL_BASE} ${PILL_IDLE}`}
                  >
                    Previous
                  </Link>
                ) : (
                  <span className={`${PILL_BASE} ${PILL_DISABLED}`}>Previous</span>
                )}
                <span className="text-sm text-white-100">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                {pagination.hasNextPage ? (
                  <Link
                    href={buildHref({ page: page + 1, search, category: selectedCategory })}
                    scroll={false}
                    rel="next"
                    onMouseEnter={() => prefetchPage(page + 1)}
                    onFocus={() => prefetchPage(page + 1)}
                    onClick={scrollToListTop}
                    className={`${PILL_BASE} ${PILL_IDLE}`}
                  >
                    Next
                  </Link>
                ) : (
                  <span className={`${PILL_BASE} ${PILL_DISABLED}`}>Next</span>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BlogsView
