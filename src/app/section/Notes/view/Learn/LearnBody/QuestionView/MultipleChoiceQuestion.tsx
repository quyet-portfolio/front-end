import React from 'react'
import { LearnQuestion } from '../../../../types'
import QuestionFooter from './QuestionFooter'
import QuestionPrompt from './QuestionPrompt'
import OptionList from './OptionList'

const MultipleChoiceQuestion = ({ question, onSubmit } : {
  question: LearnQuestion | null
  onSubmit: (answer: string) => Promise<void>
}) => {
  return (
        <div>
      <QuestionPrompt text={question?.prompt} />

      <OptionList
        options={question?.options}
        onSelect={onSubmit}
      />

      <QuestionFooter />
    </div>
  )
}

export default MultipleChoiceQuestion