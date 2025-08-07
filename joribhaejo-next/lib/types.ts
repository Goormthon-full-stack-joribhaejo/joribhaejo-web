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
  authorId: number
  category: Category
  likeCount: number
  comments: number
  viewCount: number
  timeAgo: string
  createdAt: string
  updatedAt: string
  boardId: number
}

export interface Comment {
  id: number
  postId: number
  authorId: number
  authorName: string
  parentCommentId?: number
  content: string
  likeCount: number
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
  content: T[]
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

export interface Message {
    id: number;
    senderId: number;
    senderUsername: string;
    receiverId: number;
    receiverUsername: string;
    content: string;
    createdAt: string;
}