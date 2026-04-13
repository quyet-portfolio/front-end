"use client"

import { Button, Card, Form, Input, message, Space, Spin } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { flashcardApi } from '@/src/lib/api/notes'
import { MinusCircleOutlined, PlusOutlined, UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { FlashCard } from '../types'
import { useMessageApi } from '@/src/contexts/MessageContext'
import ImportTagsModal from '../component/ImportTagsModal'

const { TextArea } = Input

const EditNotesView = () => {
  const params = useParams()
  const router = useRouter()
  const [form] = Form.useForm()
  const messageApi = useMessageApi()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [flashcard, setFlashcard] = useState<FlashCard | null>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)

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
        messageApi?.error('Failed to fetch flashcard')
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
      messageApi?.success('FlashCard updated successfully')
      router.push(`/notes/${params.id}`)
    } catch (error: any) {
      messageApi?.error(error.response?.data?.message || 'Failed to update flashcard')
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

  const handleImportSuccess = async () => {
    // Refresh flashcard data
    const data = await flashcardApi.getFlashCardById(params.id as string)
    setFlashcard(data.flashcard)
    form.setFieldsValue({
      title: data.flashcard.title,
      description: data.flashcard.description,
      tags: data.flashcard.tags,
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} />
          <h1 className="text-3xl font-bold">Edit FlashCard</h1>
        </div>
        <Button icon={<UploadOutlined />} onClick={() => setImportModalOpen(true)}>
          Import Tags
        </Button>
      </div>

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
                <Form.Item>
                  <Button type="dashed" onClick={() => add(undefined, 0)} block icon={<PlusOutlined />}>
                    Add Tag
                  </Button>
                </Form.Item>

                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ position: 'relative' }} className="mb-4">
                    {fields.length > 1 && (
                      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                        <Button
                          type="link"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    <Card size="small">
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
                  </div>
                ))}


              </>
            )}
          </Form.List>
        </Form>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="max-w-5xl mx-auto flex justify-end gap-4 px-6 py-4">
          <Button onClick={() => router.back()} size="large">
            Cancel
          </Button>
          <Button type="primary" loading={loading} size="large" onClick={() => form.submit()}>
            Save Changes
          </Button>
        </div>
      </div>

      <ImportTagsModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={handleImportSuccess}
        flashcardId={params.id as string}
        currentTagCount={flashcard?.tags.length || 0}
      />
    </div>
  )
}

export default EditNotesView
