'use client'

import React, { useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { SoundOutlined } from '@ant-design/icons'

interface FlipCardProps {
  term: string
  definition: string
  related?: string
  isFlipped: boolean
  onFlip: () => void
}

export const FlipCard: React.FC<FlipCardProps> = ({ term, definition, related, isFlipped, onFlip }) => {
  // Nút loa trước đây chỉ có mỗi stopPropagation — bấm vào không xảy ra gì cả,
  // còn tệ hơn là không có nút. Web Speech API có sẵn trong trình duyệt nên không
  // cần thêm phụ thuộc; nơi nào không hỗ trợ thì ẩn hẳn nút đi.
  // Trả về false khi render phía server rồi mới đọc giá trị thật ở client, nên
  // markup hai bên khớp nhau mà không cần setState trong effect.
  const canSpeak = useSyncExternalStore(
    () => () => {},
    () => 'speechSynthesis' in window,
    () => false,
  )

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canSpeak) return

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(term))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== ' ' && e.key !== 'Enter') return

    // Chặn cả cuộn trang lẫn handler phím tắt gắn trên window của trang chi tiết,
    // nếu không một lần nhấn Space sẽ lật thẻ hai lần và trông như không có gì xảy ra.
    e.preventDefault()
    e.stopPropagation()
    onFlip()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? `Definition of ${term}. Activate to show the term.` : `Term: ${term}. Activate to show the definition.`}
      className="w-full h-[400px] cursor-pointer perspective-1000 group rounded-2xl
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f24]"
      onClick={onFlip}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-2xl"
        initial={false}
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 w-full h-full bg-card rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden">
          <div className="absolute top-4 left-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Term</div>

          {canSpeak && (
            <div className="absolute top-4 right-4">
              <button
                type="button"
                aria-label={`Pronounce ${term}`}
                onClick={handleSpeak}
                className="p-2 rounded-full text-gray-400 hover:text-indigo-400 transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <SoundOutlined className="text-lg" />
              </button>
            </div>
          )}

          <h3 className="text-3xl md:text-4xl font-bold text-white text-center select-none">{term}</h3>
        </div>

        <div
          // `h-ful` thiếu chữ `l` khiến mặt sau không có chiều cao, nội dung tràn ra ngoài khung.
          className="absolute inset-0 w-full h-full bg-card rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden"
          style={{ transform: 'rotateX(180deg)' }}
        >
          <div className="absolute top-4 left-4 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Definition
          </div>

          <div className="text-center space-y-4 overflow-y-auto max-h-full w-full px-4">
            <p className="text-2xl font-medium text-white select-none">{definition}</p>

            {related && (
              <div className="pt-4 border-t border-white/10 mt-4">
                <p className="text-indigo-300 italic text-lg">&quot;{related}&quot;</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
