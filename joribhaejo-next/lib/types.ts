export enum Category {
  WEB = "WEB",
  MOBILE = "MOBILE",
  BACK = "BACK",
  HARD = "HARD",
  AI = "AI",
  NETWORK = "NETWORK",
  SECURITY = "SECURITY",
  DEVOPS = "DEVOPS",
  ETC = "ETC"
}

export type ActiveSection = "forum" | "qa" | "study" | "activity" | "news";

export type UserRole = "guest" | "member";

export interface PostCreateRequest {
  boardId: number;
  title: string;
  content: string;
  category: Category;
}

export interface Post {
  id: number
  title: string
  content: string
  author: string
  avatar?: string
  category: Category
  likeCount: number
  comments: number
  viewCount: number
  timeAgo: string
  isPinned: boolean
  hashtags: string[]
  rating?: number
  createdAt: string
  updatedAt: string
  boardId: number
}

export interface Comment {
  id: number
  postId: number
  author: string
  avatar?: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  username: string
  avatar?: string
  role: "guest" | "member" | "admin"
  joinDate: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  message: string
  success: boolean
}

export interface PostFilters {
  search?: string
  page?: number
  size?: number;
  category?: Category
}

export interface Board {
  id: number;
  name: string;
  description: string;
}