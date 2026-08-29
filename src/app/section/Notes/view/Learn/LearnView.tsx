'use client'

import { useEffect } from 'react'
import { useLearnStore } from '../../store'
import LearnHeader from './LearnHeader/LearnHeader'
import LearnBody from './LearnBody/LearnBody'
import { useParams } from 'next/navigation'

const LearnView = () => {
  const param = useParams()
  const flashcardId = param.id

  // Selector riêng cho từng mảnh: useLearnStore() trần đăng ký nghe TOÀN BỘ store
  // nên mọi thay đổi nhỏ đều render lại cả cây Learn.
  const state = useLearnStore((s) => s.state)
  const question = useLearnStore((s) => s.question)
  const result = useLearnStore((s) => s.result)
  const start = useLearnStore((s) => s.start)
  const submit = useLearnStore((s) => s.submit)
  const skip = useLearnStore((s) => s.skip)
  const next = useLearnStore((s) => s.next)
  const reset = useLearnStore((s) => s.reset)
  const stats = useLearnStore((s) => s.stats)
  const statsLoading = useLearnStore((s) => s.statsLoading)

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
      <LearnBody
        state={state}
        question={question}
        result={result}
        onSubmit={submit}
        onSkip={skip}
        onNext={next}
        stats={stats}
        statsLoading={statsLoading}
        // Phiên vừa xong đã completed nên /start sẽ tạo phiên mới, và lần này thứ
        // tự hỏi được xếp theo độ cần ôn chứ không lặp lại y hệt.
        onLearnAgain={() => start(flashcardId as string)}
      />
    </div>
  )
}

export default LearnView
