'use client'

import { BlogArchiveYear } from '@/src/lib/types'
import { cn } from '@/src/lib/utils'

interface TimelineYearRailProps {
  years: BlogArchiveYear[]
  // Năm của group đang nằm giữa viewport
  activeYear: number | null
  // Năm đang neo feed; null = đang bắt đầu từ bài mới nhất
  anchorYear: number | null
  onSelectYear: (year: BlogArchiveYear | null) => void
}

const TimelineYearRail = ({ years, activeYear, anchorYear, onSelectYear }: TimelineYearRailProps) => {
  if (!years.length) return null

  const isLatest = anchorYear === null

  const renderYearButton = (year: BlogArchiveYear, layout: 'rail' | 'chip') => {
    const isActive = activeYear === year.year
    return (
      <button
        key={year.year}
        type="button"
        aria-current={isActive || undefined}
        onClick={() => onSelectYear(year)}
        className={cn(
          'flex items-center gap-2 rounded-full border text-xs font-semibold transition-all duration-200',
          layout === 'rail' ? 'px-3 py-1 justify-between' : 'px-3 py-1 shrink-0',
          isActive
            ? 'bg-primary border-primary text-white'
            : 'bg-transparent border-blue-950 text-white-100 hover:border-blue-500 hover:text-white'
        )}
      >
        <span>{year.year}</span>
        <span className={cn('text-[10px]', isActive ? 'text-white/70' : 'text-gray-500')}>{year.count}</span>
      </button>
    )
  }

  const latestButton = (layout: 'rail' | 'chip') => (
    <button
      type="button"
      onClick={() => onSelectYear(null)}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200',
        layout === 'chip' && 'shrink-0',
        isLatest
          ? 'border-indigo-500/60 text-indigo-300'
          : 'border-blue-950 text-white-100 hover:border-blue-500 hover:text-white'
      )}
    >
      Latest
    </button>
  )

  return (
    <>
      {/* Desktop rộng: rail dọc ở gutter phải. Phải là `fixed` chứ không `sticky`
          — LayoutContent bọc ngoài bằng overflow-hidden nên sticky không hoạt động.
          Dưới xl thì container không còn gutter, rail cố định sẽ đè lên card. */}
      <nav
        aria-label="Jump to year"
        className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-1"
      >
        {latestButton('rail')}
        {years.map((year) => renderYearButton(year, 'rail'))}
      </nav>

      <nav
        aria-label="Jump to year"
        className="flex xl:hidden items-center gap-2 overflow-x-auto scrollbar-hide"
      >
        {latestButton('chip')}
        {years.map((year) => renderYearButton(year, 'chip'))}
      </nav>
    </>
  )
}

export default TimelineYearRail
