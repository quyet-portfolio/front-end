'use client'

import { useAuth } from '@/src/contexts/AuthContext'
import { Button, Card, Descriptions, Divider, Spin, Tag } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FlashCard } from './types'
import { flashcardApi } from '@/src/lib/api/notes'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'

const NotesDetailView = () => {
  const param = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [flashcard, setFlashcard] = useState<FlashCard | null>(null)
  const [loading, setLoading] = useState(true)

  console.log('params.id :: ', param.id)

  useEffect(() => {
    const fetchFlashCard = async () => {
      try {
        const data = await flashcardApi.getFlashCardById(param.id as string)
        setFlashcard(data.flashcard)
      } catch (error) {
        console.error('Failed to fetch flashcard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlashCard()
  }, [param.id])

  if (loading) {
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
      <div className="mb-6 flex justify-between items-center">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>
        {user?.id === flashcard.createdBy._id && (
          <Button type="primary" icon={<EditOutlined />} onClick={() => router.push(`/notes/edit/${param.id}`)}>
            Edit FlashCard
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{flashcard.title}</h1>

        {flashcard.description && <p className="text-gray-600 mb-4">{flashcard.description}</p>}

        <Divider />

        <Descriptions column={2}>
          <Descriptions.Item label="Created By">{flashcard.createdBy.username}</Descriptions.Item>
          <Descriptions.Item label="Total Tags">
            <Tag color="blue">{flashcard.tags.length}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(flashcard.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Updated At">{new Date(flashcard.updatedAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      </Card>

      <h2 className="text-2xl font-bold mt-6 mb-2">Tags</h2>
      <div className="grid gap-4">
        {flashcard.tags.map((tag, index) => (
          <Card key={index} className="shadow-sm !p-2">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{tag.term}</h3>
                <p className="text-gray-700 mb-2">{tag.definition}</p>
                {tag.related && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">Related: </span>
                    <span className="text-sm">{tag.related}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default NotesDetailView
