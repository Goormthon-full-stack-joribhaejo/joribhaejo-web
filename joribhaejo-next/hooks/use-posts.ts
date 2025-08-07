import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postApi, commentApi } from '@/lib/api'
import { Post, Comment, PostFilters, Category } from '@/lib/types'

// 포스트 목록 조회 훅
export function usePosts(filters: {
  boardId: number;
  search?: string;
  page?: number;
  size?: number;
  category?: Category;
}) {
  return useQuery({
    queryKey: ['posts', filters.boardId, filters.search, filters.page, filters.size, filters.category],
    queryFn: () => {
      console.log('Refetching posts with filters:', filters);
      return postApi.getPosts(filters);
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!filters.boardId, // boardId가 있을 때만 쿼리를 실행합니다.
  })
}

// 단일 포스트 조회 훅
export function usePost(postId: number) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => {
      console.log('Refetching single post with ID:', postId);
      return postApi.getPost(postId);
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2분
  })
}

// 포스트 생성 훅
export function useCreatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      // 포스트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// 포스트 수정 훅
export function useUpdatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { title: string; content: string } }) => 
      postApi.updatePost(id, data),
        onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  })
}

// 포스트 삭제 훅
export function useDeletePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: postApi.deletePost,
    onSuccess: () => {
      // 포스트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// 좋아요 토글 훅
export function useTogglePostLike() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (postId: number) => {
      console.log('Calling togglePostLike API for postId:', postId);
      return postApi.togglePostLike(postId);
    },
    onSuccess: (data, postId) => {
      console.log('togglePostLike onSuccess triggered for postId:', postId, 'data:', data);
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['likedPostIds'] });
    },
    onError: (error, postId) => {
      console.error('togglePostLike onError triggered for postId:', postId, 'error:', error);
      // Optionally show a toast or error message to the user
      // toast({
      //   title: "좋아요 처리 실패",
      //   description: "좋아요 처리 중 오류가 발생했습니다.",
      //   variant: "destructive",
      // });
    },
  })
}

// 댓글 목록 조회 훅
export function useComments(postId: number) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentApi.getComments(postId),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2분
  })
}

// 댓글 생성 훅
export function useCreateComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ postId, content, parentCommentId }: { postId: number; content: string; parentCommentId?: number }) =>
      commentApi.createComment(postId, content, parentCommentId),
    onSuccess: (_, { postId }) => {
      // 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}

// 댓글 수정 훅
export function useUpdateComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      commentApi.updateComment(commentId, content),
    onSuccess: (_, { commentId }) => {
      // 댓글 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

// 댓글 삭제 훅
export function useDeleteComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: commentApi.deleteComment,
    onSuccess: (_, commentId) => {
      // 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

// 댓글 좋아요 토글 훅
export function useToggleCommentLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: commentApi.toggleCommentLike,
    onSuccess: (_, commentId) => {
      // 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
} 