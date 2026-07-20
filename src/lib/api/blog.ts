// src/lib/api/blog.ts
import axios from '../axios'
import { Blog, BlogContentFormat, BlogsResponse } from '../types'

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

export const blogApi = {
  // Get all published blogs with filters
  getBlogs: async (params?: GetBlogsParams): Promise<BlogsResponse> => {
    const response = await axios.get<BlogsResponse>('/blogs', { params })
    return response.data
  },

  // Get featured blogs shown on the BlogHeading carousel (max 3)
  getFeaturedBlogs: async (): Promise<{ blogs: Blog[] }> => {
    const response = await axios.get<{ blogs: Blog[] }>('/blogs/featured')
    return response.data
  },

  // Get current user's blogs
  getMyBlogs: async (params?: { page?: number; limit?: number }): Promise<BlogsResponse> => {
    const response = await axios.get<BlogsResponse>('/blogs/my', { params })
    return response.data
  },

  // Get single blog by slug
  getBlogBySlug: async (slug: string): Promise<{ blog: Blog }> => {
    const response = await axios.get<{ blog: Blog }>(`/blogs/${slug}`)
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
