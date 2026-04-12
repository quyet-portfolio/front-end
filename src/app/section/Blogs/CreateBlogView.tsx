'use client'

import React, { useState } from 'react'
import Button from 'antd/es/button'
import Card from 'antd/es/card'
import Collapse from 'antd/es/collapse'
import Form from 'antd/es/form'
import Input from 'antd/es/input'
import Select from 'antd/es/select'
import Switch from 'antd/es/switch'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { blogApi, CreateBlogData } from '@/src/lib/api/blog'

import TextArea from 'antd/es/input/TextArea'

// Dynamic import with SSR false for CKEditor to avoid Next.js document/window errors
const DynamicBlogEditor = dynamic(() => import('./components/BlogCKEditor'), {
  ssr: false,
  loading: () => <div className="p-4 text-center border-2 border-dashed">Loading Editor...</div>,
})

const CreateBlogView = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const messageApi = useMessageApi()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: CreateBlogData) => {
    try {
      setLoading(true)
      await blogApi.createBlog(values)
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
            <Input placeholder="Enter blog title" size="large" showCount maxLength={191} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please input a category!' }]}
          >
            <Input placeholder="Enter category (e.g., Programming, Tech)" />
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
            name="content"
            rules={[
              { required: true, message: 'Please input content!' },
              { min: 10, message: 'Content must be at least 10 characters long' },
            ]}
          >
            <Collapse
              defaultActiveKey={['content']}
              items={[{
                key: 'content',
                label: 'Content',
                children: <DynamicBlogEditor />,
              }]}
            />
          </Form.Item>

          <Form.Item
            label="Published"
            name="isPublished"
            valuePropName="checked"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="Draft" />
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
