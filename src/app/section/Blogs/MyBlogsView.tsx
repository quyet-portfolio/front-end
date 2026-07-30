'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from 'antd/es/button'
import Empty from 'antd/es/empty'
import Spin from 'antd/es/spin'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import MyBlogCard from './components/MyBlogCard'
import { useMyBlogs } from './hook/useMyBlogs'
import { blogApi } from '@/src/lib/api/blog'
import { Blog } from '@/src/lib/types'
import { useMessageApi } from '@/src/contexts/MessageContext'

const PAGE_SIZE = 9

type BlogStatusFilter = 'all' | 'published' | 'draft'

const STATUS_TABS: Array<{ key: BlogStatusFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
]

const MyBlogsView = () => {
  const router = useRouter()
  const messageApi = useMessageApi()

  const [page, setPage] = useState<number>(1)
  const [status, setStatus] = useState<BlogStatusFilter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { blogs, pagination, loading, error, refetch } = useMyBlogs({ page, limit: PAGE_SIZE })

  // Status filter is applied on the current page — the API returns all statuses
  const visibleBlogs = useMemo<Blog[]>(() => {
    if (status === 'all') return blogs
    return blogs.filter((blog) => (status === 'published' ? blog.isPublished : !blog.isPublished))
  }, [blogs, status])

  const handleDelete = async (blog: Blog) => {
    try {
      setDeletingId(blog._id)
      await blogApi.deleteBlog(blog._id)
      if (messageApi) messageApi.success('Blog deleted successfully')
      // Step back a page when the last item of a non-first page is removed
      if (blogs.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
        return
      }
      await refetch()
    } catch (err: any) {
      if (messageApi) messageApi.error(err.response?.data?.message || 'Failed to delete blog')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="h-full flex flex-col items-center gap-6">
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-4 items-start">
            <Button className='hidden md:block' icon={<ArrowLeftOutlined />} onClick={() => router.push('/blogs')} />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-white">My Blogs</h1>
              <p className="text-sm text-white-200">
                {pagination ? `${pagination.totalBlogs} blog${pagination.totalBlogs === 1 ? '' : 's'} total` : ' '}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                ${
                  status === tab.key
                    ? 'bg-primary border-primary text-white'
                    : 'bg-transparent border-blue-950 text-white-100 hover:border-blue-500 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-red-500">{error}</p>
            <Button onClick={refetch}>Try again</Button>
          </div>
        ) : visibleBlogs.length === 0 ? (
          <div className="py-20">
            <Empty
              description={
                <span className="text-white-200">
                  {status === 'all' ? 'You have not written any blog yet' : 'No blogs with this status'}
                </span>
              }
            >
              {status === 'all' && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/blogs/create')}>
                  Write your first blog
                </Button>
              )}
            </Empty>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleBlogs.map((blog) => (
                <MyBlogCard key={blog._id} blog={blog} deleting={deletingId === blog._id} onDelete={handleDelete} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Button disabled={!pagination.hasPrevPage} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </Button>
                <span className="text-sm text-white-100">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)}>
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

export default MyBlogsView
