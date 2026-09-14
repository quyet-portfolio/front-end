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
    'w-full h-full text-left rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer select-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ' +
    'disabled:cursor-not-allowed'

  if (isSelected) {
    return `${base} border-indigo-500 bg-indigo-500/10 text-indigo-300`
  }

  return `${base} border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-indigo-500/10`
}

/**
 * Danh sách đáp án trắc nghiệm.
 *
 * Mỗi lựa chọn là <button> chứ không phải <div onClick> như trước: cái div không
 * nhận được focus, không phản hồi Enter/Space, và không được announce là thứ bấm
 * được — tức là người dùng bàn phím hoặc screen reader không chơi được quiz.
 *
 * Bố cục cũng đổi từ `w-[48%]` cố định hai cột sang grid: định nghĩa dài trên màn
 * hình hẹp trước đây bị nhồi vào nửa chiều rộng và vỡ chữ.
 */
const OptionList = ({ options, onSelect }: OptionListProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelect = async (item: string, index: number) => {
    if (isSubmitting) return

    setSelectedIndex(index)
    setIsSubmitting(true)

    await onSelect(item)
    // Không reset isSubmitting — màn hình chuyển sang feedback ngay sau đây.
  }

  return (
    <div
      role="group"
      aria-label="Answer options"
      className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {options?.map((item, index) => {
        const isSelected = selectedIndex === index

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.07 }}
          >
            <button
              type="button"
              disabled={isSubmitting}
              aria-pressed={isSelected}
              className={getOptionStyle(isSelected)}
              onClick={() => handleSelect(item, index)}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                    ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-300'}`}
                >
                  {OPTION_LETTERS[index]}
                </span>
                <span className="flex-grow text-sm leading-snug">{item}</span>
              </div>
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}

export default OptionList
