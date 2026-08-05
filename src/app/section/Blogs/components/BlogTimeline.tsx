'use client'

import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { BlogListItem } from '@/src/lib/types'
import { GROUP_DELAY, MAX_STAGGER_STEPS } from '../constants/myBlogs'
import { groupBlogsByDate } from '../utils/groupBlogsByDate'
import BlogTimelineGroup from './BlogTimelineGroup'

interface BlogTimelineProps {
  blogs: BlogListItem[]
  // Số bài đã hiện trước batch mới nhất — group cũ không animate lại
  revealFromIndex: number
  deletingId: string | null
  onDelete: (blog: BlogListItem) => void
}

const BlogTimeline = ({ blogs, revealFromIndex, deletingId, onDelete }: BlogTimelineProps) => {
  const shouldReduceMotion = useReducedMotion()

  // Gom nhóm trên TOÀN BỘ mảng đã tích luỹ — xem ghi chú trong groupBlogsByDate
  const groups = useMemo(
    () =>
      groupBlogsByDate(blogs, {
        groupDelay: GROUP_DELAY,
        maxStaggerSteps: MAX_STAGGER_STEPS,
        revealFromIndex,
      }),
    [blogs, revealFromIndex]
  )

  return (
    <div className="relative">
      {/* Ray mờ nền — không animate nên tự dài ra theo content khi append.
          Đoạn thân cây sáng do từng group tự vẽ. */}
      <div className="absolute top-0 bottom-0 left-3 md:left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-white/10" />

      <div className="flex flex-col">
        {groups.map((group, index) => (
          <BlogTimelineGroup
            key={group.dateKey}
            group={group}
            isLeft={index % 2 === 0}
            deletingId={deletingId}
            onDelete={onDelete}
            disableAnimation={Boolean(shouldReduceMotion)}
          />
        ))}
      </div>
    </div>
  )
}

export default BlogTimeline
