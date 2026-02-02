import { Progress } from 'antd'
import { useLearnStore } from '../../../store'
import './index.css'

export function ProgressIndicator() {
  const { stepCount, totalSteps } = useLearnStore()

  console.log("check: ", {
    stepCount, totalSteps
  })

  return (
    <div className="progress-indicator">
      <Progress
        percent={totalSteps === 0 ? 0 : Math.round((stepCount / totalSteps) * 100)}
        steps={stepCount}
        showInfo={false}
      />
    </div>
  )
}
