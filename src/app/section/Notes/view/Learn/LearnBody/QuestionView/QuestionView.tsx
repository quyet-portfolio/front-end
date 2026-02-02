import React from 'react'
import { LearnQuestion } from '../../../../types'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import TypedQuestion from './TypedQuestion'

const QuestionView = ({ question, onSubmit } : {
  question: LearnQuestion | null
  onSubmit: (answer: string) => Promise<void>
}) => {
  switch (question?.questionType) {
    case "mcq":
      return (
        <MultipleChoiceQuestion
          question={question}
          onSubmit={onSubmit}
        />
      );

    case "typed_with_hint":
      return (
        <TypedQuestion
          question={question}
          showHint
          onSubmit={onSubmit}
        />
      );

    case "typed_full":
      return (
        <TypedQuestion
          question={question}
          onSubmit={onSubmit}
        />
      );
  }
}

export default QuestionView