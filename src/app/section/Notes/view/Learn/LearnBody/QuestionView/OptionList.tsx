'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface OptionListProps {
  options: string[] | undefined
  onSelect: (answer: string) => Promise<void>
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

const getOptionStyle = (isSelected: boolean): string => {
  const base =
    'w-[48%] rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer select-none'

  if (isSelected) {
    return `${base} border-indigo-500 bg-indigo-500/10 text-indigo-300`
  }

  return `${base} border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-indigo-500/10`
}

const OptionList = ({ options, onSelect }: OptionListProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelect = async (item: string, index: number) => {
    if (isSubmitting) return

    setSelectedIndex(index)
    setIsSubmitting(true)

    await onSelect(item)
    // Not resetting isSubmitting — view transitions to feedback after this
  }

  return (
    <div className="w-full flex flex-wrap gap-4">
      {options?.map((item, index) => {
        const isSelected = selectedIndex === index

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.07 }}
            className={getOptionStyle(isSelected)}
            onClick={() => handleSelect(item, index)}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                  ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-300'}`}
              >
                {OPTION_LETTERS[index]}
              </span>
              <span className="flex-grow text-sm leading-snug">{item}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default OptionList
