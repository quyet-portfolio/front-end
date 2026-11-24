'use client'

import { RefObject, useEffect, useRef } from 'react'

interface UseInfiniteScrollParams {
  targetRef: RefObject<HTMLElement | null>
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  enabled?: boolean
  rootMargin?: string
}

export const useInfiniteScroll = ({
  targetRef,
  hasMore,
  isLoading,
  onLoadMore,
  enabled = true,
  rootMargin = '600px 0px',
}: UseInfiniteScrollParams): void => {
  const isVisibleRef = useRef<boolean>(false)
  const onLoadMoreRef = useRef<() => void>(onLoadMore)

  // Sync trong effect chứ không phải trong render, để observer chỉ tạo một lần
  // cho mỗi feed thay vì tạo lại mỗi lần render
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  })

  useEffect(() => {
    const target = targetRef.current
    if (!target || !enabled || !hasMore) return
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isVisibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) onLoadMoreRef.current()
      },
      // Trang cuộn theo document (LayoutContent không có scroll container riêng)
      // nên root phải là viewport
      { root: null, rootMargin, threshold: 0 }
    )
    observer.observe(target)
    return () => observer.disconnect()
    // isLoading nằm trong deps vì sentinel chỉ được mount SAU khi trang đầu tải
    // xong. Không có nó, effect chạy lúc ref còn null và không bao giờ chạy lại
    // (hasMore/enabled đều không đổi) → observer không bao giờ được gắn.
  }, [targetRef, enabled, hasMore, rootMargin, isLoading])

  // Batch ngắn hơn viewport sẽ để sentinel nằm nguyên trên màn hình và không sinh
  // intersection mới nữa — phải tự kích lại khi request vừa xong
  useEffect(() => {
    if (isLoading || !hasMore || !enabled) return
    if (isVisibleRef.current) onLoadMoreRef.current()
  }, [isLoading, hasMore, enabled])
}
