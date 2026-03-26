'use client'

import { useEffect } from 'react'
import { useLearnStore } from '../../store'
import LearnHeader from './LearnHeader/LearnHeader'
import LearnBody from './LearnBody/LearnBody'
import { useParams } from 'next/navigation'

const LearnView = () => {
  const param = useParams()
  const flashcardId = param.id

  const { state, start, next, question, result, submit, reset } = useLearnStore()

  useEffect(() => {
    if (flashcardId) {
      start(flashcardId as string)
    }

    // Cleanup when unmount
    return () => {
      reset()
    }
  }, [flashcardId, start, reset])

  return (
    <div className="mt-16 flex flex-col gap-6 max-w-[912px] mx-auto">
      <LearnHeader />
      <LearnBody state={state} question={question} result={result} onSubmit={submit} onNext={next} />
    </div>
  )
}

export default LearnView
