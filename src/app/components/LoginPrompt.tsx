// src/components/LoginPrompt.tsx
'use client'

import { useAuth } from '@/src/contexts/AuthContext'
import Link from 'next/link'

interface LoginPromptProps {
  message?: string
  showClose?: boolean
  onClose?: () => void
}

export function LoginPrompt({
  message = 'Đăng nhập để trải nghiệm đầy đủ tính năng',
  showClose = false,
  onClose,
}: LoginPromptProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-blue-800 mb-2">{message}</p>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600">
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="text-sm bg-white text-blue-500 border border-blue-500 px-4 py-1.5 rounded hover:bg-blue-50"
            >
              Đăng ký
            </Link>
          </div>
        </div>
        {showClose && (
          <button onClick={onClose} className="text-blue-400 hover:text-blue-600 ml-4">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
