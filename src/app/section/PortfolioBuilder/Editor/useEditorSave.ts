/**
 * useEditorSave — Lưu THỦ CÔNG craftJson của editor (bản nháp).
 *
 * - Nối vào `<Editor onNodesChange>`: Craft chỉ gọi khi JSON serialize thay đổi
 *   (hover / select không tính). So với bản đã lưu → biết có thay đổi chưa lưu
 *   (`isDirty`); undo về đúng bản đã lưu thì hết dirty.
 * - `setBaseline()` ghi nhận trạng thái ngay sau khi editor load (gọi trong
 *   effect của component con của <Editor>) — để thay đổi "giả" lúc khởi tạo
 *   không bị tính là chưa lưu.
 * - `save()` lưu bản mới nhất; request tuần tự, không ghi đè ngược thứ tự.
 * - Còn thay đổi chưa lưu mà đóng tab / reload → trình duyệt hỏi xác nhận.
 */
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface SaveResult {
  ok: boolean
  /** Thông báo lỗi từ server (nếu có) */
  error?: string
}

const SAVED_LABEL_MS = 2500

export function useEditorSave(portfolioId: string, onSaved?: () => void) {
  const { saveLayout } = usePortfolioApi()
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [isDirty, setIsDirty] = useState(false)

  /** JSON đã lưu gần nhất (hoặc baseline lúc load) */
  const savedRef = useRef<string | null>(null)
  /** JSON hiện tại của editor */
  const currentRef = useRef<string | null>(null)
  const inflightRef = useRef<Promise<void> | null>(null)
  const savedLabelRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSavedRef = useRef(onSaved)

  useEffect(() => {
    onSavedRef.current = onSaved
  }, [onSaved])

  const setBaseline = useCallback((json: string) => {
    savedRef.current = json
    currentRef.current = json
    setIsDirty(false)
  }, [])

  /** Handler cho `<Editor onNodesChange>` — phải ổn định (Craft chỉ đọc option này 1 lần). */
  const handleNodesChange = useCallback((query: { serialize: () => string }) => {
    const json = query.serialize()
    currentRef.current = json
    setIsDirty(savedRef.current === null || json !== savedRef.current)
  }, [])

  /**
   * Lưu bản hiện tại. `ok: true` khi không còn thay đổi chưa lưu; khi server từ
   * chối (vd link không hợp lệ) `error` là thông báo của server để hiển thị cho user.
   */
  const save = useCallback(async (): Promise<SaveResult> => {
    // Chờ request đang chạy (vòng lặp: có thể có caller khác chen vào)
    while (inflightRef.current) await inflightRef.current

    // Lặp: nếu user sửa tiếp trong lúc đang lưu thì lưu luôn bản mới
    for (;;) {
      const json = currentRef.current
      if (json === null || json === savedRef.current) return { ok: true }

      setStatus('saving')
      let error: string | undefined
      let ok = true
      const run = (async () => {
        try {
          await saveLayout(portfolioId, JSON.parse(json))
          savedRef.current = json
          onSavedRef.current?.()
        } catch (err: any) {
          ok = false
          error = err?.response?.data?.message
        }
      })()

      inflightRef.current = run
      await run
      inflightRef.current = null

      setIsDirty(currentRef.current !== savedRef.current)

      if (!ok) {
        setStatus('error')
        return { ok: false, error }
      }
      if (currentRef.current !== savedRef.current) continue

      setStatus('saved')
      if (savedLabelRef.current) clearTimeout(savedLabelRef.current)
      savedLabelRef.current = setTimeout(
        () => setStatus((s) => (s === 'saved' ? 'idle' : s)),
        SAVED_LABEL_MS
      )
      return { ok: true }
    }
  }, [portfolioId, saveLayout])

  // Đóng tab / reload khi còn thay đổi chưa lưu → hộp thoại xác nhận của trình duyệt
  useEffect(() => {
    if (!isDirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = '' // Chrome/Safari cần returnValue để hiện hộp thoại
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  useEffect(
    () => () => {
      if (savedLabelRef.current) clearTimeout(savedLabelRef.current)
    },
    []
  )

  return { status, isDirty, save, setBaseline, handleNodesChange }
}
