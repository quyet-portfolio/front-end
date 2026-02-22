import React from 'react'
import { AnswerResult, LearnQuestion, LearnState } from '../../../types'
import LoadingView from './LoadingView'
import QuestionView from './QuestionView/QuestionView'
import FeedbackView from './FeedbackView/FeedbackView'

const LearnBody = ({
  state,
  question,
  result,
  onSubmit,
  onNext,
}: {
  state: LearnState
  question: LearnQuestion | null
  result: AnswerResult | null
  onSubmit: (answer: string) => Promise<void>
  onNext: () => Promise<void>
}) => {
  switch (state) {
    case 'loading':
      return <LoadingView />

    // case "question":
    //   return (
    //     <QuestionView
    //       question={question}
    //       onSubmit={onSubmit}
    //       result={result}
    //     />
    //   );

    // case "feedback":
    //   return (
    //     <FeedbackView
    //       result={result}
    //       onNext={onNext}
    //     />
    //   );

    // case "completed":
    //   return <CompletedView />;

    // case "error":
    //   return <ErrorView />;

    default:
      return <QuestionView question={question} onSubmit={onSubmit} result={result} />
  }
}

export default LearnBody
