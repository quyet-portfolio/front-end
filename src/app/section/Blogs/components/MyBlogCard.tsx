'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button from 'antd/es/button'
import Popconfirm from 'antd/es/popconfirm'
import Tag from 'antd/es/tag'
import { DeleteOutlined, EditOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons'
import { Blog } from '@/src/lib/types'
import { stripHtml } from '@/src/utils/stringUtils'
import { recoverEscapedHtml } from '@/src/utils/htmlContent'
import { FALLBACK_IMAGE_BLOG } from '../BlogsHeading'

interface MyBlogCardProps {
  blog: Blog
  deleting: boolean
  onDelete: (blog: Blog) => void
}

const MyBlogCard = ({ blog, deleting, onDelete }: MyBlogCardProps) => {
  return (
    <div
      className="group relative flex flex-col w-full rounded-xl overflow-hidden
        bg-gradient-to-br from-[#0d1433] to-[#0a0f24]
        border border-white/5 hover:border-indigo-500/60
        shadow-sm hover:shadow-indigo-900/30 hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/blogs/${blog.slug}`} className="relative w-full h-44 flex-shrink-0">
        <Image
          fill
          className="object-cover"
          src={blog.featuredImage || FALLBACK_IMAGE_BLOG}
          alt={blog.title}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Tag color={blog.isPublished ? 'green' : 'orange'} bordered={false}>
            {blog.isPublished ? 'Published' : 'Draft'}
          </Tag>
          {blog.isFeatured && (
            <Tag color="purple" bordered={false}>
              Featured
            </Tag>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 px-5 py-4 gap-2">
        <div className="flex items-center gap-2">
          {blog.category && <span className="text-[10px] font-bold uppercase text-indigo-400">{blog.category}</span>}
          <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        <Link href={`/blogs/${blog.slug}`}>
          <h3 className="font-bold text-base text-white leading-snug line-clamp-2 hover:text-indigo-400 transition-colors">
            {blog.title}
          </h3>
        </Link>

        <p className="text-white-200 text-sm leading-relaxed line-clamp-2 flex-1">
          {stripHtml(recoverEscapedHtml(blog.excerpt || blog.content))}
        </p>

        <div className="flex justify-between items-center pt-3 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <EyeOutlined /> {blog.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <LikeOutlined /> {blog.likes?.length || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/blogs/edit/${blog.slug}`}>
              <Button size="small" icon={<EditOutlined />}>
                Edit
              </Button>
            </Link>
            <Popconfirm
              title="Delete this blog"
              description="This action cannot be undone."
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(blog)}
            >
              <Button size="small" danger loading={deleting} icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyBlogCard
