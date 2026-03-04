import React from 'react'
import { LearnQuestion } from '../../../../types'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import TypedQuestion from './TypedQuestion'
import { Card, Skeleton } from 'antd'

interface QuestionViewProps {
  question: LearnQuestion | null
  onSubmit: (answer: string) => Promise<void>
}

const QuestionView = ({ question, onSubmit }: QuestionViewProps) => {
  // Loading state
  if (!question) {
    return (
      <Card className="p-4">
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    )
  }

  switch (question.phase) {
    case 'learn':
      return (
        <MultipleChoiceQuestion
          question={question}
          onSubmit={onSubmit}
        />
      )

    case 'review':
      return (
        <TypedQuestion
          question={question}
          onSubmit={onSubmit}
        />
      )

    default:
      return (
        <Card className="p-4">
          <div className="text-center text-gray-500">
            Không xác định được phase học
          </div>
        </Card>
      )
  }
}

export default QuestionView
