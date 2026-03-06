import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export interface GeneratePostRequest {
  topic: string
}

export interface Post {
  postId: string
  topic: string
  caption: string
  image: string
  imageUrl?: string // từ response generate
  platform: string
  status: 'pending_review' | 'approved' | 'posted' | 'rejected'
  postedUrl?: string
  createdAt: string
  postedAt?: string
}

export interface GenerateSocialPostResponse {
  success: boolean
  data: Post
}

export interface UpdatePostRequest {
  caption?: string
  image?: string
  platform?: string
}

export interface MarkAsPostedRequest {
  postId: string
  platform: string
  postedUrl?: string
}

export const socialApi = {
  // Tạo bài mới với AI
  generatePost: async (data: GeneratePostRequest): Promise<GenerateSocialPostResponse> => {
    const response = await api.post('/social/generate', data)
    return response.data
  },

  // Lấy danh sách posts
  getPosts: async (status?: string): Promise<{ success: boolean; data: Post[] }> => {
    const params = status ? { status } : {}
    const response = await api.get('/social/posts', { params })
    return response.data
  },

  // Lấy chi tiết 1 post
  getPost: async (id: string): Promise<{ success: boolean; data: Post }> => {
    const response = await api.get(`/social/posts/${id}`)
    return response.data
  },

  // Cập nhật post
  updatePost: async (id: string, data: UpdatePostRequest): Promise<{ success: boolean; data: Post }> => {
    const response = await api.put(`/social/posts/${id}`, data)
    return response.data
  },

  // Đánh dấu đã đăng
  markAsPosted: async (data: MarkAsPostedRequest): Promise<{ success: boolean; data: Post }> => {
    const response = await api.post('/social/posts/mark-posted', data)
    return response.data
  },
}