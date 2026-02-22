import { div } from 'framer-motion/client'
import React, { useState } from 'react'
import { AnswerResult } from '../../../../types'

const getOptionClassName = (
  isSelected: boolean,
  isCorrect: boolean | undefined,
  hasResult: boolean
): string => {
  const baseClass = 'w-[48%] cursor-pointer rounded-md p-2 border border-[#1e293b]'
  
  if (!hasResult) {
    return `${baseClass} hover:border-[#6366F1]`
  }
  
  if (isSelected && isCorrect) {
    return `${baseClass} border-green-500 hover:border-green-500`
  }
  
  if (isSelected) {
    return `${baseClass} border-[#6366F1]`
  }
  
  return baseClass
}

const OptionList = ({
  options,
  onSelect,
  result,
}: {
  options: string[] | undefined
  onSelect: (answer: string) => Promise<void>
  result: AnswerResult | null
}) => {
  const [selectAnswer, setSelectAnwser] = useState<number>()

  return (
    <div className="w-full flex flex-wrap gap-4">
      {options?.map((item, index) => (
        <div
          key={index}
          className={getOptionClassName(selectAnswer === index, result?.correct, !!result)}
          onClick={() => {
            setSelectAnwser(index)
            onSelect(item)
          }}
        >
          {index + 1} <span className="pl-4">{item}</span>
        </div>
      ))}
    </div>
  )
}

export default OptionList
