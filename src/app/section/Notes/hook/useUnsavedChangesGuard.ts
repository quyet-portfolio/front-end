'use client'

import { useCallback, useEffect } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import React from 'react'

interface UseUnsavedChangesGuardOptions {
  /** Form có thay đổi chưa lưu hay không. */
  isDirty: boolean
}

/**
 * Chặn việc rời form khi còn thay đổi chưa lưu.
 *
 * Trước đây bấm Cancel hay nút back là mất trắng mọi thứ vừa gõ, không hỏi han gì —
 * với form có thể chứa hàng trăm term thì đó là một cú mất dữ liệu thật sự.
 *
 * Hai lớp: `beforeunload` lo việc đóng tab / F5, còn `confirmLeave` lo điều hướng
 * trong app (router của Next không chạy qua beforeunload).
 */
export const useUnsavedChangesGuard = ({ isDirty }: UseUnsavedChangesGuardOptions) => {
  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      // Trình duyệt hiện đại bỏ qua nội dung tuỳ biến và tự hiện câu mặc định,
      // nhưng vẫn cần gán returnValue thì hộp thoại mới bật lên.
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const confirmLeave = useCallback(
    (onLeave: () => void) => {
      if (!isDirty) {
        onLeave()
        return
      }

      Modal.confirm({
        title: 'Discard unsaved changes?',
        icon: React.createElement(ExclamationCircleOutlined),
        content: 'Everything you have typed on this page will be lost.',
        okText: 'Discard',
        okButtonProps: { danger: true },
        cancelText: 'Keep editing',
        centered: true,
        onOk: onLeave,
      })
    },
    [isDirty],
  )

  return { confirmLeave }
}
