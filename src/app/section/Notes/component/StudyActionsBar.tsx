'use client'

import { FormOutlined, RedoOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'

interface StudyActionsBarProps {
  flashcardId: string
  onReset: () => void
}

const StudyActionsBar = ({ flashcardId, onReset }: StudyActionsBarProps) => {
  const router = useRouter()

  const handleLearn = () => {
    router.push(`/notes/${flashcardId}/learn`)
  }

  return (
    <div className="flex gap-3 my-6">
      <Button
        type="primary"
        size="large"
        icon={<FormOutlined />}
        onClick={handleLearn}
        className="flex-1 h-12 text-base font-semibold"
        style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8b5cf6 100%)',
          border: 'none',
        }}
      >
        Learn now
      </Button>

      <Button
        size="large"
        icon={<RedoOutlined />}
        onClick={onReset}
        className="h-12 px-6 text-base"
      >
        Reset
      </Button>
    </div>
  )
}

export default StudyActionsBar
