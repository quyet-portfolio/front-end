'use client'

import { useAuth } from '@/src/contexts/AuthContext'
import { Button, Card, Descriptions, Divider, Progress, Spin, Tag } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { FlashCard } from '../types'
import { flashcardApi } from '@/src/lib/api/notes'
import {
  ArrowLeftOutlined,
  EditOutlined,
  FullscreenOutlined,
  LeftOutlined,
  RedoOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { FlipCard } from '../component/FlipCard'

const NotesDetailView = () => {
  const param = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [flashcard, setFlashcard] = useState<FlashCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

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

  const handleNext = useCallback(() => {
    if (!flashcard) return
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1 < flashcard.tags.length ? prev + 1 : 0))
    }, 150)
  }, [flashcard])

  const handlePrev = useCallback(() => {
    if (!flashcard) return
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : flashcard.tags.length - 1))
    }, 150)
  }, [flashcard])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          handleNext()
          break
        case 'ArrowLeft':
          handlePrev()
          break
        case ' ': // Spacebar
        case 'Enter':
          e.preventDefault()
          setIsFlipped((prev) => !prev)
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  const currentCard = flashcard?.tags?.[currentIndex]
  const progressPercent = flashcard?.tags?.length ? Math.round(((currentIndex + 1) / flashcard.tags.length) * 100) : 0

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
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/notes')} />
        {user?._id === flashcard.createdBy._id && (
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

      <div className="my-6 relative">
        {/* Card Component */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <FlipCard
              term={currentCard?.term || ''}
              definition={currentCard?.definition || ''}
              related={currentCard?.related}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        <Button
          shape="circle"
          size="large"
          icon={<RedoOutlined />}
          onClick={() => {
            setIsFlipped(false)
            setCurrentIndex(0)
          }}
          className="text-gray-500"
        />

        <div className="flex items-center gap-6 px-6 py-2 rounded-full shadow-sm border border-gray-200">
          <Button
            type="text"
            shape="circle"
            size="large"
            icon={<LeftOutlined />}
            onClick={handlePrev}
            disabled={currentIndex === 0}
          />

          <span className="font-bold text-white w-16 text-center">
            {currentIndex + 1} / {flashcard.tags.length}
          </span>

          <Button
            type="text"
            shape="circle"
            size="large"
            icon={<RightOutlined />}
            onClick={handleNext}
            disabled={currentIndex === flashcard.tags.length - 1}
          />
        </div>

        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <Progress percent={progressPercent} showInfo={false} strokeColor="#4f46e5" trailColor="#e5e7eb" size="small" />
        <div className="text-center mt-2 text-gray-500 text-sm">Learn {progressPercent}%</div>
      </div>

      <div className="flex gap-2 items-center mt-6 mb-2">
        <h2 className="text-2xl font-bold">Tags</h2>
        <Tag color="blue">{flashcard.tags.length}</Tag>
      </div>
      <div className="grid gap-4">
        {flashcard.tags.map((tag, index) => (
          <Card key={index} className="shadow-sm">
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
