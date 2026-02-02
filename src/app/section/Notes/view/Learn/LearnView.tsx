"use client"

import React, { useEffect } from 'react'
import { useLearnStore } from '../../store'
import LearnHeader from './LearnHearder/LearnHeader'
import LearnBody from './LearnBody/LearnBody'
import LearnFooter from './LearnFooter'
import { useParams } from 'next/navigation'

const LearnView = () => {
  const param = useParams()
  const flashcardId = param.id

  const { state, start, next } = useLearnStore()

  useEffect(() => {
    start(flashcardId as string)
  }, [flashcardId])

  return (
    <div className="mt-10 flex flex-col gap-6">
      <LearnHeader />

      {/* <LearnBody state={state} question={currentQuestion} result={lastResult} onSubmit={submitAnswer} onNext={next} /> */}

      <LearnFooter />
    </div>
  )
}

export default LearnView
