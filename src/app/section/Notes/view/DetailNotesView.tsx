'use client'

import { useAuth } from '@/src/contexts/AuthContext'
import { Button, Card, Descriptions, Divider, Modal, Progress, Spin, Tag } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { FlashCard } from '../types'
import { flashcardApi, learnApi } from '@/src/lib/api/notes'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RedoOutlined,
  RightOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { FlipCard } from '../component/FlipCard'
import { useLearnStore } from '../store'
import { useMessageApi } from '@/src/contexts/MessageContext'
import ImportTermsModal from '../component/ImportTermsModal'
import StudyActionsBar from '../component/StudyActionsBar'
import MasteryBar from '../component/MasteryBar'

/** Số term render mỗi lô. Bộ thẻ được phép có tới 1000 term. */
const TERMS_PAGE_SIZE = 50

interface NotesDetailViewProps {
  /** Dữ liệu đã fetch sẵn ở server; thiếu thì client tự gọi API. */
  initialFlashcard?: FlashCard
}

const NotesDetailView = ({ initialFlashcard }: NotesDetailViewProps) => {
  const param = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const messageApi = useMessageApi()

  // Selector thay vì lấy cả store: useLearnStore() không selector khiến trang chi
  // tiết render lại theo mọi thay đổi state của phiên học.
  const reset = useLearnStore((s) => s.reset)

  const [flashcard, setFlashcard] = useState<FlashCard | null>(initialFlashcard ?? null)
  const [isLoading, setIsLoading] = useState(!initialFlashcard)
  const [visibleTerms, setVisibleTerms] = useState(TERMS_PAGE_SIZE)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [masteryVersion, setMasteryVersion] = useState(0)

  const fetchFlashCard = useCallback(async () => {
    try {
      const data = await flashcardApi.getFlashCardById(param.id as string)
      setFlashcard(data.flashcard)
    } catch (error) {
      console.error('Failed to fetch flashcard:', error)
    } finally {
      setIsLoading(false)
    }
  }, [param.id])

  useEffect(() => {
    // Server component đã đưa dữ liệu vào lần render đầu — gọi lại ngay là thừa
    // một round-trip và một lần nháy nội dung.
    if (initialFlashcard) return
    fetchFlashCard()
  }, [initialFlashcard, fetchFlashCard])

  // Nút ‹ › bị disable ở hai đầu danh sách, nên phím mũi tên cũng dừng ở đó thay
  // vì nhảy vòng — cùng một thao tác không được cho hai kết quả khác nhau.
  const handleNext = useCallback(() => {
    if (!flashcard) return
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, flashcard.terms.length - 1))
    }, 150)
  }, [flashcard])

  const handlePrev = useCallback(() => {
    if (!flashcard) return
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    }, 150)
  }, [flashcard])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handler này gắn lên window nên nó nghe cả khi con trỏ đang nằm trong ô
      // nhập liệu của modal Import ngay trên cùng trang: preventDefault() cho phím
      // Space làm người dùng không gõ được khoảng trắng, và thẻ phía sau thì lật
      // loạn theo từng phím mũi tên.
      const target = e.target as HTMLElement | null
      const isInteractive =
        target?.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target?.tagName ?? '') ||
        target?.getAttribute('role') === 'button'

      if (isInteractive) return

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

  /**
   * Xoá tiến độ học của bộ thẻ này.
   *
   * Trước đây chỗ này chỉ gọi `reset()` của store — tức là dọn state trên client
   * rồi báo "reset thành công", trong khi session trên server còn nguyên. Bấm
   * "Learn now" ngay sau đó là thấy lại đúng tiến độ cũ.
   */
  const handleReset = async () => {
    if (isResetting) return

    setIsResetting(true)
    try {
      await learnApi.reset(param.id as string)
      messageApi?.success('Progress reset successfully')
    } catch (error: any) {
      const status = error.response?.status

      if (status === 404) {
        messageApi?.info('There is no learning progress to reset yet')
      } else if (status === 401) {
        messageApi?.warning('Log in to reset your learning progress')
      } else {
        messageApi?.error(error.response?.data?.message || 'Failed to reset progress')
      }
    } finally {
      // Dọn state client dù server trả gì — giữ hai bên khỏi lệch nhau.
      reset()
      setMasteryVersion((v) => v + 1)
      setIsResetting(false)
    }
  }

  /**
   * Xoá hẳn bộ thẻ. API và check ownership ở server đã có sẵn từ đầu, chỉ là chưa
   * bao giờ có nút nào gọi tới — CRUD thiếu mất chữ D.
   */
  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete this note?',
      icon: <ExclamationCircleOutlined />,
      content: `"${flashcard?.title}" and all ${flashcard?.terms.length ?? 0} of its terms will be permanently deleted. This cannot be undone.`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        setIsDeleting(true)
        try {
          await flashcardApi.deleteFlashCard(param.id as string)
          messageApi?.success('Note deleted')
          router.push('/notes')
        } catch (error: any) {
          messageApi?.error(error.response?.data?.message || 'Failed to delete note')
          setIsDeleting(false)
        }
      },
    })
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

  const currentCard = flashcard?.terms?.[currentIndex]
  const progressPercent = flashcard?.terms?.length
    ? Math.round(((currentIndex + 1) / flashcard.terms.length) * 100)
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
              Import Terms
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/notes/edit/${param.id}`)}
            >
              Edit
            </Button>
            <Button danger icon={<DeleteOutlined />} loading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Summary card with progress */}
      <Card className="mb-4">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Created By">{flashcard.createdBy.username}</Descriptions.Item>
          <Descriptions.Item label="Total Terms">
            <Tag color="blue">{flashcard.terms.length}</Tag>
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
            {currentIndex + 1} / {flashcard.terms.length}
          </span>
        </div>
      </Card>

      {/* Độ thuộc tích luỹ, chỉ có ý nghĩa khi đã đăng nhập */}
      <MasteryBar flashcardId={param.id as string} enabled={isAuthenticated} key={masteryVersion} />

      {/* Study Actions: Learn + Reset */}
      <StudyActionsBar
        flashcardId={param.id as string}
        onReset={handleReset}
        isResetting={isResetting}
      />

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
            {currentIndex + 1} / {flashcard.terms.length}
          </span>
          <Button
            type="text"
            shape="circle"
            size="large"
            icon={<RightOutlined />}
            onClick={handleNext}
            disabled={currentIndex === flashcard.terms.length - 1}
          />
        </div>

        <div className="w-10" />
      </div>

      {/* Terms list */}
      <div className="flex gap-2 items-center mt-6 mb-4">
        <h2 className="text-xl font-bold">Terms</h2>
        <Tag color="blue">{flashcard.terms.length}</Tag>
      </div>
      {/*
        Render theo lô: bộ thẻ import từ file có thể tới 1000 term, và dựng ngần ấy
        Card cùng lúc là đủ làm trình duyệt đứng hình vài giây. Chỉ thêm chứ không
        bao giờ bớt, nên không có chuyện nội dung đã đọc biến mất.
      */}
      <div className="grid gap-3">
        {flashcard.terms.slice(0, visibleTerms).map((term, index) => (
          <Card key={index} className="shadow-sm" size="small">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1">{term.term}</h3>
                <p className="text-gray-400 text-sm">{term.definition}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {flashcard.terms.length > visibleTerms && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => setVisibleTerms((n) => n + TERMS_PAGE_SIZE)}>
            Show {Math.min(TERMS_PAGE_SIZE, flashcard.terms.length - visibleTerms)} more
            <span className="text-gray-500 ml-1">
              ({visibleTerms}/{flashcard.terms.length})
            </span>
          </Button>
        </div>
      )}

      <ImportTermsModal
        mode="append"
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchFlashCard}
        flashcardId={param.id as string}
        currentTermCount={flashcard.terms.length}
      />
    </div>
  )
}

export default NotesDetailView
