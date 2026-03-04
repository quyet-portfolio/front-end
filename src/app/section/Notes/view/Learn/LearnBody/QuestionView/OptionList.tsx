import React, { useState } from 'react'

interface OptionListProps {
  options: string[] | undefined
  onSelect: (answer: string) => Promise<void>
}

const getOptionClassName = (isSelected: boolean, isSubmitting: boolean): string => {
  const baseClass = 'w-[48%] rounded-lg p-4 border-2 transition-all duration-200'
  
  // if (isSubmitting) {
  //   return `${baseClass} border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50`
  // }
  
  if (isSelected) {
    return `${baseClass} border-[#6366F1] bg-blue-50 text-blue-700 cursor-default`
  }
  
  return `${baseClass} border-gray-200 hover:border-[#6366F1] cursor-pointer shadow-sm`
}

const OptionList = ({ options, onSelect }: OptionListProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelect = async (item: string, index: number) => {
    if (isSubmitting) return

    setSelectedIndex(index)
    setIsSubmitting(true)

    try {
      await onSelect(item)
    } finally {
      // Không reset isSubmitting vì sau khi submit sẽ chuyển sang feedback view
    }
  }

  return (
    <div className="w-full flex flex-wrap gap-4">
      {options?.map((item, index) => {
        const isSelected = selectedIndex === index

        return (
          <div
            key={index}
            className={getOptionClassName(isSelected, isSubmitting)}
            onClick={() => handleSelect(item, index)}
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold text-sm">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-grow">{item}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OptionList
