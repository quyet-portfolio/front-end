'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AnswerResult, LearnQuestion, LearnState } from '../../../types'
import LoadingView from './LoadingView'
import QuestionView from './QuestionView/QuestionView'
import FeedbackView from './FeedbackView/FeedbackView'
import { Button } from 'antd'
import SessionSummary from './SessionSummary'
import { LearnSessionStats } from '../../../types'

interface LearnBodyProps {
  state: LearnState
  question: LearnQuestion | null
  result: AnswerResult | null
  onSubmit: (answer: string) => Promise<void>
  onSkip: () => Promise<void>
  onNext: () => Promise<void>
  stats: LearnSessionStats | null
  statsLoading: boolean
  onLearnAgain: () => void
}

const LearnBody = ({
  state,
  question,
  result,
  onSubmit,
  onSkip,
  onNext,
  stats,
  statsLoading,
  onLearnAgain,
}: LearnBodyProps) => {
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
      return <QuestionView question={question} onSubmit={onSubmit} onSkip={onSkip} />

    case 'feedback':
      return <FeedbackView result={result} onNext={onNext} />

    case 'completed':
      return (
        <SessionSummary
          stats={stats}
          loading={statsLoading}
          onGoToDetail={handleGoToDetail}
          onLearnAgain={onLearnAgain}
        />
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
