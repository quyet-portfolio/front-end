'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AnswerResult, LearnQuestion, LearnState } from '../../../types'
import LoadingView from './LoadingView'
import QuestionView from './QuestionView/QuestionView'
import FeedbackView from './FeedbackView/FeedbackView'
import { Button, Result } from 'antd'
import { CheckCircleOutlined, HomeOutlined } from '@ant-design/icons'

interface LearnBodyProps {
  state: LearnState
  question: LearnQuestion | null
  result: AnswerResult | null
  onSubmit: (answer: string) => Promise<void>
  onNext: () => Promise<void>
}

const LearnBody = ({ state, question, result, onSubmit, onNext }: LearnBodyProps) => {
  const router = useRouter()
  const params = useParams()
  const flashcardId = params.id as string

  const handleGoToDetail = () => {
    if (flashcardId) {
      router.push(`/notes/${flashcardId}`)
    } else {
      router.push('/notes')
    }
  }

  switch (state) {
    case 'loading':
      return <LoadingView />

    case 'question':
      return <QuestionView question={question} onSubmit={onSubmit} />

    case 'feedback':
      return <FeedbackView result={result} onNext={onNext} />

    case 'completed':
      return (
        <div className="py-10">
          <Result
            status="success"
            icon={<CheckCircleOutlined className="text-green-500 text-6xl" />}
            title="Congratulations! You have completed the session! 🎉"
            subTitle="You have learned all terms in this flashcard set."
            extra={[
              <Button
                key="detail"
                type="primary"
                icon={<HomeOutlined />}
                size="large"
                onClick={handleGoToDetail}
              >
                Return to details
              </Button>,
            ]}
          />
        </div>
      )

    case 'error':
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">An error occurred</h2>
          <p className="text-gray-600 mb-4">Please try again later.</p>
          <Button type="primary" onClick={handleGoToDetail}>
            Return to details
          </Button>
        </div>
      )

    case 'idle':
    default:
      return <LoadingView />
  }
}

export default LearnBody
