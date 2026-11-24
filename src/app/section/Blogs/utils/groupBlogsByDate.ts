import { BlogListItem } from '@/src/lib/types'

export interface BlogDateGroup {
  dateKey: string
  dateLabel: string
  year: number
  blogs: BlogListItem[]
  // Giây chờ trước khi group bắt đầu hiện, tính từ lúc lọt vào viewport
  delay: number
}

// Local calendar day key (YYYY-MM-DD) so blogs are bucketed by the viewer's timezone
function getLocalDateKey(value: string): string {
  const date = new Date(value)
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function formatDateLabel(value: string): string {
  return new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface GroupBlogsByDateOptions {
  groupDelay: number
  maxStaggerSteps: number
  // Bài trước index này đã hiện rồi — group của chúng nhận delay 0
  revealFromIndex: number
}

/**
 * Group blogs by creation day — newest day first, newest blog first inside a day.
 *
 * QUAN TRỌNG: phải chạy trên TOÀN BỘ mảng blog đã tích luỹ, không được gom theo
 * từng batch. Một ngày có thể bị cắt ngang hai trang; nhờ gom trên toàn mảng,
 * batch sau rơi vào đúng group đã có thay vì tạo group thứ hai nằm ở phía đối diện.
 */
export function groupBlogsByDate(blogs: BlogListItem[], options: GroupBlogsByDateOptions): BlogDateGroup[] {
  const sorted = [...blogs].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return diff !== 0 ? diff : b._id.localeCompare(a._id)
  })
  const groups = new Map<string, BlogDateGroup>()

  sorted.forEach((blog) => {
    const dateKey = getLocalDateKey(blog.createdAt)
    const group = groups.get(dateKey)
    if (group) {
      group.blogs.push(blog)
      return
    }
    groups.set(dateKey, {
      dateKey,
      dateLabel: formatDateLabel(blog.createdAt),
      year: new Date(blog.createdAt).getFullYear(),
      blogs: [blog],
      delay: 0,
    })
  })

  // Stagger tính lại từ đầu ở mỗi batch và bị cap, nên feed 1000 bài cũng không
  // bao giờ xếp hàng một chuỗi delay dài nhiều giây
  let scanned = 0
  let newGroupOrdinal = 0
  return Array.from(groups.values()).map((group) => {
    const isNewGroup = scanned + group.blogs.length > options.revealFromIndex
    scanned += group.blogs.length
    if (!isNewGroup) return group

    const step = Math.min(newGroupOrdinal, options.maxStaggerSteps)
    newGroupOrdinal += 1
    return { ...group, delay: step * options.groupDelay }
  })
}
