'use client'

import { Button, Result } from 'antd'
import { useEffect } from 'react'

// Không có error boundary thì một lỗi render bất kỳ trong nhánh /notes sẽ đổ lên
// boundary gốc và thổi bay cả trang.
const NotesError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error('Notes route error:', error)
  }, [error])

  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle="This page could not be loaded. Try again, or go back to your notes."
      extra={[
        <Button type="primary" key="retry" onClick={reset}>
          Try again
        </Button>,
        <Button key="back" href="/notes">
          Back to notes
        </Button>,
      ]}
    />
  )
}

export default NotesError
