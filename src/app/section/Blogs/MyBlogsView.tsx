'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from 'antd/es/button'
import Empty from 'antd/es/empty'
import Spin from 'antd/es/spin'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import BlogStatusTabs from './components/BlogStatusTabs'
import BlogTimeline from './components/BlogTimeline'
import TimelineLoadMore from './components/TimelineLoadMore'
import TimelineYearRail from './components/TimelineYearRail'
import { MAX_AUTO_LOAD_ITEMS } from './constants/myBlogs'
import { useActiveYear } from './hook/useActiveYear'
import { useMyBlogs } from './hook/useMyBlogs'
import { useMyBlogsArchive } from './hook/useMyBlogsArchive'
import { blogApi } from '@/src/lib/api/blog'
import { BlogArchiveYear, BlogListItem, BlogStatusFilter } from '@/src/lib/types'
import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll'
import { useMessageApi } from '@/src/contexts/MessageContext'

const MyBlogsView = () => {
  const router = useRouter()
  const messageApi = useMessageApi()
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const [status, setStatus] = useState<BlogStatusFilter>('all')
  const [anchor, setAnchor] = useState<BlogArchiveYear | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { blogs, total, hasMore, loading, loadingMore, error, revealFromIndex, loadMore, reload, removeBlog } =
    useMyBlogs({ status, before: anchor?.latestCreatedAt ?? null })

  const { years, refetchArchive } = useMyBlogsArchive(status)
  const activeYear = useActiveYear(blogs.length)

  // Quá ngưỡng thì ngừng tự tải để DOM không phình vô hạn khi cuộn vu vơ
  const autoLoad = blogs.length < MAX_AUTO_LOAD_ITEMS

  useInfiniteScroll({
    targetRef: sentinelRef,
    hasMore,
    isLoading: loading || loadingMore,
    onLoadMore: loadMore,
    enabled: autoLoad && !error,
  })

  const handleSelectYear = (year: BlogArchiveYear | null) => {
    if (!year) {
      setAnchor(null)
      return
    }
    // Đã có trong DOM → chỉ cuộn tới, feed giữ nguyên vị trí và state.
    // Feed sort giảm dần nên node đầu tiên của năm chính là ngày mới nhất năm đó.
    const target = document.querySelector<HTMLElement>(`[data-year="${year.year}"]`)
    if (target) {
      target.scrollIntoView({ block: 'start' })
      return
    }
    // Chưa tải → reset feed, neo tại bài mới nhất của năm đó
    setAnchor(year)
    window.scrollTo({ top: 0 })
  }

  const handleDelete = async (blog: BlogListItem) => {
    try {
      setDeletingId(blog._id)
      await blogApi.deleteBlog(blog._id)
      // Xoá tại chỗ thay vì refetch — không nhảy scroll, không chạy lại animation
      removeBlog(blog._id)
      // Số bài theo năm trên rail phải khớp lại sau khi xoá
      refetchArchive()
      if (messageApi) messageApi.success('Blog deleted successfully')
    } catch (err: any) {
      if (messageApi) messageApi.error(err.response?.data?.message || 'Failed to delete blog')
    } finally {
      setDeletingId(null)
    }
  }

  const renderFeed = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      )
    }

    if (error && blogs.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4 py-20">
          <p className="text-red-500">{error}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      )
    }

    if (blogs.length === 0) {
      return (
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
      )
    }

    return (
      <>
        {/* Remount khi đổi tab / nhảy năm (feed mới, chạy lại reveal) nhưng KHÔNG
            bao giờ remount khi append */}
        <BlogTimeline
          key={`${status}-${anchor?.year ?? 'latest'}`}
          blogs={blogs}
          revealFromIndex={revealFromIndex}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
        <TimelineLoadMore
          sentinelRef={sentinelRef}
          hasMore={hasMore}
          loadingMore={loadingMore}
          error={error}
          autoLoad={autoLoad}
          onLoadMore={loadMore}
        />
      </>
    )
  }

  return (
    <div className="h-full flex flex-col items-center gap-6">
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-4 items-start">
            <Button className="hidden md:block" icon={<ArrowLeftOutlined />} onClick={() => router.push('/blogs')} />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-white">My Blogs</h1>
              <p className="text-sm text-white-200">
                {total === null ? ' ' : `${total} blog${total === 1 ? '' : 's'} total`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <BlogStatusTabs value={status} onChange={setStatus} />
          <TimelineYearRail
            years={years}
            activeYear={activeYear}
            anchorYear={anchor?.year ?? null}
            onSelectYear={handleSelectYear}
          />
        </div>

        {renderFeed()}
      </div>
    </div>
  )
}

export default MyBlogsView
