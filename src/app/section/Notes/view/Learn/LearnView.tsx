'use client'

import React, { useEffect } from 'react'
import { useLearnStore } from '../../store'
import LearnHeader from './LearnHearder/LearnHeader'
import LearnBody from './LearnBody/LearnBody'
import LearnFooter from './LearnFooter'
import { useParams } from 'next/navigation'

const LearnView = () => {
  const param = useParams()
  const flashcardId = param.id

  const { state, start, next, question, result, submit } = useLearnStore()

  useEffect(() => {
    start(flashcardId as string)
  }, [])

  return (
    <div className="mt-16 flex flex-col gap-6 max-w-[912px] mx-auto">
      <LearnHeader />
      <LearnBody state={state} question={question} result={result} onSubmit={submit} onNext={next} />
    </div>
  )
}

export default LearnView
