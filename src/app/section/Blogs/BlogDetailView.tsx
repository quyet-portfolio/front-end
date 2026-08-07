'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  HeartOutlined,
  HeartFilled,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExpandOutlined,
} from '@ant-design/icons'
import Button from 'antd/es/button'
import Tag from 'antd/es/tag'
// Alias để không đụng tên với next/image — antd chỉ dùng cho lớp lightbox
import AntImage from 'antd/es/image'
import Spin from 'antd/es/spin'
import Breadcrumb from 'antd/es/breadcrumb'
import Popconfirm from 'antd/es/popconfirm'
import dynamic from 'next/dynamic'
import DOMPurify from 'isomorphic-dompurify'
import { useQueryClient } from '@tanstack/react-query'
import { blogApi } from '@/src/lib/api/blog'
import { blogKeys } from '@/src/lib/queryKeys'
import { useBlog } from '@/src/hooks/useBlog'
import { recoverEscapedHtml } from '@/src/utils/htmlContent'
import { useAuth } from '@/src/contexts/AuthContext'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { FALLBACK_IMAGE_BLOG } from './BlogsHeading'
import ScrollToTopButton from './components/ScrollToTopButton'

const MarkdownContent = dynamic(() => import('./components/MarkdownContent'), {
  ssr: false,
  loading: () => <div className="text-gray-500">Loading content…</div>,
})

const BlogDetailView = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [deleting, setDeleting] = useState<boolean>(false)
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  // Kết quả like đè lên dữ liệu server cho tới khi rời trang. Cố tình KHÔNG
  // invalidate query chi tiết: refetch sẽ cộng thêm một lượt view giả.
  // Gắn kèm slug để override tự hết hiệu lực khi sang bài khác — không cần effect
  // reset, thứ sẽ tạo thêm một lượt render thừa với dữ liệu sai.
  const [likeOverride, setLikeOverride] = useState<{
    slug: string
    count: number
    isLiked: boolean
  } | null>(null)

  const { isAuthenticated, user } = useAuth()
  const messageApi = useMessageApi()
  const queryClient = useQueryClient()

  // Bản cũ fetch lại mỗi khi object `user` đổi tham chiếu — mỗi lần như vậy là
  // một lượt view bị đếm thừa. useQuery chỉ gọi một lần cho mỗi slug.
  const { blog, loading, error } = useBlog(slug)

  const activeLikeOverride = likeOverride?.slug === slug ? likeOverride : null

  const likesCount = activeLikeOverride?.count ?? blog?.likes.length ?? 0
  const isLiked = useMemo(() => {
    if (activeLikeOverride) return activeLikeOverride.isLiked
    if (!user || !blog) return false
    return blog.likes.some((l: any) => l._id === user._id || l === user._id)
  }, [activeLikeOverride, user, blog])

  const handleLike = async () => {
    if (!isAuthenticated) {
      if (messageApi) messageApi.info('Please login to like this blog')
      return router.push('/login')
    }

    if (!blog) return

    try {
      const res = await blogApi.likeBlog(blog._id)
      setLikeOverride({ slug, count: res.likesCount, isLiked: res.isLiked })
    } catch (err: any) {
      if (messageApi) {
        messageApi.error(err.response?.data?.message || 'Action failed')
      }
    }
  }

  const handleDelete = async () => {
    if (!blog) return

    try {
      setDeleting(true)
      await blogApi.deleteBlog(blog._id)
      if (messageApi) messageApi.success('Blog deleted successfully')
      // Dọn cache trước khi điều hướng, nếu không /blogs sẽ dựng lại danh sách
      // cũ (còn nguyên bài vừa xoá) từ cache và hiển thị tức thì.
      queryClient.removeQueries({ queryKey: blogKeys.detail(blog.slug) })
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogKeys.featured() })
      router.push('/blogs')
    } catch (err: any) {
      if (messageApi) {
        messageApi.error(err.response?.data?.message || 'Failed to delete blog')
      }
      setDeleting(false)
    }
  }

  // Author hoặc admin mới được sửa/xoá bài
  const canManage = !!user && !!blog && (user._id === blog.author._id || user.role === 'admin')

  const coverImage = blog?.featuredImage || FALLBACK_IMAGE_BLOG

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spin size="large" />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto p-6 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">404 — {error || 'Blog not found'}</h2>
        <Link href="/blogs">
          <Button>Back to Blogs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-0 sm:px-4 max-w-4xl mb-16 mt-6 text-white">

      {/* Breadcrumb — single line with ellipsis on overflow */}
      <Breadcrumb
        className="!mb-6 sm:!mb-10 text-white-100 w-full px-4 sm:px-0 [&_ol]:flex-nowrap [&_li]:whitespace-nowrap [&_.ant-breadcrumb-separator]:!mx-1.5"
        items={[
          {
            href: '/',
            title: <HomeOutlined style={{ fontSize: "20px" }} className="text-white-100" />,
          },
          {
            href: '/blogs',
            title: <span className="text-white-100 hover:text-white text-[16px] font-medium">Blogs</span>,
          },
          ...(blog.category
            ? [{ title: <span className="text-blue-400 text-[16px] font-medium">{blog.category}</span> }]
            : []),
          {
            title: <span className="text-gray-500 max-w-[140px] sm:max-w-[320px] truncate inline-block align-bottom text-[16px] font-medium">{blog.title}</span>,
          },
        ]}
      />

      {/* Card wrapper */}
      <div className="rounded-none sm:rounded-lg border-x-0 border-y sm:border bg-black-100 shadow-xl overflow-hidden border-blue-950">
        {/* Featured Image Banner — click để mở lightbox xem ảnh cỡ lớn */}
        <div
          role="button"
          tabIndex={0}
          aria-label="View cover image in full size"
          onClick={() => setPreviewOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setPreviewOpen(true)
            }
          }}
          className="group relative w-full h-[380px] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-inset"
        >
          <Image
            src={coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000319] via-[#000319]/40 to-transparent" />
          {/* Gợi ý ảnh bấm được — chỉ hiện khi hover, không che tiêu đề */}
          <span className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black-100/80 px-3 py-1.5 text-xs font-medium text-white-100 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
            <ExpandOutlined /> View full size
          </span>
          {/* Text đè lên ảnh: bỏ qua chuột để mọi cú click đều rơi vào banner */}
          <div className="pointer-events-none absolute bottom-6 left-6 z-10 pr-8">
            {blog.category && (
              <Tag className="!mb-3 !px-3 !py-1 text-sm font-bold !bg-primary-100">
                {blog.category.toUpperCase()}
              </Tag>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-md">{blog.title}</h1>
          </div>
        </div>

        <div className="px-0 md:px-10 py-6">
          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-800 mb-6">
            {/* Author + date */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-8 h-8 rounded-full bg-blue-100/20 flex items-center justify-center font-bold text-blue-100 flex-shrink-0">
                {blog.author.username.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-white-100">By {blog.author.username}</span>
              <span className="mx-1">•</span>
              <span>
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Views + Like + Edit */}
            <div className="flex items-center gap-4 text-sm text-white-100">
              <span className="text-gray-400">👁 {blog.views} views</span>
              <Button
                type="text"
                size="small"
                onClick={handleLike}
                className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
              >
                {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
              </Button>
              {/* Edit & Delete chỉ hiện cho author hoặc admin */}
              {canManage && (
                <>
                  <Button
                    type="default"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/blogs/edit/${blog.slug}`)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete This Blog?"
                    description="This action cannot be undone."
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true, loading: deleting }}
                    onConfirm={handleDelete}
                  >
                    <Button danger type="default" size="small" icon={<DeleteOutlined />} loading={deleting}>
                      Delete
                    </Button>
                  </Popconfirm>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag) => (
                <Tag key={tag} className="bg-transparent border-gray-700 text-gray-300">
                  #{tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Content — Markdown blogs render via MarkdownContent; HTML blogs keep the
              sanitized CKEditor path (with legacy entity recovery). */}
          {blog.contentFormat === 'markdown' ? (
            <MarkdownContent content={blog.content} />
          ) : (
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-img:rounded-md pb-10"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recoverEscapedHtml(blog.content)) }}
            />
          )}
        </div>
      </div>

      {/* Lightbox cho cover: chỉ mượn lớp preview của antd (zoom/xoay/phóng to),
          phần banner vẫn do next/image render để giữ tối ưu ảnh + priority */}
      <AntImage
        src={coverImage}
        alt={blog.title}
        style={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          src: coverImage,
          onVisibleChange: (value) => setPreviewOpen(value),
        }}
      />

      <ScrollToTopButton />
    </div>
  )
}

export default BlogDetailView
