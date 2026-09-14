'use client'

import { Button, Result } from 'antd'
import { useEffect } from 'react'
import { flashcardsRoutes } from '@/src/app/section/Flashcards/routes'

// Không có error boundary thì một lỗi render bất kỳ trong nhánh /flashcards sẽ đổ lên
// boundary gốc và thổi bay cả trang.
const FlashcardsError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error('Flashcards route error:', error)
  }, [error])

  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle="This page could not be loaded. Try again, or go back to your flashcards."
      extra={[
        <Button type="primary" key="retry" onClick={reset}>
          Try again
        </Button>,
        <Button key="back" href={flashcardsRoutes.list}>
          Back to flashcards
        </Button>,
      ]}
    />
  )
}

export default FlashcardsError
