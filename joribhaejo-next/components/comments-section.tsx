// components/comments-section.tsx
"use client"

import { useComments, useCreateComment } from "@/hooks/use-posts"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"

interface CommentsSectionProps {
  postId: number
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [commentContent, setCommentContent] = useState("")
  const { data: comments, isLoading, isError } = useComments(postId)
  const createCommentMutation = useCreateComment()

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

  if (isLoading) return <div>댓글 로딩 중...</div>
  if (isError) return <div>댓글을 불러오는 데 실패했습니다.</div>

  return (
    <div className="mt-8 p-6 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-100 dark:text-gray-100 mb-6">댓글 ({comments.length})</h3>

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
        {comments.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-400 text-center">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-4 p-4 bg-gray-700 dark:bg-gray-700 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {comment.author[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-100 dark:text-gray-100">{comment.author}</span>
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
                <p className="text-gray-300 dark:text-gray-300 mt-1 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}