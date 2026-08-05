import { BlogStatusFilter } from '@/src/lib/types'

export const MY_BLOGS_PAGE_SIZE = 12

export const STATUS_TABS: Array<{ key: BlogStatusFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
]

// Nhịp reveal (giây). Delay tính theo group và bị cap lại ở MAX_STAGGER_STEPS nên
// dù feed có hàng nghìn bài, group cuối cùng cũng chỉ đợi tối đa 0.6s.
export const GROUP_DELAY = 0.12
export const CARD_DELAY = 0.08
export const MAX_STAGGER_STEPS = 5

// Vượt ngưỡng này thì sentinel ngừng tự tải — người dùng phải bấm "Load more".
// Chặn việc cuộn vu vơ làm phình DOM vô hạn.
export const MAX_AUTO_LOAD_ITEMS = 400

// framer-motion 12 chỉ nhận px/% cho viewport.margin
export const TIMELINE_VIEWPORT = {
  once: true,
  amount: 0.1,
  margin: '0px 0px -60px 0px',
} as const
