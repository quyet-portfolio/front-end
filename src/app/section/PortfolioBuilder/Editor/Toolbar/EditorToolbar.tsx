/**
 * EditorToolbar — Top bar của editor.
 * Chứa: nút back, tên portfolio, trạng thái lưu / publish, save, preview, publish.
 * (Link "View live" nằm ở trang tổng quan /portfolio-builder, không đặt ở đây.)
 * Việc lưu do useEditorSave (EditorLayout) đảm nhận; toolbar gọi `save()` và hiển thị trạng thái.
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from 'antd/es/button'
import Modal from 'antd/es/modal'
import Tooltip from 'antd/es/tooltip'
import { EyeOutlined, SaveOutlined } from '@ant-design/icons'
import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'
import { useMessageApi } from '@/src/contexts/MessageContext'
import type { SaveResult, SaveStatus } from '../useEditorSave'

interface EditorToolbarProps {
  portfolioId: string
  portfolioName?: string
  isPublished: boolean
  hasUnpublishedChanges: boolean
  saveStatus: SaveStatus
  /** Editor có thay đổi chưa lưu */
  isDirty: boolean
  /** Lưu bản hiện tại */
  save: () => Promise<SaveResult>
  onPublished: () => void
}

const SAVE_STATUS_LABEL: Record<SaveStatus, { text: string; className: string }> = {
  idle: { text: '', className: '' },
  saving: { text: '↑ Saving...', className: 'text-yellow-400' },
  saved: { text: '✓ Saved', className: 'text-green-400' },
  error: { text: '✗ Save failed', className: 'text-red-400' },
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export const EditorToolbar = ({
  portfolioId,
  portfolioName = 'My Portfolio',
  isPublished,
  hasUnpublishedChanges,
  saveStatus,
  isDirty,
  save,
  onPublished,
}: EditorToolbarProps) => {
  const router = useRouter()
  const messageApi = useMessageApi()
  const { publishPortfolio } = usePortfolioApi()
  const [isPublishing, setIsPublishing] = useState(false)

  const handleSave = async () => {
    const result = await save()
    if (!result.ok) messageApi?.error(result.error ?? 'Could not save your changes. Please try again.')
    return result.ok
  }

  // ⌘S / Ctrl+S
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        void handleSave()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const goBack = () => router.push('/portfolio-builder')

  const handleBack = () => {
    if (!isDirty) {
      goBack()
      return
    }

    const confirm = Modal.confirm({
      title: 'You have unsaved changes',
      content: 'Do you want to save your changes before leaving the editor?',
      okText: 'Save & leave',
      cancelText: 'Cancel',
      onOk: async () => {
        const ok = await handleSave()
        // Reject → modal giữ nguyên để user chọn lại
        if (!ok) return Promise.reject()
        goBack()
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <Button
            danger
            onClick={() => {
              confirm.destroy()
              goBack()
            }}
          >
            Leave without saving
          </Button>
          <OkBtn />
        </>
      ),
    })
  }

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      // Publish chụp bản đã lưu trên server → lưu thay đổi hiện tại trước
      const saved = await save()
      if (!saved.ok) {
        messageApi?.error(saved.error ?? 'Could not save your latest changes. Please try again.')
        return
      }
      await publishPortfolio(portfolioId)
      onPublished()
      // Link trang live nằm ở trang tổng quan /portfolio-builder
      messageApi?.success('Portfolio published')
    } catch (err) {
      console.error('Publish failed:', err)
      messageApi?.error('Publish failed. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const handlePreview = async () => {
    // Preview đọc bản nháp từ server → lưu trước khi load. Mở tab ngay trong
    // click handler (sau await sẽ bị popup blocker chặn), rồi mới điều hướng.
    const previewUrl = `/portfolio-builder/preview/${portfolioId}`
    const tab = window.open('', '_blank')
    const ok = await handleSave()
    if (!ok) {
      tab?.close()
      return
    }
    if (tab) tab.location.href = previewUrl
    else window.open(previewUrl, '_blank')
  }

  const status =
    saveStatus === 'idle' && isDirty
      ? { text: '● Unsaved changes', className: 'text-slate-400' }
      : SAVE_STATUS_LABEL[saveStatus]

  const publishLabel = !isPublished ? 'Publish' : hasUnpublishedChanges ? 'Publish changes' : 'Republish'

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-700/70
      shadow-lg shadow-black/30 z-50 relative"
    >
      {/* Left: Back + Name + publish state */}
      <div className="flex items-center gap-3">
        <Button type="text" onClick={handleBack}>
          ← Back
        </Button>
        <div className="w-px h-5 bg-slate-700" />
        <span className="text-sm font-semibold text-white">{portfolioName}</span>
        {isPublished && !hasUnpublishedChanges && (
          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-medium">
            Published
          </span>
        )}
        {isPublished && hasUnpublishedChanges && (
          <span
            className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium"
            title="The live page still shows the last published version"
          >
            Unpublished changes
          </span>
        )}
        {!isPublished && (
          <span className="text-xs bg-slate-700/50 text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full font-medium">
            Draft
          </span>
        )}
      </div>

      {/* Center: Save status */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className={`text-xs font-medium transition-all duration-300 ${status.className}`}>
          {status.text}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Tooltip title="Preview">
          <Button icon={<EyeOutlined />} aria-label="Preview" onClick={handlePreview} />
        </Tooltip>
        <Tooltip title={`Save (${isMac ? '⌘' : 'Ctrl+'}S)`}>
          <Button
            icon={<SaveOutlined />}
            disabled={!isDirty && saveStatus !== 'error'}
            loading={saveStatus === 'saving'}
            onClick={() => void handleSave()}
          >
            Save
          </Button>
        </Tooltip>
        <Button type="primary" loading={isPublishing} onClick={handlePublish}>
          {isPublishing ? 'Publishing...' : publishLabel}
        </Button>
      </div>
    </div>
  )
}
