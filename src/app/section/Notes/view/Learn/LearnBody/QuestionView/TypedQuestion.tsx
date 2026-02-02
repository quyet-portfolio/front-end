import React from 'react'
import { LearnQuestion } from '../../../../types'

const TypedQuestion = ({ question, showHint, onSubmit } : {
  question: LearnQuestion | null
  showHint?: boolean
  onSubmit: (answer: string) => Promise<void>
}) => {
  return (
    <div>TypedQuestion</div>
  )
}

export default TypedQuestion