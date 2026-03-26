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
  LeftOutlined,
  RedoOutlined,
  RightOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { FlipCard } from '../component/FlipCard'
import { useLearnStore } from '../store'
import { useMessageApi } from '@/src/contexts/MessageContext'
import ImportTagsModal from '../component/ImportTagsModal'
import StudyActionsBar from '../component/StudyActionsBar'

const NotesDetailView = () => {
  const param = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const messageApi = useMessageApi()

  const { reset } = useLearnStore()

  const [flashcard, setFlashcard] = useState<FlashCard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  useEffect(() => {
    const fetchFlashCard = async () => {
      try {
        const data = await flashcardApi.getFlashCardById(param.id as string)
        setFlashcard(data.flashcard)
      } catch (error) {
        console.error('Failed to fetch flashcard:', error)
      } finally {
        setIsLoading(false)
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
        case ' ':
        case 'Enter':
          e.preventDefault()
          setIsFlipped((prev) => !prev)
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  const handleReset = () => {
    reset()
    messageApi?.success('Progress reset successfully')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    )
  }

  if (!flashcard) {
    return <div className="text-center p-8">FlashCard not found</div>
  }

  const currentCard = flashcard?.tags?.[currentIndex]
  const progressPercent = flashcard?.tags?.length
    ? Math.round(((currentIndex + 1) / flashcard.tags.length) * 100)
    : 0

  const isOwner = user?._id === flashcard.createdBy._id

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/notes')} />
          <div className="flex flex-col justify-between">
            <h1 className="text-2xl font-bold">{flashcard.title}</h1>
            {flashcard.description && (
              <p className="text-gray-500 text-sm">{flashcard.description}</p>
            )}
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <Button icon={<UploadOutlined />} onClick={() => setIsImportModalOpen(true)}>
              Import Tags
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/notes/edit/${param.id}`)}
            >
              Edit
            </Button>
          </div>
        )}
      </div>

      {/* Summary card with progress */}
      <Card className="mb-4">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Created By">{flashcard.createdBy.username}</Descriptions.Item>
          <Descriptions.Item label="Total Terms">
            <Tag color="blue">{flashcard.tags.length}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(flashcard.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(flashcard.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        {/* Progress bar inside metadata card */}
        <Divider className="my-3" />
        <div className="flex items-center gap-3">
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor="#6366F1"
            trailColor="#1e2a4a"
            size="small"
            className="flex-1"
          />
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {currentIndex + 1} / {flashcard.tags.length}
          </span>
        </div>
      </Card>

      {/* Study Actions: Learn + Reset */}
      <StudyActionsBar flashcardId={param.id as string} onReset={handleReset} />

      {/* Flip Card */}
      <div className="my-6 relative">
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

      {/* Navigation controls */}
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

        <div className="flex items-center gap-6 px-6 py-2 rounded-full shadow-sm border border-white/10">
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

      {/* Tags list */}
      <div className="flex gap-2 items-center mt-6 mb-4">
        <h2 className="text-xl font-bold">Terms</h2>
        <Tag color="blue">{flashcard.tags.length}</Tag>
      </div>
      <div className="grid gap-3">
        {flashcard.tags.map((tag, index) => (
          <Card key={index} className="shadow-sm" size="small">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1">{tag.term}</h3>
                <p className="text-gray-400 text-sm">{tag.definition}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ImportTagsModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          window.location.reload()
        }}
        flashcardId={param.id as string}
        currentTagCount={flashcard.tags.length}
      />
    </div>
  )
}

export default NotesDetailView
