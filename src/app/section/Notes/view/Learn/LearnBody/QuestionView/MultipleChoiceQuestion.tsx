import { AnswerResult, LearnQuestion } from '../../../../types'
import QuestionPrompt from './QuestionPrompt'
import OptionList from './OptionList'
import { Card } from 'antd'

const MultipleChoiceQuestion = ({
  question,
  onSubmit,
  result
}: {
  question: LearnQuestion | null
  onSubmit: (answer: string) => Promise<void>
  result: AnswerResult | null;
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-6">
        <QuestionPrompt text={question?.prompt} />

        <OptionList options={question?.quizOptions} result={result} onSelect={onSubmit} />
      </div>
    </Card>
  )
}

export default MultipleChoiceQuestion
