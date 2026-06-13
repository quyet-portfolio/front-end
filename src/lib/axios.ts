// src/lib/axios.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag để tránh infinite loop
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  failedQueue = []
}

// Xóa auth state và báo cho app (AuthContext) qua event — KHÔNG hard redirect.
// ProtectedRoute sẽ tự quyết định trang hiện tại có cần đẩy sang /login hay không,
// nên các trang public (home, blogs...) không bị đá đi khi token cũ không hợp lệ.
const forceLogout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:logout'))
  }
}

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config
    const isUnauthorized = error.response?.status === 401

    // Chỉ xử lý 401. Bỏ qua nếu:
    // - không có config (lỗi network/timeout)
    // - request này đã thử refresh rồi (_retry) → tránh loop vô hạn
    // - request chủ động opt-out refresh (skipAuthRefresh), vd login/register
    if (!isUnauthorized || !originalRequest || originalRequest._retry || originalRequest.skipAuthRefresh) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('refreshToken')

    // Không có refresh token → đăng xuất im lặng (không hard redirect)
    if (!refreshToken) {
      forceLogout()
      return Promise.reject(error)
    }

    // Đang refresh → xếp request vào queue, retry sau khi có token mới
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => axiosInstance(originalRequest))
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // Thử refresh với MỌI loại 401 (hết hạn hoặc token không hợp lệ),
      // miễn là còn refresh token hợp lệ — không chỉ riêng TOKEN_EXPIRED.
      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
        refreshToken,
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data

      // Lưu token mới
      localStorage.setItem('accessToken', accessToken)
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken)
      }

      // Update header cho request ban đầu
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
      }

      processQueue()
      isRefreshing = false

      // Retry request ban đầu (request interceptor sẽ tự gắn token mới)
      return axiosInstance(originalRequest)
    } catch (refreshError) {
      // Refresh cũng fail → đăng xuất im lặng (không hard redirect)
      processQueue(refreshError)
      isRefreshing = false
      forceLogout()
      return Promise.reject(refreshError)
    }
  },
)

export default axiosInstance
