'use client'

import { flashcardApi } from '@/src/lib/api/notes'
import { ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message, Space } from 'antd'
import { div } from 'framer-motion/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const { TextArea } = Input

const CreateNoteView = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      await flashcardApi.createFlashCard(values)
      message.success('FlashCard created successfully')
      router.push('/notes')
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to create flashcard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className='flex gap-4 items-center mb-6'>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/notes')} />
        <h1 className="text-2xl font-bold">Create a new note</h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          initialValues={{
            tags: [{ term: '', definition: '', related: '' }],
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please input title!' },
              { min: 3, message: 'Title must be at least 3 characters' },
              { max: 200, message: 'Title must not exceed 200 characters' },
            ]}
          >
            <Input placeholder="Enter flashcard title" size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ max: 1000, message: 'Description must not exceed 1000 characters' }]}
          >
            <TextArea placeholder="Enter description (optional)" rows={3} />
          </Form.Item>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <p className="text-gray-500 text-sm mb-4">Add at least one tag (term and definition)</p>
          </div>

          <Form.List name="tags">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-4">
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="mb-4 relative" size="small">
                    {fields.length > 1 && (
                      <div className="flex justify-end">
                        <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
                          Remove
                        </Button>
                      </div>
                    )}

                    <Form.Item
                      {...restField}
                      label="Term"
                      name={[name, 'term']}
                      rules={[{ required: true, message: 'Please input term!' }]}
                    >
                      <Input placeholder="Enter term (e.g., 'React')" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Definition"
                      name={[name, 'definition']}
                      rules={[{ required: true, message: 'Please input definition!' }]}
                    >
                      <TextArea placeholder="Enter definition" rows={3} />
                    </Form.Item>

                    <Form.Item {...restField} label="Related (Optional)" name={[name, 'related']}>
                      <Input placeholder="Enter related information" />
                    </Form.Item>
                  </Card>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Tag
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                Create FlashCard
              </Button>
              <Button onClick={() => router.back()} size="large">
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default CreateNoteView
