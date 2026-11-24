import { LearnQuestion } from '../../../../types'
import QuestionPrompt from './QuestionPrompt'
import OptionList from './OptionList'
import SkipButton from './SkipButton'

interface MultipleChoiceQuestionProps {
  question: LearnQuestion | null
  onSubmit: (answer: string) => Promise<void>
  onSkip: () => Promise<void>
}

const MultipleChoiceQuestion = ({ question, onSubmit, onSkip }: MultipleChoiceQuestionProps) => (
  <div className="flex flex-col gap-6">
    <QuestionPrompt text={question?.prompt} phase="learn" />
    <OptionList options={question?.quizOptions} onSelect={onSubmit} />

    <div className="flex justify-center">
      <SkipButton onSkip={onSkip} />
    </div>

    {question?.progress && (
      <div className="text-xs text-gray-500 text-center">
        Chunk {question.progress.currentChunk}/{question.progress.totalChunks}
      </div>
    )}
  </div>
)

export default MultipleChoiceQuestion
