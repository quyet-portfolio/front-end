'use client'

import { useEffect, useState } from 'react'
import { Progress, Tooltip } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import { learnApi } from '@/src/lib/api/notes'
import { MasterySummary } from '../types'

interface MasteryBarProps {
  flashcardId: string
  /** Chỉ nạp khi đã đăng nhập — độ thuộc gắn với từng người. */
  enabled: boolean
}

/**
 * Độ thuộc tích luỹ của người dùng với bộ thẻ này.
 *
 * Khác với thanh tiến độ ngay bên trên (vị trí thẻ đang lật, reset mỗi lần mở
 * trang), con số ở đây đến từ `UserTermProgress` và sống qua nhiều phiên học.
 */
const MasteryBar = ({ flashcardId, enabled }: MasteryBarProps) => {
  const [mastery, setMastery] = useState<MasterySummary | null>(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    learnApi
      .getMastery(flashcardId)
      .then((data) => {
        if (!cancelled) setMastery(data.mastery)
      })
      // Chưa học lần nào hoặc API lỗi thì đơn giản là không hiện gì — đây là thông
      // tin thêm, không phải thứ đáng chặn cả trang.
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [flashcardId, enabled])

  if (!mastery || mastery.totalTerms === 0) return null

  return (
    <div className="rounded-xl border border-white/10 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <TrophyOutlined className="text-indigo-400" />
          Your mastery
        </div>
        <span className="text-xs text-gray-400">
          {mastery.mastered}/{mastery.totalTerms} terms
        </span>
      </div>

      <Tooltip title={`${mastery.masteryPercentage}% mastered`}>
        <Progress percent={mastery.masteryPercentage} strokeColor="#6366F1" showInfo={false} size="small" />
      </Tooltip>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
        <span>{mastery.learning} still learning</span>
        <span>{mastery.notStarted} not started</span>
        {mastery.dueForReview > 0 && (
          <span className="text-amber-400">{mastery.dueForReview} due for review</span>
        )}
      </div>
    </div>
  )
}

export default MasteryBar
