'use client'

import { useMessageApi } from '@/src/contexts/MessageContext'
import { flashcardApi } from '@/src/lib/api/notes'
import { ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message, Space } from 'antd'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ImportFlashcardsModal from '../component/ImportFlashcardsModal'

const { TextArea } = Input

const CreateNoteView = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const messageApi = useMessageApi()

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      await flashcardApi.createFlashCard(values)
      messageApi?.success('FlashCard created successfully')
      router.push('/notes')
    } catch (error: any) {
      messageApi?.error(error.response?.data?.message || 'Failed to create flashcard')
    } finally {
      setLoading(false)
    }
  }

  const handleImportSuccess = () => {
    router.push('/notes')
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className='flex gap-4 items-center mb-6 justify-between'>
        <div className='flex gap-4 items-center'>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/notes')} />
          <h1 className="text-2xl font-bold">Create a new note</h1>
        </div>
        <Button
          icon={<UploadOutlined />}
          onClick={() => setImportModalOpen(true)}
          type="default"
        >
          Import from file
        </Button>
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
                <Form.Item>
                  <Button type="dashed" onClick={() => add(undefined, 0)} block icon={<PlusOutlined />}>
                    Add Tag
                  </Button>
                </Form.Item>

                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ position: 'relative' }} className="mb-4">
                    {fields.length > 1 && (
                      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                        <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
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
                  </div>
                ))}
              </div>
            )}
          </Form.List>

          {/* <Form.Item className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
            <Space className="mx-auto flex max-w-4xl justify-end gap-4 px-6 py-4">
              <Button onClick={() => router.back()} size="large">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                Create FlashCard
              </Button>
            </Space>
          </Form.Item> */}
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

      <ImportFlashcardsModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  )
}

export default CreateNoteView
