import React from 'react'
import { useLearnStore } from '../../../store'
import { ProgressIndicator } from './ProgressIndicator'

const LearnHeader = () => {
  const state = useLearnStore((s) => s.state)

  if (state === 'idle') return null

  return (
    <div>
      <ProgressIndicator />
    </div>
  )
}

export default LearnHeader
