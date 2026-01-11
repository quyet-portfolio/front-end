"use client"

import { Button, Card, Form, Input, message, Space, Spin } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FlashCard } from './types'
import { flashcardApi } from '@/src/lib/api/notes'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input

const EditNotesView = () => {
  const params = useParams()
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [flashcard, setFlashcard] = useState<FlashCard | null>(null)

  useEffect(() => {
    const fetchFlashCard = async () => {
      try {
        const data = await flashcardApi.getFlashCardById(params.id as string)
        setFlashcard(data.flashcard)
        form.setFieldsValue({
          title: data.flashcard.title,
          description: data.flashcard.description,
          tags: data.flashcard.tags,
        })
      } catch (error) {
        message.error('Failed to fetch flashcard')
      } finally {
        setFetching(false)
      }
    }

    fetchFlashCard()
  }, [params.id, form])

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      await flashcardApi.updateFlashCard(params.id as string, values)
      message.success('FlashCard updated successfully')
      router.push(`/notes/${params.id}`)
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update flashcard')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    )
  }

  if (!flashcard) {
    return <div className="text-center p-8">FlashCard not found</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit FlashCard</h1>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            <p className="text-gray-500 text-sm mb-4">At least one tag is required</p>
          </div>

          <Form.List name="tags">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="mb-4 relative" size="small">
                    {fields.length > 1 && (
                      <Button
                        type="link"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        className="absolute top-2 right-2"
                      >
                        Remove
                      </Button>
                    )}

                    <Form.Item
                      {...restField}
                      label="Term"
                      name={[name, 'term']}
                      rules={[{ required: true, message: 'Please input term!' }]}
                    >
                      <Input placeholder="Enter term" />
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
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                Update FlashCard
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

export default EditNotesView
