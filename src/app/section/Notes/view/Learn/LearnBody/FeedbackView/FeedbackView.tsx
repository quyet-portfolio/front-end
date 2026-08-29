'use client'

import { useEffect, useState } from 'react'
import { AnswerResult } from '../../../../types'
import { Button, Progress } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  ArrowRightOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'

interface FeedbackViewProps {
  result: AnswerResult | null
  onNext: () => Promise<void>
}

const CORRECT_INITIAL = { opacity: 0, y: 24 }
const CORRECT_ANIMATE = { opacity: 1, y: 0 }
const CORRECT_TRANSITION = { duration: 0.3, type: 'spring' as const, stiffness: 200 }

const WRONG_INITIAL = { opacity: 0, x: 0 }
const WRONG_ANIMATE = { opacity: 1, x: [0, -4, 4, -2, 2, 0] }
const WRONG_TRANSITION = { duration: 0.3, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }

const FeedbackView = ({ result, onNext }: FeedbackViewProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(2)

  const isCorrect = result?.correct
  const isSkipped = result?.skipped
  const progress = result?.progress

  // Auto countdown for correct answer
  useEffect(() => {
    if (!isCorrect || result?.completed) return

    setCountdown(2)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isCorrect, result?.completed])

  const handleNext = async () => {
    setIsLoading(true)
    try {
      await onNext()
    } finally {
      setIsLoading(false)
    }
  }

  if (!result) return null

  // Ba trạng thái chứ không phải hai: bỏ qua là một lựa chọn hợp lệ, không phải
  // lỗi — nên không tô đỏ và không rung màn hình như khi trả lời sai.
  const tone = isCorrect ? 'correct' : isSkipped ? 'skipped' : 'wrong'

  const TONE = {
    correct: {
      bg: 'rgba(16,185,129,0.08)',
      border: 'rgba(16,185,129,0.4)',
      text: 'text-green-400',
      heading: 'Correct! 🎉',
      gradient: 'linear-gradient(135deg,#10b981,#6366F1)',
    },
    skipped: {
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.4)',
      text: 'text-amber-400',
      heading: 'Skipped',
      gradient: 'linear-gradient(135deg,#f59e0b,#6366F1)',
    },
    wrong: {
      bg: 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.4)',
      text: 'text-red-400',
      heading: 'Incorrect 😕',
      gradient: 'linear-gradient(135deg,#ef4444,#f97316)',
    },
  }[tone]

  // Trả lời sai thì con trỏ đứng yên, câu tiếp theo vẫn là term này -> "Try again".
  // Bỏ qua thì server đã đẩy con trỏ đi -> câu khác -> "Continue".
  const nextLabel = isCorrect
    ? `Continue${countdown > 0 ? ` (${countdown})` : ''}`
    : isSkipped
      ? 'Continue'
      : 'Try again'

  return (
    <motion.div
      initial={tone === 'wrong' ? WRONG_INITIAL : CORRECT_INITIAL}
      animate={tone === 'wrong' ? WRONG_ANIMATE : CORRECT_ANIMATE}
      transition={tone === 'wrong' ? WRONG_TRANSITION : CORRECT_TRANSITION}
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: TONE.bg, border: `1.5px solid ${TONE.border}` }}
    >
      <div className="flex flex-col gap-5 items-center">
        {/* Result icon */}
        <div className="text-6xl">
          {isCorrect ? (
            <CheckCircleOutlined className={TONE.text} />
          ) : isSkipped ? (
            <MinusCircleOutlined className={TONE.text} />
          ) : (
            <CloseCircleOutlined className={TONE.text} />
          )}
        </div>

        {/* Result message */}
        <div className="text-center">
          <h3 className={`text-2xl font-bold ${TONE.text}`}>{TONE.heading}</h3>
        </div>

        {/*
          Đáp án đúng — thứ quan trọng nhất của cả màn hình này.
          Server vẫn luôn trả `correctAnswer` nhưng trước đây không chỗ nào hiển thị,
          nên trả lời sai xong người học không biết đúng là gì để mà học.
        */}
        {!isCorrect && result.correctAnswer && (
          <div className="w-full max-w-md rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <BulbOutlined />
              Correct answer
            </div>
            <p className="mt-2 text-lg font-medium text-white break-words">{result.correctAnswer}</p>
          </div>
        )}

        {/* Progress */}
        {progress && (
          <div className="w-full max-w-md">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>
                {progress.completedTerms}/{progress.totalTerms} terms
              </span>
            </div>
            <Progress
              percent={progress.percentage}
              size="small"
              strokeColor={isCorrect ? '#10b981' : isSkipped ? '#f59e0b' : '#ef4444'}
              showInfo={false}
            />
            <div className="text-xs text-gray-500 text-center mt-1">
              Chunk {progress.currentChunk}/{progress.totalChunks}
            </div>
          </div>
        )}

        {/* Next / Complete button */}
        {result.completed ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-green-400 mb-4">🎉 Completed!</div>
            <Button type="primary" size="large" onClick={handleNext} loading={isLoading}>
              View summary
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={handleNext}
            loading={isLoading}
            style={{ background: TONE.gradient, border: 'none' }}
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default FeedbackView
