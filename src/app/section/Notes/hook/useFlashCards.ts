'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { FlashCard, FlashCardPaginationResponse } from '../types'
import { flashcardApi, GetFlashCardsParams } from '@/src/lib/api/notes'

interface UseFlashCardsParams extends GetFlashCardsParams {
  /** Đổi giá trị này để ép nạp lại với cùng bộ tham số. */
  refreshToken?: number
}

export const useFlashCards = ({
  page,
  limit,
  search,
  createdBy,
  refreshToken = 0,
}: UseFlashCardsParams) => {
  const [flashcards, setFlashCards] = useState<FlashCard[]>([])
  const [pagination, setPagination] = useState<FlashCardPaginationResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadIndex, setReloadIndex] = useState(0)

  const refetch = useCallback(() => setReloadIndex((i) => i + 1), [])

  useEffect(() => {
    // Gõ nhanh trong ô search sinh nhiều request chồng nhau. Không huỷ request cũ
    // thì response về sau — có thể là của từ khoá đã bị xoá — ghi đè lên kết quả
    // mới, và danh sách hiển thị sai so với ô tìm kiếm.
    const controller = new AbortController()

    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await flashcardApi.getFlashCards(
          { page, limit, search, createdBy },
          controller.signal,
        )
        setFlashCards(data.flashcards)
        setPagination(data.pagination)
      } catch (err: any) {
        // Request bị huỷ không phải lỗi — đừng nhá thông báo đỏ lên màn hình.
        if (axios.isCancel(err) || err?.code === 'ERR_CANCELED') return
        setError(err?.response?.data?.message || 'Failed to fetch flashcards')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    run()

    return () => controller.abort()
    // Deps là các giá trị nguyên thuỷ thay vì JSON.stringify(params): đối tượng
    // params được tạo mới mỗi lần render nên phải serialise mới so sánh được,
    // và eslint không kiểm tra tĩnh được biểu thức đó.
  }, [page, limit, search, createdBy, refreshToken, reloadIndex])

  return { flashcards, pagination, loading, error, refetch }
}
