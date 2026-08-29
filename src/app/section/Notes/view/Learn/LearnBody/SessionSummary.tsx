'use client'

import { Button, Progress, Skeleton, Statistic } from 'antd'
import { CheckCircleOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { LearnSessionStats } from '../../../types'

interface SessionSummaryProps {
  stats: LearnSessionStats | null
  loading: boolean
  onGoToDetail: () => void
  onLearnAgain: () => void
}

const formatSeconds = (ms: number): string => {
  if (!ms) return '—'
  const seconds = ms / 1000
  return seconds < 10 ? `${seconds.toFixed(1)}s` : `${Math.round(seconds)}s`
}

/**
 * Màn hình kết thúc phiên học.
 *
 * Trước đây chỗ này chỉ có dòng "Chúc mừng" — trong khi server đã tính sẵn đủ số
 * câu đúng/sai/bỏ qua, độ chính xác, thời gian trả lời trung bình và độ thuộc,
 * chỉ là chưa có ai gọi tới.
 */
const SessionSummary = ({ stats, loading, onGoToDetail, onLearnAgain }: SessionSummaryProps) => {
  const accuracy = stats?.stats.accuracy ?? 0
  const accuracyColor = accuracy >= 80 ? '#10b981' : accuracy >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="py-8 flex flex-col items-center gap-8"
    >
      <div className="text-center">
        <CheckCircleOutlined className="text-green-500 text-6xl" />
        <h2 className="text-2xl font-bold mt-4">Session complete! 🎉</h2>
        <p className="text-gray-400 mt-1">You went through every term in this set.</p>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} className="w-full max-w-xl" />
      ) : stats ? (
        <>
          <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Statistic title="Correct" value={stats.stats.correct} valueStyle={{ color: '#10b981' }} />
            <Statistic title="Incorrect" value={stats.stats.incorrect} valueStyle={{ color: '#ef4444' }} />
            <Statistic title="Skipped" value={stats.stats.skipped} valueStyle={{ color: '#f59e0b' }} />
            <Statistic title="Avg. time" value={formatSeconds(stats.stats.avgResponseTimeMs)} />
          </div>

          <div className="w-full max-w-xl">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Accuracy</span>
              <span>
                {accuracy}% of {stats.stats.totalQuestions} answers
              </span>
            </div>
            <Progress percent={accuracy} strokeColor={accuracyColor} showInfo={false} />
          </div>

          {/*
            Độ thuộc tích luỹ qua nhiều phiên, khác với kết quả của riêng phiên vừa
            xong — nó mới là thứ trả lời câu "tôi đã học được bao nhiêu của bộ này".
          */}
          <div className="w-full max-w-xl rounded-xl border border-white/10 p-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Mastered in this set</span>
              <span>
                {stats.mastery.mastered}/{stats.mastery.totalTerms} terms
              </span>
            </div>
            <Progress percent={stats.mastery.masteryPercentage} strokeColor="#6366F1" showInfo={false} />
            <div className="flex gap-4 text-xs text-gray-500 mt-2">
              <span>{stats.mastery.learning} still learning</span>
              <span>{stats.mastery.notStarted} not started</span>
              {stats.mastery.dueForReview > 0 && (
                <span className="text-amber-400">{stats.mastery.dueForReview} due for review</span>
              )}
            </div>
          </div>
        </>
      ) : null}

      <div className="flex gap-3">
        <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={onLearnAgain}>
          Learn again
        </Button>
        <Button size="large" icon={<HomeOutlined />} onClick={onGoToDetail}>
          Return to details
        </Button>
      </div>
    </motion.div>
  )
}

export default SessionSummary
