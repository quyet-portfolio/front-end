// src/lib/api/blog.ts
import axios from '../axios'
import {
  Blog,
  BlogArchiveResponse,
  BlogContentFormat,
  BlogsResponse,
  BlogStatusFilter,
  MyBlogsResponse,
} from '../types'

export interface CreateBlogData {
  title: string
  slug: string
  content: string
  contentFormat?: BlogContentFormat
  excerpt?: string
  category?: string
  tags?: string[]
  featuredImage?: string
  isPublished?: boolean
  isFeatured?: boolean
}

export interface UpdateBlogData {
  title?: string
  slug?: string
  content?: string
  contentFormat?: BlogContentFormat
  excerpt?: string
  category?: string
  tags?: string[]
  featuredImage?: string
  isPublished?: boolean
  isFeatured?: boolean
}

export interface GetBlogsParams {
  page?: number
  limit?: number
  category?: string
  tag?: string
  author?: string
  search?: string
  excludeFeatured?: boolean
}

export interface GetMyBlogsParams {
  limit?: number
  status?: BlogStatusFilter
  // Trang kế tiếp khi cuộn
  cursor?: string
  // Neo feed tại một mốc thời gian (nhảy năm). Loại trừ với `cursor`.
  before?: string
}

export interface GetMyBlogsArchiveParams {
  status?: BlogStatusFilter
  // Timezone của trình duyệt — server phải gom nhóm theo đúng lịch local của client
  tz?: string
}

export const blogApi = {
  // Get all published blogs with filters.
  // `signal` để react-query huỷ request cũ khi user đổi trang/bộ lọc liên tục —
  // thiếu nó, response về trễ có thể ghi đè kết quả mới hơn.
  getBlogs: async (params?: GetBlogsParams, signal?: AbortSignal): Promise<BlogsResponse> => {
    const response = await axios.get<BlogsResponse>('/blogs', { params, signal })
    return response.data
  },

  // Get featured blogs shown on the BlogHeading carousel (max 3)
  getFeaturedBlogs: async (signal?: AbortSignal): Promise<{ blogs: Blog[] }> => {
    const response = await axios.get<{ blogs: Blog[] }>('/blogs/featured', { signal })
    return response.data
  },

  // Get current user's blogs — keyset pagination cho timeline infinite scroll
  getMyBlogs: async (params?: GetMyBlogsParams): Promise<MyBlogsResponse> => {
    const response = await axios.get<MyBlogsResponse>('/blogs/my', { params })
    return response.data
  },

  // Số bài theo năm — nguồn dữ liệu cho rail nhảy năm của timeline
  getMyBlogsArchive: async (params?: GetMyBlogsArchiveParams): Promise<BlogArchiveResponse> => {
    const response = await axios.get<BlogArchiveResponse>('/blogs/my/archive', { params })
    return response.data
  },

  // Get single blog by slug
  getBlogBySlug: async (slug: string, signal?: AbortSignal): Promise<{ blog: Blog }> => {
    const response = await axios.get<{ blog: Blog }>(`/blogs/${slug}`, { signal })
    return response.data
  },

  // Create new blog
  createBlog: async (data: CreateBlogData): Promise<{ message: string; blog: Blog }> => {
    const response = await axios.post<{ message: string; blog: Blog }>('/blogs', data)
    return response.data
  },

  // Update blog
  updateBlog: async (id: string, data: UpdateBlogData): Promise<{ message: string; blog: Blog }> => {
    const response = await axios.put<{ message: string; blog: Blog }>(`/blogs/${id}`, data)
    return response.data
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(`/blogs/${id}`)
    return response.data
  },

  // Like/unlike blog
  likeBlog: async (id: string): Promise<{ message: string; likesCount: number; isLiked: boolean }> => {
    const response = await axios.post<{ message: string; likesCount: number; isLiked: boolean }>(`/blogs/${id}/like`)
    return response.data
  },
}
