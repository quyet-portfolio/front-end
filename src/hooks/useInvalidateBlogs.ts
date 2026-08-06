'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { blogKeys } from '../lib/queryKeys'

/**
 * Dọn cache sau khi tạo/sửa/xoá bài.
 *
 * Bắt buộc phải gọi: danh sách blog được cache và hiển thị ngay khi vào lại
 * /blogs, nên nếu không đánh dấu cũ thì người dùng sẽ thấy đúng bản danh sách
 * trước khi họ vừa thay đổi.
 */
export const useInvalidateBlogs = () => {
  const queryClient = useQueryClient()

  return useCallback(
    (slugs: string | string[] = []) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogKeys.featured() })

      // Xoá hẳn thay vì invalidate: trang chi tiết cộng views mỗi lần GET, không
      // nên refetch nền cho bài mà người dùng đang không xem.
      const list = Array.isArray(slugs) ? slugs : [slugs]
      list.filter(Boolean).forEach((slug) => {
        queryClient.removeQueries({ queryKey: blogKeys.detail(slug) })
      })
    },
    [queryClient]
  )
}
