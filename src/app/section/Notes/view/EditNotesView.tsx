"use client"

import { Button, Card, Form, Input, Spin } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { flashcardApi } from '@/src/lib/api/notes'
import { MinusCircleOutlined, PlusOutlined, UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { FlashCard } from '../types'
import { useMessageApi } from '@/src/contexts/MessageContext'
import ImportTermsModal from '../component/ImportTermsModal'
import { useUnsavedChangesGuard } from '../hook/useUnsavedChangesGuard'

const { TextArea } = Input

/**
 * Số term render mỗi lô trong form.
 *
 * Một bộ thẻ có thể tới 1000 term, mỗi term là 3 Form.Item — dựng 3000 field cùng
 * lúc làm tab đứng hình. Danh sách chỉ nới ra chứ không bao giờ thu lại, nên field
 * đã mount không bị unmount và không có nguy cơ mất dữ liệu đang gõ.
 */
const TERMS_PAGE_SIZE = 50

const EditNotesView = () => {
  const params = useParams()
  const router = useRouter()
  const [form] = Form.useForm()
  const messageApi = useMessageApi()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [flashcard, setFlashcard] = useState<FlashCard | null>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [visibleTerms, setVisibleTerms] = useState(TERMS_PAGE_SIZE)

  const { confirmLeave } = useUnsavedChangesGuard({ isDirty })

  useEffect(() => {
    const fetchFlashCard = async () => {
      try {
        const data = await flashcardApi.getFlashCardById(params.id as string)
        setFlashcard(data.flashcard)
        form.setFieldsValue({
          title: data.flashcard.title,
          description: data.flashcard.description,
          terms: data.flashcard.terms,
        })
      } catch (error) {
        messageApi?.error('Failed to fetch flashcard')
      } finally {
        setFetching(false)
      }
    }

    fetchFlashCard()
    // messageApi từ useMessage() của antd ổn định qua các lần render nên vào deps được.
  }, [params.id, form, messageApi])

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      await flashcardApi.updateFlashCard(params.id as string, values)
      setIsDirty(false)
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
    // Import ghi thẳng vào DB nên form phải nạp lại từ server, không còn "chưa lưu".
    setIsDirty(false)
    const data = await flashcardApi.getFlashCardById(params.id as string)
    setFlashcard(data.flashcard)
    form.setFieldsValue({
      title: data.flashcard.title,
      description: data.flashcard.description,
      terms: data.flashcard.terms,
    })
  }

  return (
    // pb-28 chừa chỗ cho thanh nút fixed ở đáy — nếu không nó che mất term cuối cùng.
    <div className="container mx-auto p-6 pb-28 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <Button
            icon={<ArrowLeftOutlined />}
            aria-label="Go back"
            onClick={() => confirmLeave(() => router.back())}
          />
          <h1 className="text-3xl font-bold">Edit FlashCard</h1>
        </div>
        <Button icon={<UploadOutlined />} onClick={() => setImportModalOpen(true)}>
          Import Terms
        </Button>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={() => setIsDirty(true)}>
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
            <h3 className="text-lg font-semibold mb-2">Terms</h3>
            <p className="text-gray-500 text-sm mb-4">At least one term is required</p>
          </div>

          <Form.List name="terms">
            {(fields, { add, remove }) => (
              <>
                <Form.Item>
                  <Button type="dashed" onClick={() => add(undefined, 0)} block icon={<PlusOutlined />}>
                    Add Term
                  </Button>
                </Form.Item>

                {fields.slice(0, visibleTerms).map(({ key, name, ...restField }) => (
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

                {fields.length > visibleTerms && (
                  <Form.Item>
                    <Button block onClick={() => setVisibleTerms((n) => n + TERMS_PAGE_SIZE)}>
                      Show {Math.min(TERMS_PAGE_SIZE, fields.length - visibleTerms)} more
                      <span className="text-gray-500 ml-1">
                        ({visibleTerms}/{fields.length})
                      </span>
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="max-w-5xl mx-auto flex justify-end gap-4 px-6 py-4">
          <Button onClick={() => confirmLeave(() => router.back())} size="large">
            Cancel
          </Button>
          <Button type="primary" loading={loading} size="large" onClick={() => form.submit()}>
            Save Changes
          </Button>
        </div>
      </div>

      <ImportTermsModal
        mode="append"
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={handleImportSuccess}
        flashcardId={params.id as string}
        currentTermCount={flashcard?.terms.length || 0}
      />
    </div>
  )
}

export default EditNotesView
