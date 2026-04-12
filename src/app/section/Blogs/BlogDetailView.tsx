'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { HeartOutlined, HeartFilled, HomeOutlined, EditOutlined } from '@ant-design/icons'
import Button from 'antd/es/button'
import Tag from 'antd/es/tag'
import Spin from 'antd/es/spin'
import Breadcrumb from 'antd/es/breadcrumb'
import DOMPurify from 'isomorphic-dompurify'
import { blogApi } from '@/src/lib/api/blog'
import { Blog } from '@/src/lib/types'
import { useAuth } from '@/src/contexts/AuthContext'
import { useMessageApi } from '@/src/contexts/MessageContext'

const BlogDetailView = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [likesCount, setLikesCount] = useState<number>(0)
  const [isLiked, setIsLiked] = useState<boolean>(false)

  const { isAuthenticated, user } = useAuth()
  const messageApi = useMessageApi()

  useEffect(() => {
    if (!slug) return

    const fetchBlog = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await blogApi.getBlogBySlug(slug)
        setBlog(response.blog)
        setLikesCount(response.blog.likes.length)
        if (user) {
          setIsLiked(response.blog.likes.some((l: any) => l._id === user._id || l === user._id))
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Blog not found')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [slug, user])

  const handleLike = async () => {
    if (!isAuthenticated) {
      if (messageApi) messageApi.info('Please login to like this blog')
      return router.push('/login')
    }

    if (!blog) return

    try {
      const res = await blogApi.likeBlog(blog._id)
      setLikesCount(res.likesCount)
      setIsLiked(res.isLiked)
    } catch (err: any) {
      if (messageApi) {
        messageApi.error(err.response?.data?.message || 'Action failed')
      }
    }
  }

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
    <div className="container mx-auto px-4 max-w-4xl mb-16 mt-6 text-white">

      {/* Breadcrumb */}
      <Breadcrumb
        className="!mb-10 text-white-100 w-full"
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
            title: <span className="text-gray-500 max-w-full truncate inline-block align-bottom text-[16px] font-medium">{blog.title}</span>,
          },
        ]}
      />

      {/* Card wrapper */}
      <div className="rounded-lg border border-blue-950 bg-black-100 shadow-xl overflow-hidden">
        {/* Featured Image Banner */}
        <div className="relative w-full h-[380px]">
          <Image
            src={blog.featuredImage || '/images/next-js-a-react-js-framework.jpg'}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000319] via-[#000319]/40 to-transparent" />
          <div className="absolute bottom-6 left-6 z-10 pr-8">
            {blog.category && (
              <Tag className="!mb-3 !px-3 !py-1 text-sm font-bold !bg-primary-100">
                {blog.category.toUpperCase()}
              </Tag>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-md">{blog.title}</h1>
          </div>
        </div>

        <div className="px-6 md:px-10 py-6">
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
              {/* Show Edit button only for author or admin */}
              {user && (user._id === blog.author._id || user.role === 'admin') && (
                <Button
                  type="default"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/blogs/edit/${blog.slug}`)}
                >
                  Edit
                </Button>
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

          {/* Content — prose renders CKEditor HTML beautifully */}
          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-img:rounded-md pb-10"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
          />
        </div>
      </div>
    </div>
  )
}

export default BlogDetailView
