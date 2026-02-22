import { Progress } from 'antd'
import { useLearnStore } from '../../../store'

export function ProgressIndicator() {
  const { stepCount, totalSteps } = useLearnStore()

  /*
  - Fix UI khi chọn đáp án sai
  - Tìm cách clear session khi thoát learn mode
  - Fix dup call api start, question
  */


  return (
    <div>
      <Progress
        percent={totalSteps === 0 ? 0 : Math.round((stepCount / totalSteps) * 100)}
        className='w-full'
        showInfo={false}
      />
    </div>
  )
}
