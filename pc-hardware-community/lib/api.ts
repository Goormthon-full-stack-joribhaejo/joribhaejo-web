import { ApiResponse, Comment, PaginatedResponse, Post, PostFilters, User } from './types'

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// API 요청 헬퍼 함수
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`)
  }

  return response.json()
}

// 포스트 관련 API
export const postApi = {
  // 포스트 목록 조회
  async getPosts(filters: PostFilters = {}): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams()

    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`

    return apiRequest<PaginatedResponse<Post>>(endpoint)
  },

  // 단일 포스트 조회
  async getPost(id: number): Promise<ApiResponse<Post>> {
    return apiRequest<ApiResponse<Post>>(`/posts/${id}`)
  },

  // 포스트 생성
  async createPost(postData: Omit<Post, 'id' | 'likes' | 'comments' | 'views' | 'timeAgo' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Post>> {
    return apiRequest<ApiResponse<Post>>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    })
  },

  // 포스트 수정
  async updatePost(id: number, postData: Partial<Post>): Promise<ApiResponse<Post>> {
    return apiRequest<ApiResponse<Post>>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    })
  },

  // 포스트 삭제
  async deletePost(id: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/posts/${id}`, {
      method: 'DELETE',
    })
  },

  // 좋아요 토글
  async toggleLike(postId: number): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> {
    return apiRequest<ApiResponse<{ liked: boolean; likesCount: number }>>(`/posts/${postId}/like`, {
      method: 'POST',
    })
  },

  // 조회수 증가
  async incrementViews(postId: number): Promise<ApiResponse<{ viewsCount: number }>> {
    return apiRequest<ApiResponse<{ viewsCount: number }>>(`/posts/${postId}/view`, {
      method: 'POST',
    })
  },
}

// 댓글 관련 API
export const commentApi = {
  // 포스트의 댓글 목록 조회
  async getComments(postId: number, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Comment>> {
    return apiRequest<PaginatedResponse<Comment>>(`/posts/${postId}/comments?page=${page}&limit=${limit}`)
  },

  // 댓글 / 대댓글 생성
  async createComment(postId: number, content: string, parentCommentId?: number): Promise<ApiResponse<Comment>> {
    return apiRequest<ApiResponse<Comment>>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentCommentId }),
    })
  },

  // 댓글 수정
  async updateComment(commentId: number, content: string): Promise<ApiResponse<Comment>> {
    return apiRequest<ApiResponse<Comment>>(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    })
  },

  // 댓글 삭제
  async deleteComment(commentId: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/comments/${commentId}`, {
      method: 'DELETE',
    })
  },

  // 댓글 좋아요 토글
  async toggleCommentLike(commentId: number): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> {
    return apiRequest<ApiResponse<{ liked: boolean; likesCount: number }>>(`/comments/${commentId}/like`, {
      method: 'POST',
    })
  },
}

// 사용자 관련 API
export const userApi = {
  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>('/user/me')
  },

  // 사용자 프로필 조회
  async getUserProfile(userId: number): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>(`/users/${userId}`)
  },

  // 사용자 포스트 목록 조회
  async getUserPosts(userId: number, page: number = 1): Promise<PaginatedResponse<Post>> {
    return apiRequest<PaginatedResponse<Post>>(`/users/${userId}/posts?page=${page}`)
  },
}

// 인증 관련 API
export const authApi = {
  // 로그인
  async login(credentials: { username: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiRequest<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // 회원가입
  async register(userData: { username: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiRequest<ApiResponse<{ token: string; user: User }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // 로그아웃
  async logout(): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>('/auth/logout', {
      method: 'POST',
    })
  },
} 