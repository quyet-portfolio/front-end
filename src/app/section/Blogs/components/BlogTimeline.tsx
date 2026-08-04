'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Blog } from '@/src/lib/types'
import { getTimelineDuration, groupBlogsByDate } from '../utils/groupBlogsByDate'
import BlogTimelineGroup from './BlogTimelineGroup'

interface BlogTimelineProps {
  blogs: Blog[]
  deletingId: string | null
  onDelete: (blog: Blog) => void
}

// Reveal pacing (seconds)
const GROUP_DELAY = 0.22
const CARD_DELAY = 0.14

const BlogTimeline = ({ blogs, deletingId, onDelete }: BlogTimelineProps) => {
  const shouldReduceMotion = useReducedMotion()
  const groups = useMemo(
    () => groupBlogsByDate(blogs, { groupDelay: GROUP_DELAY, cardDelay: CARD_DELAY }),
    [blogs]
  )

  // The trunk finishes drawing right as the last card lands
  const trunkDuration = getTimelineDuration(groups, CARD_DELAY) + 0.4

  return (
    <div className="relative">
      {/* Trunk — left aligned on mobile, centered on desktop.
          A 2px width keeps the line on whole pixels so it stays centered under the nodes */}
      <div className="absolute top-0 bottom-0 left-3 md:left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-white/10" />
      <motion.div
        className="absolute top-0 left-3 md:left-1/2 w-0.5 -translate-x-1/2 rounded-full
          bg-gradient-to-b from-indigo-500 via-purple to-indigo-500/0"
        initial={{ height: shouldReduceMotion ? '100%' : 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: shouldReduceMotion ? 0 : trunkDuration, ease: 'linear' }}
      />

      <div className="flex flex-col gap-10 md:gap-14">
        {groups.map((group, index) => (
          <BlogTimelineGroup
            key={group.dateKey}
            group={group}
            isLeft={index % 2 === 0}
            cardDelay={CARD_DELAY}
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
