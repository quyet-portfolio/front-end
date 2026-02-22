import React from 'react'
import { AnswerResult, LearnQuestion } from '../../../../types'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import TypedQuestion from './TypedQuestion'

const QuestionView = ({ question, onSubmit, result } : {
  question: LearnQuestion | null
  onSubmit: (answer: string) => Promise<void>
  result: AnswerResult | null;
}) => {
  switch (question?.phase) {
    case "learn":
      return (
        <MultipleChoiceQuestion
          question={question}
          onSubmit={onSubmit}
          result={result}
        />
      );

    case "review":
      return (
        <TypedQuestion
          question={question}
          showHint
          onSubmit={onSubmit}
        />
      );
  }
}

export default QuestionView