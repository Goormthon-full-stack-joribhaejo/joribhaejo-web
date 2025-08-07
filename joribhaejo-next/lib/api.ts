import { Post, Message, Comment, User, ApiResponse, PaginatedResponse, PostFilters, Board, PostCreateRequest } from './types'

// API 기본 설정
const API_BASE_URL = 'http://jorib.mobidic.shop/api'

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
    this.name = 'ApiError'
  }
}

// API 요청 헬퍼 함수
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  isMemberOnly: boolean = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if(isMemberOnly){  
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
  }

  const config: RequestInit = {
    headers,
    ...options,
  }

  const response = await fetch(url, config)
  console.log(`API Request to ${url} with config:`, config);
  console.log('API Response status:', response.status);
  
  let responseData: any;
  try {
    // 응답이 JSON 형식인지 확인하고 파싱
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      // JSON이 아니면 텍스트로 읽기
      responseData = await response.text();
    }
  } catch (e) {
    console.warn("Failed to parse response as JSON or text:", e);
    responseData = null; // 파싱 실패 시 null로 설정
  }
  console.log('API Response data:', responseData);
  
  if (!response.ok) {
    let errorMessage = `API request failed: ${response.statusText}`;
    let errorData: any = null;

    if (typeof responseData === 'object' && responseData !== null && responseData.message) {
      errorMessage = responseData.message;
      errorData = responseData;
    } else if (typeof responseData === 'string' && responseData.length > 0) {
      errorMessage = responseData;
      errorData = responseData;
    }
    throw new ApiError(response.status, errorMessage, errorData);
  }

  return responseData;
}

// 게시판 관련 API
export const boardApi = {
  async getBoards(): Promise<Board[]> {
    return apiRequest<Board[]>('/boards');
  },
};

// 포스트 관련 API
export const postApi = {
  // 포스트 목록 조회
  async getPosts(filters: {
    boardId: number;
    search?: string;
    page?: number;
    size?: number;
    category?: Category;
  }): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams()
    
    params.append('boardId', filters.boardId.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.size) params.append('size', filters.size.toString())
    if (filters.category) params.append('category', filters.category)

    const queryString = params.toString()
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`
    
    return apiRequest<PaginatedResponse<Post>>(endpoint)
  },

  // 단일 포스트 조회
  async getPost(id: number): Promise<ApiResponse<Post>> {
    return apiRequest<ApiResponse<Post>>(`/posts/${id}`)
  },

  // 포스트 생성
  async createPost(postData: PostCreateRequest): Promise<ApiResponse<Post>> {
    return apiRequest<ApiResponse<Post>>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }, true) // 인증 필요
  },

  // 포스트 수정
  async updatePost(postId: number, postData: Partial<Post>): Promise<ApiResponse<Post>> {
    return apiRequest<ApiResponse<Post>>(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }, true) // 인증 필요)
  },

  // 포스트 삭제
  async deletePost(id: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/posts/${id}`, {
      method: 'DELETE',
    }, true)
  },

  // 게시글 좋아요 토글
  async togglePostLike(postId: number): Promise<ApiResponse<{ liked: boolean; likeCount: number }>> {
    return apiRequest<ApiResponse<{ liked: boolean; likeCount: number }>>(`/likes/${postId}/posts`, {
      method: 'POST',
    }, true)
  },
}

// 댓글 관련 API
export const commentApi = {
  // 댓글 좋아요 토글
  async toggleCommentLike(commentId: number): Promise<ApiResponse<{ liked: boolean; likeCount: number }>> {
    return apiRequest<ApiResponse<{ liked: boolean; likeCount: number }>>(`/likes/${commentId}/comments`, {
      method: 'POST',
    }, true)
  },

  // 포스트의 댓글 목록 조회
  async getComments(postId: number): Promise<Comment[]> {
    return apiRequest<Comment[]>(`/posts/${postId}/comments`)
  },

  // 댓글 생성
  async createComment(postId: number, content: string, parentCommentId?: number): Promise<string> {
    return apiRequest<string>(`/comments/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ content, parentCommentId }),
    }, true)
  },

  // 댓글 수정
  async updateComment(commentId: number, content: string): Promise<string> {
    return apiRequest<string>(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }, true)
  },

  // 댓글 삭제
  async deleteComment(commentId: number): Promise<string> {
    return apiRequest<string>(`/comments/${commentId}`, {
      method: 'DELETE',
    }, true)
  },
}


// 쪽지 관련 API
export const messageApi = {
  // 받은 쪽지 목록 조회
  async getInboxMessages(): Promise<Message[]> {
    return apiRequest<Message[]>('/messages/inbox', {
      method: 'GET',
    }, true)
  },
  
  // 보낸 쪽지 목록 조회
  async getSentMessages(): Promise<Message[]> {
    return apiRequest<Message[]>('/messages/sent', {
      method: 'GET',
    }, true)
  },

  // 쪽지 보내기
  async sendMessage(receiverUsername: string, content: string): Promise<Message> {
    return apiRequest<Message>(`/messages/${receiverUsername}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }, true)
  },

  // 쪽지 삭제
  async deleteMessage(messageId: number): Promise<void> {
    return apiRequest<void>(`/messages/${messageId}`, {
      method: 'DELETE',
    }, true)
  }
}

// 사용자 관련 API
export const userApi = {
  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('/users/me', {}, true) // 인증 필요
  },

  // 사용자 프로필 조회
  async getUserProfile(userId: number): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>(`/users/${userId}`, {}, true) // 인증 필요
  },

  // 사용자 포스트 목록 조회
  async getUserPosts(userId: number, page: number = 1): Promise<PaginatedResponse<Post>> {
    return apiRequest<PaginatedResponse<Post>>(`/users/${userId}/posts?page=${page}`, {}, true) // 인증 필요
  },

  // 사용자가 좋아요 누른 게시글 ID 목록 조회
  async getLikedPostIds(): Promise<number[]> {
    return apiRequest<number[]>('/users/me/liked-post-ids', {}, true); // 인증 필요
  },
}

// 인증 관련 API
export const authApi = {
  // 로그인
  async login(credentials: { username: string; password: string }): Promise<{ id: number; accessToken: string }> {
    return apiRequest<{ id: number; accessToken: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // 회원가입
  async register(userData: { username: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiRequest<ApiResponse<{ token: string; user: User }>>('/users/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // 로그아웃
  async logout(): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>('/auth/logout', {
      method: 'POST',
    }, true) // 인증 필요
  },
} 