// src/contexts/AuthContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../lib/types'
import { authApi } from '../lib/api/auth'
import { useMessageApi } from './MessageContext'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void
  updateUser: (user: User) => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const messageApi = useMessageApi();

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('user')

      // Chưa từng đăng nhập → không gọi API, render trạng thái khách
      if (!accessToken || !refreshToken || !storedUser) {
        setLoading(false)
        return
      }

      try {
        // Axios interceptor tự refresh khi access token hết hạn / không hợp lệ.
        // Ở đây chỉ cần verify, không xử lý refresh thủ công nữa.
        const { user: currentUser } = await authApi.getCurrentUser()
        setUser(currentUser)
        localStorage.setItem('user', JSON.stringify(currentUser))
      } catch (error) {
        // Token không thể khôi phục (refresh cũng fail) → đăng xuất im lặng.
        // KHÔNG redirect — trang public vẫn hiển thị bình thường.
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Đồng bộ React state khi interceptor buộc đăng xuất (refresh token hết hạn).
    // ProtectedRoute sẽ tự đẩy sang /login nếu trang hiện tại cần auth.
    const handleForcedLogout = () => setUser(null)
    window.addEventListener('auth:logout', handleForcedLogout)
    return () => window.removeEventListener('auth:logout', handleForcedLogout)
  }, [])

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    messageApi?.success("Logout successfully!")
    // window.location.href = '/blogs'
  }

  const updateUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
