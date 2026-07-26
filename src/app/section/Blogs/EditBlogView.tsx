'use client'

import React, { useEffect, useState } from 'react'
import Button from 'antd/es/button'
import Card from 'antd/es/card'
import Collapse from 'antd/es/collapse'
import Form from 'antd/es/form'
import Input from 'antd/es/input'
import TextArea from 'antd/es/input/TextArea'
import Modal from 'antd/es/modal'
import Select from 'antd/es/select'
import Spin from 'antd/es/spin'
import Switch from 'antd/es/switch'
import Tag from 'antd/es/tag'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { blogApi, UpdateBlogData } from '@/src/lib/api/blog'
import { recoverEscapedHtml } from '@/src/utils/htmlContent'
import { Blog, BlogContentFormat } from '@/src/lib/types'
import { SLUG_PATTERN } from '@/src/utils/slug'
import CategorySelect from './components/CategorySelect'

// Số bài tối đa được ghim lên BlogHeading (khớp với backend)
const MAX_FEATURED = 3

// Dynamic import: avoid SSR crash for CKEditor
const DynamicBlogEditor = dynamic(() => import('./components/BlogCKEditor'), {
  ssr: false,
  loading: () => <div className="p-4 text-center border-2 border-dashed">Loading Editor...</div>,
})

// Markdown editor (chỉ tải khi bài dùng định dạng Markdown)
const DynamicMarkdownEditor = dynamic(() => import('./components/MarkdownEditor'), {
  ssr: false,
  loading: () => <div className="p-4 text-center border-2 border-dashed">Loading Editor...</div>,
})

const EditBlogView = () => {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [form] = Form.useForm()
  const messageApi = useMessageApi()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [blog, setBlog] = useState<Blog | null>(null)
  // Track editor content separately since it's not a native form element
  const [content, setContent] = useState<string>('')
  // Định dạng nội dung của bài — khóa theo bài, không đổi khi sửa
  const [contentFormat, setContentFormat] = useState<BlogContentFormat>('html')
  // Số bài featured KHÁC bài đang sửa — để cảnh báo khi đã đủ MAX_FEATURED
  const [otherFeaturedCount, setOtherFeaturedCount] = useState(0)

  // Fetch blog by id (via slug stored in URL), then pre-fill the form
  useEffect(() => {
    if (!slug) return

    const fetchBlog = async () => {
      try {
        setFetching(true)
        const res = await blogApi.getBlogBySlug(slug)
        const fetchedBlog = res.blog
        setBlog(fetchedBlog)
        const format: BlogContentFormat = fetchedBlog.contentFormat === 'markdown' ? 'markdown' : 'html'
        setContentFormat(format)
        // Markdown content is stored raw; only legacy HTML needs entity recovery
        // (re-saving then persists the corrected markup).
        setContent(format === 'markdown' ? fetchedBlog.content : recoverEscapedHtml(fetchedBlog.content))
        form.setFieldsValue({
          title: fetchedBlog.title,
          slug: fetchedBlog.slug,
          category: fetchedBlog.category,
          excerpt: fetchedBlog.excerpt,
          tags: fetchedBlog.tags,
          featuredImage: fetchedBlog.featuredImage,
          isPublished: fetchedBlog.isPublished,
          isFeatured: fetchedBlog.isFeatured ?? false,
        })

        // Đếm số bài featured khác bài đang sửa để biết khi nào slot đã đầy
        const featured = await blogApi.getFeaturedBlogs()
        setOtherFeaturedCount(featured.blogs.filter((b) => b._id !== fetchedBlog._id).length)
      } catch (err: any) {
        if (messageApi) messageApi.error('Blog not found')
        router.push('/blogs')
      } finally {
        setFetching(false)
      }
    }

    fetchBlog()
  }, [slug])

  // Khi bật ghim lúc đã đủ 3 bài khác: cảnh báo sẽ thay thế bài cũ nhất
  const handleFeaturedChange = (checked: boolean) => {
    if (!checked || otherFeaturedCount < MAX_FEATURED) return

    Modal.confirm({
      title: 'The Blog Page Already Has 3 Featured Posts',
      content:
        'Featuring this post on the homepage will replace the oldest of the 3 currently featured posts. Do you want to continue?',
      okText: 'Continue',
      cancelText: 'Cancel',
      onCancel: () => form.setFieldValue('isFeatured', false),
    })
  }

  const onFinish = async (values: UpdateBlogData) => {
    if (!blog) return
    try {
      setLoading(true)
      const res = await blogApi.updateBlog(blog._id, { ...values, content, contentFormat })
      if (messageApi) messageApi.success('Blog updated successfully!')
      // Dùng slug trả về từ server — slug có thể vừa bị đổi trong lần lưu này
      router.push(`/blogs/${res.blog.slug}`)
    } catch (error: any) {
      if (messageApi) {
        messageApi.error(error.response?.data?.message || 'Failed to update blog')
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spin size="large" tip="Loading blog..." />
      </div>
    )
  }

  return (
    <div className="py-6 px-0 lg:px-6 mx-auto max-w-5xl container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} />
          <h1 className="text-2xl font-bold">Edit Blog</h1>
        </div>
      </div>

      <Card className="mb-24">
        <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please input title!' },
              { min: 5, message: 'Title must be at least 5 characters' },
              { max: 200, message: 'Title must not exceed 200 characters' },
            ]}
          >
            <Input placeholder="Enter blog title" size="large" showCount maxLength={191} />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            extra="Used in the post URL. Changing it breaks existing links to this post."
            rules={[
              { required: true, message: 'Please input slug!' },
              { min: 3, message: 'Slug must be at least 3 characters' },
              { max: 200, message: 'Slug must not exceed 200 characters' },
              {
                pattern: SLUG_PATTERN,
                message: 'Slug may only contain lowercase letters, numbers and hyphens',
              },
            ]}
          >
            <Input placeholder="my-first-post" size="large" maxLength={200} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <CategorySelect />
          </Form.Item>

          <Form.Item
            label="Excerpt"
            name="excerpt"
            rules={[{ max: 500, message: 'Excerpt must not exceed 500 characters' }]}
          >
            <TextArea placeholder="Enter a short excerpt (Optional)" rows={3} showCount maxLength={500} />
          </Form.Item>

          <Form.Item label="Tags" name="tags">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Type a tag and press enter"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item label="Featured Image URL" name="featuredImage">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <div className="flex flex-col gap-4">
            <Form.Item label="Published" name="isPublished" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="Draft" />
            </Form.Item>

            <Form.Item label="Feature on page" name="isFeatured" valuePropName="checked">
              <Switch checkedChildren="On" unCheckedChildren="Off" onChange={handleFeaturedChange} />
            </Form.Item>
          </div>

          <Form.Item
            label={
              <span className="flex gap-2 items-center">
                Content
                <Tag color={contentFormat === 'markdown' ? 'purple' : 'blue'}>
                  {contentFormat === 'markdown' ? 'Markdown' : 'Rich text'}
                </Tag>
              </span>
            }
            required
          >
            {contentFormat === 'markdown' ? (
              <DynamicMarkdownEditor value={content} onChange={(val) => setContent(val)} />
            ) : (
              <DynamicBlogEditor value={content} onChange={(val) => setContent(val)} />
            )}
          </Form.Item>
        </Form>
      </Card>

      <div className="max-w-5xl mx-auto rounded-xl fixed bottom-2 left-0 right-0 z-50 border-t border-border bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="flex justify-end gap-4 px-6 py-4">
          <Button onClick={() => router.back()} size="large">
            Cancel
          </Button>
          <Button type="primary" loading={loading} size="large" onClick={() => form.submit()}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditBlogView
