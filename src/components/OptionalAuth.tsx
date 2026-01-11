// src/components/OptionalAuth.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'
import { Button, Modal } from 'antd'
import { useRouter } from 'next/navigation'

interface OptionalAuthProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  showLoginPrompt?: boolean
}

/**
 * Component cho trang có thể xem mà không cần đăng nhập
 * Nhưng hiện thêm tính năng khi đã đăng nhập
 */
export default function OptionalAuth({ children, fallback, showLoginPrompt = false }: OptionalAuthProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    )
  }

  // Nếu chưa đăng nhập và có fallback component
  if (!isAuthenticated && fallback) {
    return <>{fallback}</>
  }

  // Nếu chưa đăng nhập và muốn hiện login prompt
  if (!isAuthenticated && showLoginPrompt) {
    return (
      <Modal
        title="Access denied !!"
        open={true}
        centered
        closable={false}
        footer={
          <div className="flex justify-end gap-4">
            <Button onClick={() => router.push('/notes')}>Cancel</Button>
            <Button type="primary" onClick={() => router.push('/login')}>
              Log in now
            </Button>
          </div>
        }
      >
        Log in to create a note.
      </Modal>
    )
  }

  // Nếu đã đăng nhập, hiển thị children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Mặc định không hiện gì nếu chưa đăng nhập
  return null
}
