// src/lib/api/category.ts
import axios from '../axios'
import { Category } from '../types'

export interface CategoriesResponse {
  categories: Category[]
}

export interface GetCategoriesParams {
  // Chỉ lấy category đang có bài đã publish (dùng cho tab lọc ở trang blog)
  inUse?: boolean
}

export const categoryApi = {
  // Get blog categories
  getCategories: async (params?: GetCategoriesParams): Promise<CategoriesResponse> => {
    const response = await axios.get<CategoriesResponse>('/blogs/categories', { params })
    return response.data
  },

  // Create a new category (any logged-in user)
  createCategory: async (name: string): Promise<{ message: string; category: Category }> => {
    const response = await axios.post<{ message: string; category: Category }>('/blogs/categories', { name })
    return response.data
  },

  // Rename a category (admin only)
  updateCategory: async (id: string, name: string): Promise<{ message: string; category: Category }> => {
    const response = await axios.put<{ message: string; category: Category }>(`/blogs/categories/${id}`, { name })
    return response.data
  },

  // Delete a category (admin, or the user who created it); blogs move to "Other"
  deleteCategory: async (id: string): Promise<{ message: string; movedBlogs: number }> => {
    const response = await axios.delete<{ message: string; movedBlogs: number }>(`/blogs/categories/${id}`)
    return response.data
  },
}
