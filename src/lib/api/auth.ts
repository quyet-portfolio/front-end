// src/lib/api/auth.ts
import axios from '../axios'
import { AuthResponse, User } from '../types'

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UpdateProfileData {
  username?: string
  email?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordData {
  token: string
  newPassword: string
  confirmPassword: string
}

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  // Login/Register with Google (ID token credential from Google Identity Services)
  googleLogin: async (credential: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/google', { credential })
    return response.data
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/refresh-token', {
      refreshToken,
    })
    return response.data
  },

  // Get current user
  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await axios.get<{ user: User }>('/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData): Promise<{ message: string; user: User }> => {
    const response = await axios.put<{ message: string; user: User }>('/auth/profile', data)
    return response.data
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>('/auth/change-password', data)
    return response.data
  },

  // Request a password reset token
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await axios.post<ForgotPasswordResponse>('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password using a reset token
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>('/auth/reset-password', data)
    return response.data
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },
}
