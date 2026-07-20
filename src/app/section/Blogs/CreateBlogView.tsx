'use client'

import React, { useEffect, useState } from 'react'
import Button from 'antd/es/button'
import Card from 'antd/es/card'
import Collapse from 'antd/es/collapse'
import Form from 'antd/es/form'
import Input from 'antd/es/input'
import Modal from 'antd/es/modal'
import Segmented from 'antd/es/segmented'
import Select from 'antd/es/select'
import Switch from 'antd/es/switch'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { blogApi, CreateBlogData } from '@/src/lib/api/blog'
import { BlogContentFormat } from '@/src/lib/types'
import { SLUG_PATTERN, slugify } from '@/src/utils/slug'
import CategorySelect from './components/CategorySelect'

import TextArea from 'antd/es/input/TextArea'

// Số bài tối đa được ghim lên BlogHeading (khớp với backend)
const MAX_FEATURED = 3

// Dynamic import with SSR false for CKEditor to avoid Next.js document/window errors
const DynamicBlogEditor = dynamic(() => import('./components/BlogCKEditor'), {
  ssr: false,
  loading: () => <div className="p-4 text-center border-2 border-dashed">Loading Editor...</div>,
})

// Markdown editor (chỉ tải khi người dùng chọn định dạng Markdown)
const DynamicMarkdownEditor = dynamic(() => import('./components/MarkdownEditor'), {
  ssr: false,
  loading: () => <div className="p-4 text-center border-2 border-dashed">Loading Editor...</div>,
})

const CreateBlogView = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const messageApi = useMessageApi()
  const [loading, setLoading] = useState(false)
  // Số bài đang được ghim — để cảnh báo khi đã đủ MAX_FEATURED
  const [featuredCount, setFeaturedCount] = useState(0)
  // Định dạng nội dung — chọn lúc tạo bài; đổi format sẽ xoá nội dung để tránh trộn lẫn
  const [contentFormat, setContentFormat] = useState<BlogContentFormat>('html')
  // Slug tự sinh theo title cho tới khi người dùng tự chỉnh
  const [isSlugEdited, setIsSlugEdited] = useState(false)

  // Keep the slug in sync with the title until the user edits it manually
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSlugEdited) return
    form.setFieldValue('slug', slugify(e.target.value))
  }

  const handleFormatChange = (val: BlogContentFormat) => {
    if (val === contentFormat) return
    setContentFormat(val)
    form.setFieldValue('content', '')
  }

  useEffect(() => {
    blogApi
      .getFeaturedBlogs()
      .then((data) => setFeaturedCount(data.blogs.length))
      .catch(() => setFeaturedCount(0))
  }, [])

  // Khi bật ghim lúc đã đủ 3 bài: cảnh báo sẽ thay thế bài cũ nhất
  const handleFeaturedChange = (checked: boolean) => {
    if (!checked || featuredCount < MAX_FEATURED) return

    Modal.confirm({
      title: 'The Blog Page Already Has 3 Featured Posts',
      content:
        'Featuring this post on the homepage will replace the oldest of the 3 currently featured posts. Do you want to continue?',
      okText: 'Continue',
      cancelText: 'Cancel',
      onCancel: () => form.setFieldValue('isFeatured', false),
    })
  }

  const onFinish = async (values: CreateBlogData) => {
    try {
      setLoading(true)
      await blogApi.createBlog({ ...values, contentFormat })
      if (messageApi) {
        messageApi.success('Blog created successfully!')
      }
      router.push('/blogs')
    } catch (error: any) {
      if (messageApi) {
        messageApi.error(error.response?.data?.message || 'Failed to create blog')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 mx-auto max-w-5xl container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/blogs')} />
          <h1 className="text-2xl font-bold">Create a New Blog</h1>
        </div>
      </div>

      <Card className="mb-24">
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          initialValues={{
            isPublished: true,
            isFeatured: false,
            tags: [],
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please input title!' },
              { min: 5, message: 'Title must be at least 5 characters' },
              { max: 200, message: 'Title must not exceed 200 characters' },
            ]}
          >
            <Input
              placeholder="Enter blog title"
              size="large"
              showCount
              maxLength={191}
              onChange={handleTitleChange}
            />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            extra="Used in the post URL, e.g. /blogs/my-first-post"
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
            <Input
              placeholder="my-first-post"
              size="large"
              maxLength={200}
              onChange={() => setIsSlugEdited(true)}
            />
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
            <TextArea placeholder="Enter a short excerpt (Optional - will be auto-generated if empty)" rows={3} showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Type a tag and press enter"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            label="Featured Image URL"
            name="featuredImage"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            label="Content format"
            extra="Rich text (CKEditor) for regular posts; Markdown for coding posts (code blocks render properly with syntax highlighting)."
          >
            <Segmented
              value={contentFormat}
              onChange={(val) => handleFormatChange(val as BlogContentFormat)}
              options={[
                { label: 'Rich text', value: 'html' },
                { label: 'Markdown', value: 'markdown' },
              ]}
            />
          </Form.Item>

          <Collapse
            defaultActiveKey={['content']}
            items={[{
              key: 'content',
              label: 'Content',
              children: (
                <Form.Item
                  name="content"
                  rules={[
                    { required: true, message: 'Please input content!' },
                    { min: 10, message: 'Content must be at least 10 characters long' },
                  ]}
                >
                  {contentFormat === 'markdown' ? <DynamicMarkdownEditor /> : <DynamicBlogEditor />}
                </Form.Item>
              ),
            }]}
          />

          <Form.Item
            label="Published"
            name="isPublished"
            valuePropName="checked"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="Draft" />
          </Form.Item>

          <Form.Item
            label="Feature on homepage"
            name="isFeatured"
            valuePropName="checked"
            extra="Turn on to show this post in the carousel at the top of the blog page (up to 3 posts)."
          >
            <Switch checkedChildren="On" unCheckedChildren="Off" onChange={handleFeaturedChange} />
          </Form.Item>
        </Form>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="mx-auto flex max-w-5xl justify-end gap-4 px-6 py-4">
        <Button onClick={() => router.back()} size="large">
          Cancel
        </Button>
        <Button type="primary" loading={loading} size="large" onClick={() => form.submit()}>
          Publish Blog
        </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateBlogView
