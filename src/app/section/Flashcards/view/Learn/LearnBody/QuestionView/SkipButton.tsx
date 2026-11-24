'use client'

import { useState } from 'react'
import { Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

interface SkipButtonProps {
  onSkip: () => Promise<void>
  disabled?: boolean
}

/**
 * Lối thoát khi người học bí.
 *
 * Trả lời sai không đẩy con trỏ đi, nên nếu không có nút này thì một term gõ mãi
 * không ra sẽ lặp lại vô hạn và cả session không bao giờ kết thúc được.
 */
const SkipButton = ({ onSkip, disabled }: SkipButtonProps) => {
  const [isSkipping, setIsSkipping] = useState(false)

  const handleClick = async () => {
    if (isSkipping) return

    setIsSkipping(true)
    try {
      await onSkip()
    } finally {
      setIsSkipping(false)
    }
  }

  return (
    <Button
      type="text"
      icon={<QuestionCircleOutlined />}
      onClick={handleClick}
      loading={isSkipping}
      disabled={disabled}
      className="text-gray-400 hover:text-gray-200"
    >
      I don&apos;t know
    </Button>
  )
}

export default SkipButton
