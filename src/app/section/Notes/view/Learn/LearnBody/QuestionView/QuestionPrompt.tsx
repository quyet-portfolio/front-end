import React from 'react'
import { Badge } from 'antd'

interface QuestionPromptProps {
  text: string | undefined
  phase?: 'learn' | 'review'
}

const QuestionPrompt = ({ text, phase = 'learn' }: QuestionPromptProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-xl font-semibold text-white">{text}</span>
    </div>
  )
}

export default QuestionPrompt
