import { Blog } from '@/src/lib/types'

export interface BlogDateGroup {
  dateKey: string
  dateLabel: string
  blogs: Blog[]
  // Delay (seconds) before this group starts revealing on the timeline
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
  // Delay added between two consecutive date groups
  groupDelay: number
  // Delay added between two cards inside the same date group
  cardDelay: number
}

// Group blogs by creation day — newest day first, newest blog first inside a day
export function groupBlogsByDate(blogs: Blog[], options: GroupBlogsByDateOptions): BlogDateGroup[] {
  const sorted = [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const groups = new Map<string, BlogDateGroup>()

  sorted.forEach((blog) => {
    const dateKey = getLocalDateKey(blog.createdAt)
    const group = groups.get(dateKey)
    if (group) {
      group.blogs.push(blog)
      return
    }
    groups.set(dateKey, { dateKey, dateLabel: formatDateLabel(blog.createdAt), blogs: [blog], delay: 0 })
  })

  // Stack the delays so the whole tree reveals top-down, card by card
  let revealedCards = 0
  return Array.from(groups.values()).map((group, index) => {
    const delay = index * options.groupDelay + revealedCards * options.cardDelay
    revealedCards += group.blogs.length
    return { ...group, delay }
  })
}

// Total time the tree needs to reveal every card — used to grow the trunk in sync
export function getTimelineDuration(groups: BlogDateGroup[], cardDelay: number): number {
  const lastGroup = groups[groups.length - 1]
  if (!lastGroup) return 0
  return lastGroup.delay + lastGroup.blogs.length * cardDelay
}
