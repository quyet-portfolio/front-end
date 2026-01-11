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
            const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user')

      if (accessToken && refreshToken && storedUser) {
        try {
          // Verify token is still valid
          const { user: currentUser } = await authApi.getCurrentUser()
          setUser(currentUser)
          localStorage.setItem('user', JSON.stringify(currentUser))
        } catch (error: any) {
          // Access token expired, try refresh
          if (error.response?.data?.code === 'TOKEN_EXPIRED') {
            try {
              const response = await authApi.refreshToken(refreshToken);
              localStorage.setItem('accessToken', response.accessToken);
              if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
              }
              setUser(response.user);
              localStorage.setItem('user', JSON.stringify(response.user));
            } catch (refreshError) {
              // Refresh cũng fail → Clear và logout
              localStorage.clear();
            }
          } else {
            localStorage.clear();
          }
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token')
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
