'use client'

import { motion } from 'framer-motion'
import { BlogListItem } from '@/src/lib/types'
import { cn } from '@/src/lib/utils'
import { CARD_DELAY, TIMELINE_VIEWPORT } from '../constants/myBlogs'
import { BlogDateGroup } from '../utils/groupBlogsByDate'
import {
  branchVariants,
  cardVariants,
  dateLabelVariants,
  groupVariants,
  nodeVariants,
  trunkVariants,
} from '../utils/timelineVariants'
import MyBlogCard from './MyBlogCard'

interface BlogTimelineGroupProps {
  group: BlogDateGroup
  // Blog cùng ngày nằm cùng một phía; các ngày khác nhau so le trái/phải
  isLeft: boolean
  deletingId: string | null
  onDelete: (blog: BlogListItem) => void
  disableAnimation: boolean
}

const BlogTimelineGroup = ({
  group,
  isLeft,
  deletingId,
  onDelete,
  disableAnimation,
}: BlogTimelineGroupProps) => {
  return (
    // Khoảng cách dùng padding chứ KHÔNG dùng gap của flex: gap nằm ngoài border
    // box nên các đoạn trunk của từng group sẽ hở ra 40/56px.
    // content-visibility bỏ qua layout/paint cho group ngoài màn hình. Đặt được
    // trên chính node này vì nó chỉ điều phối variants, không tự animate transform.
    <motion.div
      data-year={group.year}
      className="relative pl-10 pb-10 md:pl-0 md:pb-14 scroll-mt-24 md:grid md:grid-cols-2
        [content-visibility:auto] [contain-intrinsic-size:auto_320px]"
      custom={isLeft}
      variants={groupVariants}
      initial={disableAnimation ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={TIMELINE_VIEWPORT}
      transition={{
        delayChildren: disableAnimation ? 0 : group.delay,
        staggerChildren: disableAnimation ? 0 : CARD_DELAY,
      }}
    >
      {/* Đoạn thân cây của riêng group này — nhờ vậy append batch mới chỉ là nối
          thêm đoạn, không phải chạy lại animation của thân cây cũ */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 bottom-0 left-3 md:left-1/2 w-0.5
          -translate-x-1/2 overflow-hidden"
      >
        <motion.span
          className="block w-full rounded-full bg-gradient-to-b from-indigo-500 via-purple to-indigo-500/40"
          variants={trunkVariants}
        />
      </span>

      {/* Node trên thân cây — wrapper tĩnh giữ việc căn giữa để transform của
          animation không đè mất -translate-x-1/2 */}
      <span className="absolute left-3 md:left-1/2 top-2 -translate-x-1/2 z-10 block h-4 w-4">
        <motion.span
          className="flex h-4 w-4 items-center justify-center rounded-full border border-indigo-400/70
            bg-[#0a0f24] shadow-[0_0_12px_rgba(99,102,241,0.6)]"
          variants={nodeVariants}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
        </motion.span>
      </span>

      {/* Nhánh ngang nối thân cây sang cột card. -mt-px kéo nhánh 2px về đúng
          tâm dọc của node */}
      <motion.span
        className={cn(
          'absolute top-4 -mt-px h-0.5 bg-gradient-to-r from-indigo-500/60 to-transparent',
          'left-3 w-7 md:w-10',
          isLeft ? 'md:left-auto md:right-1/2 md:bg-gradient-to-l' : 'md:left-1/2'
        )}
        style={{ transformOrigin: isLeft ? 'right' : 'left' }}
        variants={branchVariants}
      />

      <div className={cn('flex flex-col gap-5', isLeft ? 'md:col-start-1 md:pr-12' : 'md:col-start-2 md:pl-12')}>
        <motion.div
          className={cn('flex items-baseline gap-2', isLeft && 'md:justify-end')}
          variants={dateLabelVariants}
        >
          <span className="text-sm font-bold tracking-wide text-indigo-300">{group.dateLabel}</span>
          <span className="text-xs text-gray-500">
            {group.blogs.length} post{group.blogs.length === 1 ? '' : 's'}
          </span>
        </motion.div>

        {group.blogs.map((blog) => (
          <motion.div key={blog._id} className="w-full" custom={isLeft} variants={cardVariants}>
            <MyBlogCard blog={blog} deleting={deletingId === blog._id} onDelete={onDelete} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default BlogTimelineGroup
