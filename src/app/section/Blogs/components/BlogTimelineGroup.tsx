'use client'

import { motion } from 'framer-motion'
import { Blog } from '@/src/lib/types'
import { cn } from '@/src/lib/utils'
import { BlogDateGroup } from '../utils/groupBlogsByDate'
import MyBlogCard from './MyBlogCard'

interface BlogTimelineGroupProps {
  group: BlogDateGroup
  // Blogs of the same day sit on the same side; consecutive days alternate
  isLeft: boolean
  cardDelay: number
  deletingId: string | null
  onDelete: (blog: Blog) => void
  disableAnimation: boolean
}

const BlogTimelineGroup = ({
  group,
  isLeft,
  cardDelay,
  deletingId,
  onDelete,
  disableAnimation,
}: BlogTimelineGroupProps) => {
  const nodeTransition = disableAnimation ? { duration: 0 } : { delay: group.delay, duration: 0.35, ease: 'backOut' as const }

  return (
    <div className="relative pl-10 md:pl-0 md:grid md:grid-cols-2">
      {/* Node sitting on the trunk — the wrapper owns the centering so the
          animated transform of the inner span cannot override it */}
      <span className="absolute left-3 md:left-1/2 top-2 -translate-x-1/2 z-10 block h-4 w-4">
        <motion.span
          className="flex h-4 w-4 items-center justify-center rounded-full border border-indigo-400/70
            bg-[#0a0f24] shadow-[0_0_12px_rgba(99,102,241,0.6)]"
          initial={{ scale: disableAnimation ? 1 : 0, opacity: disableAnimation ? 1 : 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={nodeTransition}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
        </motion.span>
      </span>

      {/* Branch connecting the trunk to the card column */}
      <motion.span
        className={cn(
          // -mt-px pulls the 2px branch onto the exact vertical center of the node
          'absolute top-4 -mt-px h-0.5 bg-gradient-to-r from-indigo-500/60 to-transparent',
          'left-3 w-7 md:w-10',
          isLeft ? 'md:left-auto md:right-1/2 md:bg-gradient-to-l' : 'md:left-1/2'
        )}
        initial={{ scaleX: disableAnimation ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        style={{ transformOrigin: isLeft ? 'right' : 'left' }}
        transition={disableAnimation ? { duration: 0 } : { delay: group.delay + 0.1, duration: 0.3 }}
      />

      <div className={cn('flex flex-col gap-5', isLeft ? 'md:col-start-1 md:pr-12' : 'md:col-start-2 md:pl-12')}>
        <motion.div
          className={cn('flex items-baseline gap-2', isLeft && 'md:justify-end')}
          initial={{ opacity: disableAnimation ? 1 : 0, y: disableAnimation ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disableAnimation ? { duration: 0 } : { delay: group.delay + 0.1, duration: 0.35 }}
        >
          <span className="text-sm font-bold tracking-wide text-indigo-300">{group.dateLabel}</span>
          <span className="text-xs text-gray-500">
            {group.blogs.length} post{group.blogs.length === 1 ? '' : 's'}
          </span>
        </motion.div>

        {group.blogs.map((blog, index) => (
          <motion.div
            key={blog._id}
            className="w-full"
            initial={{
              opacity: disableAnimation ? 1 : 0,
              y: disableAnimation ? 0 : 24,
              x: disableAnimation ? 0 : (isLeft ? 24 : -24),
            }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={
              disableAnimation
                ? { duration: 0 }
                : { delay: group.delay + 0.15 + index * cardDelay, duration: 0.45, ease: 'easeOut' }
            }
          >
            <MyBlogCard blog={blog} deleting={deletingId === blog._id} onDelete={onDelete} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default BlogTimelineGroup
