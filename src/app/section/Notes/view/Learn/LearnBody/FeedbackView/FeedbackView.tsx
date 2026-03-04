import React, { useEffect, useState } from 'react'
import { AnswerResult } from '../../../../types'
import { Card, Button, Progress, Badge } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'

interface FeedbackViewProps {
  result: AnswerResult | null
  onNext: () => Promise<void>
}

const FeedbackView = ({ result, onNext }: FeedbackViewProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(2)

  const isCorrect = result?.correct
  const progress = result?.progress

  // Auto countdown for correct answer
  useEffect(() => {
    if (!isCorrect || result?.completed) return

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

  if (!result) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">Không có kết quả</div>
      </Card>
    )
  }

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex flex-col gap-6 items-center">
        {/* Result icon */}
        <div className="text-6xl">
          {isCorrect ? (
            <CheckCircleOutlined className="text-green-500" />
          ) : (
            <CloseCircleOutlined className="text-red-500" />
          )}
        </div>

        {/* Result message */}
        <div className="text-center">
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Chính xác! 🎉' : 'Chưa đúng 😕'}
          </h3>
          
          {!isCorrect && result.correctAnswer && (
            <div className="mt-2 text-gray-600">
              Đáp án đúng: <span className="font-semibold text-green-600">{result.correctAnswer}</span>
            </div>
          )}
        </div>

        {/* Progress info */}
        {progress && (
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Tiến độ</span>
              <span>{progress.percentage}%</span>
            </div>
            <Progress percent={progress.percentage} size="small" strokeColor="#3b82f6" showInfo={false} />
            <div className="text-xs text-gray-400 text-center mt-1">
              {progress.completedTerms}/{progress.totalTerms} từ • Chunk {progress.currentChunk}/{progress.totalChunks}
            </div>
          </div>
        )}

        {/* Phase indicator */}
        <Badge
          count={result.phase === 'learn' ? 'Đang học' : 'Đang ôn tập'}
          style={{
            backgroundColor: result.phase === 'learn' ? '#3b82f6' : '#10b981',
          }}
        />

        {/* Next button */}
        {result.completed ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 mb-4">🎉 Hoàn thành!</div>
            <Button type="primary" size="large" onClick={handleNext} loading={isLoading}>
              Xem tổng kết
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={handleNext}
            loading={isLoading}
          >
            {isCorrect ? `Tiếp tục ${countdown > 0 ? `(${countdown})` : ''}` : 'Thử lại'}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default FeedbackView
