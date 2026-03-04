import { Progress } from 'antd'
import { useLearnStore } from '../../../store'

export function ProgressIndicator() {
  const { stepCount, totalSteps, progress, phase } = useLearnStore()

  // Use overall progress if available, otherwise use step progress
  const percentage = progress?.percentage ?? (totalSteps === 0 ? 0 : Math.round((stepCount / totalSteps) * 100))
  const completedTerms = progress?.completedTerms ?? stepCount
  const totalTerms = progress?.totalTerms ?? totalSteps
  const currentChunk = progress?.currentChunk ?? 1
  const totalChunks = progress?.totalChunks ?? 1

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
        <span>
          {phase === 'learn' ? '📚 Đang học' : '🔄 Đang ôn tập'}
        </span>
        <span>
          {completedTerms}/{totalTerms} từ • Chunk {currentChunk}/{totalChunks}
        </span>
      </div>
      <Progress
        percent={percentage}
        className="w-full"
        showInfo={false}
        strokeColor={phase === 'learn' ? '#3b82f6' : '#10b981'}
      />
    </div>
  )
}
