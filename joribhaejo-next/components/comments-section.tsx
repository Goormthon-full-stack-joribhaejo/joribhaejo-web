// components/comments-section.tsx
"use client"

import { useComments, useCreateComment, useToggleCommentLike, useUpdateComment, useDeleteComment } from "@/hooks/use-posts"
import { useCurrentUser } from "@/hooks/use-auth" // Assuming this hook provides current user info
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { ThumbsUp, Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Comment } from "@/lib/types"

interface CommentsSectionProps {
  postId: number
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [commentContent, setCommentContent] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState("")

  const { data: comments, isLoading, isError } = useComments(postId)
  const createCommentMutation = useCreateComment()
  const toggleCommentLikeMutation = useToggleCommentLike()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const { data: currentUser } = useCurrentUser()

  const handleCommentSubmit = () => {
    if (!commentContent.trim()) {
      toast({
        title: "댓글 내용 없음",
        description: "댓글 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    createCommentMutation.mutate(
      { postId, content: commentContent },
      {
        onSuccess: () => {
          setCommentContent("")
          toast({
            title: "댓글 작성 완료",
            description: "댓글이 성공적으로 작성되었습니다.",
          })
        },
        onError: (error) => {
          toast({
            title: "댓글 작성 실패",
            description: `댓글 작성 중 오류가 발생했습니다: ${error.message}`,
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleToggleLike = (commentId: number) => {
    toggleCommentLikeMutation.mutate(commentId, {
      onError: (error) => {
        toast({
          title: "좋아요 실패",
          description: `좋아요 처리 중 오류가 발생했습니다: ${error.message}`,
          variant: "destructive",
        })
      },
    })
  }

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditingCommentContent(comment.content)
  }

  const handleUpdateComment = (commentId: number) => {
    if (!editingCommentContent.trim()) {
      toast({
        title: "댓글 내용 없음",
        description: "수정할 댓글 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    updateCommentMutation.mutate(
      { commentId, content: editingCommentContent },
      {
        onSuccess: () => {
          setEditingCommentId(null)
          setEditingCommentContent("")
          toast({
            title: "댓글 수정 완료",
            description: "댓글이 성공적으로 수정되었습니다.",
          })
        },
        onError: (error) => {
          toast({
            title: "댓글 수정 실패",
            description: `댓글 수정 중 오류가 발생했습니다: ${error.message}`,
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId, {
      onSuccess: () => {
        toast({
          title: "댓글 삭제 완료",
          description: "댓글이 성공적으로 삭제되었습니다.",
        })
      },
      onError: (error) => {
        toast({
          title: "댓글 삭제 실패",
          description: `댓글 삭제 중 오류가 발생했습니다: ${error.message}`,
          variant: "destructive",
        })
      },
    })
  }

  if (isLoading) return <div>댓글 로딩 중...</div>
  if (isError) return <div>댓글을 불러오는 데 실패했습니다.</div>

  return (
    <div className="mt-8 p-6 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-100 dark:text-gray-100 mb-6">댓글 ({comments?.length || 0})</h3>

      {/* 댓글 작성 폼 */}
      <div className="mb-8">
        <Textarea
          placeholder="댓글을 작성해주세요..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="w-full p-3 bg-gray-700 dark:bg-gray-700 border border-gray-600 dark:border-gray-600 rounded-md text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
        <Button
          onClick={handleCommentSubmit}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          댓글 작성
        </Button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments && comments.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-400 text-center">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-4 p-4 bg-gray-700 dark:bg-gray-700 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {comment.authorName ? comment.authorName[0] : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-100 dark:text-gray-100">{comment.authorName}</span>
                  <span className="text-sm text-gray-400 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {editingCommentId === comment.id ? (
                  <div className="mt-2">
                    <Textarea
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-gray-100"
                      rows={2}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCommentId(null)}
                        className="text-gray-300 border-gray-500 hover:bg-gray-600"
                      >
                        취소
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateComment(comment.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 dark:text-gray-300 mt-1 whitespace-pre-wrap">{comment.content}</p>
                )}
                <div className="flex items-center mt-2 text-gray-400 dark:text-gray-400 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleLike(comment.id)}
                    className="flex items-center space-x-1 hover:bg-gray-600 text-gray-400 hover:text-blue-400"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likeCount}</span>
                  </Button>
                  {currentUser && currentUser.id === comment.authorId && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(comment)}
                        className="flex items-center space-x-1 ml-2 hover:bg-gray-600 text-gray-400 hover:text-yellow-400"
                      >
                        <Edit className="w-4 h-4" />
                        <span>수정</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 ml-2 hover:bg-gray-600 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>삭제</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-700 text-gray-100 border-gray-600">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gray-100">댓글 삭제</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              정말로 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-600 hover:bg-gray-500 text-gray-100 border-none">취소</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteComment(comment.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
