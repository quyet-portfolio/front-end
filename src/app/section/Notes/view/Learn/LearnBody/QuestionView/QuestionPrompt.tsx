import React from 'react'

const QuestionPrompt = ({ text } : { text: string | undefined }) => {
  return (
    <div>{text}</div>
  )
}

export default QuestionPrompt