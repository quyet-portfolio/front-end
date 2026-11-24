/**
 * BuilderUserHeader — Thanh đầu trang tổng quan Portfolio Builder:
 * tên tính năng (trái) + thông tin tài khoản đang đăng nhập (phải).
 */
'use client'

import Avatar from 'antd/es/avatar'
import { useAuth } from '@/src/contexts/AuthContext'

export const BuilderUserHeader = () => {
  const { user } = useAuth()
  if (!user) return null

  const displayName = user.name || user.username
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="flex items-center justify-between gap-4 py-6">
      <p className="text-sm font-semibold tracking-wide text-slate-400">
        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Portfolio
        </span>{' '}
        Builder
      </p>

      <div className="flex items-center gap-3 min-w-0">
        <div className="text-right min-w-0 hidden sm:block">
          <p className="text-sm font-semibold text-white truncate">{displayName}</p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
        <Avatar
          size={40}
          src={user.avatar || undefined}
          alt={displayName}
          className="flex-shrink-0 bg-indigo-500 font-semibold"
        >
          {initial}
        </Avatar>
      </div>
    </header>
  )
}
