export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  tags: string[];
  category: string;
  featuredImage: string;
  isPublished: boolean;
  publishedAt: string;
  views: number;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogsResponse {
  blogs: Blog[];
  pagination: PaginationResponse;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string; 
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
}