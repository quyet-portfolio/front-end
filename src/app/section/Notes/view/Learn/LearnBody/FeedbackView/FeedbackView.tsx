'use client'

import { useEffect, useState } from 'react'
import { AnswerResult } from '../../../../types'
import { Button, Progress } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'
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

  const cardBg = isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'
  const borderColor = isCorrect ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'

  return (
    <motion.div
      initial={isCorrect ? CORRECT_INITIAL : WRONG_INITIAL}
      animate={isCorrect ? CORRECT_ANIMATE : WRONG_ANIMATE}
      transition={isCorrect ? CORRECT_TRANSITION : WRONG_TRANSITION}
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: cardBg, border: `1.5px solid ${borderColor}` }}
    >
      <div className="flex flex-col gap-5 items-center">
        {/* Result icon */}
        <div className="text-6xl">
          {isCorrect ? (
            <CheckCircleOutlined className="text-green-400" />
          ) : (
            <CloseCircleOutlined className="text-red-400" />
          )}
        </div>

        {/* Result message */}
        <div className="text-center">
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct! 🎉' : 'Incorrect 😕'}
          </h3>
        </div>

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
              strokeColor={isCorrect ? '#10b981' : '#ef4444'}
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
            style={
              isCorrect
                ? { background: 'linear-gradient(135deg,#10b981,#6366F1)', border: 'none' }
                : { background: 'linear-gradient(135deg,#ef4444,#f97316)', border: 'none' }
            }
          >
            {isCorrect ? `Continue${countdown > 0 ? ` (${countdown})` : ''}` : 'Try again'}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default FeedbackView
