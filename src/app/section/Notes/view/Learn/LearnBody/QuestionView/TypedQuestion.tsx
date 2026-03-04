'use client'

import React, { useState, useRef } from 'react'
import { LearnQuestion } from '../../../../types'
import { Card, Input, Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const TypedQuestion = ({
  question,
  onSubmit,
}: {
  question: LearnQuestion | null
  onSubmit: (answer: string) => Promise<void>
}) => {
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(answer.trim())
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-6">
        {/* Prompt */}
        <div className="text-lg font-medium text-center">
          {question?.prompt}
        </div>

        {/* Input section */}
        <div className="flex flex-col gap-4">
          <Input
            size="large"
            placeholder="Nhập câu trả lờiof bạn..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            autoFocus
          />

          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!answer.trim()}
            className="w-full"
          >
            Kiểm tra
          </Button>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="text-xs text-gray-400 text-center">
          Nhấn Enter để kiểm tra
        </div>
      </div>
    </Card>
  )
}

export default TypedQuestion
