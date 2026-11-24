'use client'

import { RefObject } from 'react'
import Button from 'antd/es/button'
import Spin from 'antd/es/spin'

interface TimelineLoadMoreProps {
  sentinelRef: RefObject<HTMLDivElement | null>
  hasMore: boolean
  loadingMore: boolean
  error: string | null
  // Đã vượt DOM cap — sentinel ngừng tự tải, nút bấm là lối duy nhất
  autoLoad: boolean
  onLoadMore: () => void
}

const TimelineLoadMore = ({
  sentinelRef,
  hasMore,
  loadingMore,
  error,
  autoLoad,
  onLoadMore,
}: TimelineLoadMoreProps) => {
  return (
    <div className="flex flex-col items-center gap-3 pt-10">
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      {loadingMore && (
        <div className="flex items-center gap-3">
          <Spin />
          <span role="status" aria-live="polite" className="text-sm text-white-200">
            Loading more...
          </span>
        </div>
      )}

      {!loadingMore && error && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-red-500">{error}</p>
          <Button onClick={onLoadMore}>Try again</Button>
        </div>
      )}

      {!loadingMore && !error && hasMore && (
        <div className="flex flex-col items-center gap-2">
          {!autoLoad && (
            <p className="text-xs text-gray-500">Auto-loading paused to keep the page fast</p>
          )}
          <Button onClick={onLoadMore}>Load more</Button>
        </div>
      )}

      {!hasMore && <p className="text-xs text-gray-500">You&apos;ve reached the beginning</p>}
    </div>
  )
}

export default TimelineLoadMore
