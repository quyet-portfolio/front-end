export interface User {
  _id: string;
  username: string;
  name?: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BlogContentFormat = 'html' | 'markdown';

export interface Blog {
  _id: string;
  title: string;
  content: string;
  // Định dạng nội dung — bài cũ không có field này coi như 'html'
  contentFormat?: BlogContentFormat;
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
  isFeatured?: boolean;
  featuredAt?: string;
  publishedAt: string;
  views: number;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

// Danh sách blog không trả về `content` (nặng, không dùng để render card).
// Khai báo tường minh để compiler chỉ ra chỗ nào còn đọc nhầm field này.
export type BlogListItem = Omit<Blog, 'content' | 'author'> & {
  content?: string;
  author?: Blog['author'];
};

export type BlogStatusFilter = 'all' | 'published' | 'draft';

export interface MyBlogsPagination {
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
  // Chỉ có ở request khởi tạo feed (không kèm cursor)
  totalBlogs?: number;
}

export interface MyBlogsResponse {
  blogs: BlogListItem[];
  pagination: MyBlogsPagination;
}

export interface BlogArchiveYear {
  year: number;
  count: number;
  // Mốc thời gian bài mới nhất của năm — dùng làm tham số `before` khi nhảy năm
  latestCreatedAt: string;
}

export interface BlogArchiveResponse {
  timezone: string;
  total: number;
  years: BlogArchiveYear[];
}

export interface Category {
  _id: string;
  name: string;
  // Category mặc định của hệ thống — không cho sửa/xoá
  isDefault: boolean;
  createdBy?: string;
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

export interface GenerateSocialPostRequest {
  topic: string;
}

export interface GenerateSocialPostResponse {
  caption: string;
  image: string;
}