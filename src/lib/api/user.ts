import axios from '../axios'
import { User } from '../types'

export interface UserPaginationResponse {
  currentPage: number
  totalPages: number
  totalUsers: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface UsersResponse {
  users: User[]
  pagination: UserPaginationResponse
}

export interface UserProfile {
  user: User & {
    totalBlogs: number
    totalViews: number
    totalLikes: number
  }
  recentBlogs: Array<{
    _id: string
    title: string
    slug: string
    excerpt: string
    publishedAt: string
    views: number
    likes: string[]
  }>
}

export const userApi = {
  // Get all users (admin only)
  getUsers: async (params?: { page?: number; limit?: number }): Promise<UsersResponse> => {
    const response = await axios.get<UsersResponse>('/users', { params })
    return response.data
  },

  // Get user profile by ID
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    const response = await axios.get<UserProfile>(`/users/${userId}`)
    return response.data
  },

  // Update user role (admin only)
  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<{ message: string; user: User }> => {
    const response = await axios.put<{ message: string; user: User }>(`/users/${userId}/role`, { role })
    return response.data
  },

  // Update user status (admin only)
  updateUserStatus: async (userId: string, isActive: boolean): Promise<{ message: string; user: User }> => {
    const response = await axios.put<{ message: string; user: User }>(`/users/${userId}/status`, { isActive })
    return response.data
  },

  // Delete user (admin only)
  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(`/users/${userId}`)
    return response.data
  },
}
