import { LearnQuestion } from '../../../../types'
import QuestionPrompt from './QuestionPrompt'
import OptionList from './OptionList'
import { Card, Progress } from 'antd'

interface MultipleChoiceQuestionProps {
  question: LearnQuestion | null
  onSubmit: (answer: string) => Promise<void>
}

const MultipleChoiceQuestion = ({
  question,
  onSubmit,
}: MultipleChoiceQuestionProps) => {
  const progress = question?.progress

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex flex-col gap-6">
        {/* Phase indicator and Prompt */}
        <QuestionPrompt text={question?.prompt} phase="learn" />

        {/* Options */}
        <OptionList
          options={question?.quizOptions}
          onSelect={onSubmit}
        />

        {/* Chunk info */}
        {progress && (
          <div className="text-xs text-gray-400 text-center">
            Chunk {progress.currentChunk}/{progress.totalChunks}
          </div>
        )}
      </div>
    </Card>
  )
}

export default MultipleChoiceQuestion
