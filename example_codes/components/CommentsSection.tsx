'use client'
//import { useCurrentUser } from '@/hooks/use-auth'
//import { useComments, useCreateComment, useDeleteComment, useToggleCommentLike, useUpdateComment } from '@/hooks/use-posts'
//import { useToast } from '@/hooks/use-toast'
import { Comment } from '@/lib/types'
import { buildCommentTree, getTimeAgo, getTotalCommentsCount } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface CommentsSectionProps {
  postId: number
  comments: Comment[]
  onAddComment: (postId: number, comment: Comment) => void
  onEditComment: (postId: number, commentId: number, newContent: string) => void
  onDeleteComment: (postId: number, commentId: number) => void
  onLikeComment: (postId: number, commentId: number) => void
}

export function CommentsSection({
  postId,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  postAuthor
}: CommentsSectionProps & { postAuthor: string }) {
  const commentTree = buildCommentTree(comments)
  const [newContent, setNewContent] = useState("")
  const totalComments = getTotalCommentsCount(commentTree);

  // 댓글 작성
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContent.trim()) return
    const newComment: Comment = {
      id: Date.now(),
      postId,
      author: "로그인유저", // 실제 서비스 연결시 변경
      authorId: 1,
      content: newContent,
      likes: 0,
      timeAgo: "방금 전",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: null,
    }
    onAddComment(postId, newComment)
    setNewContent("")
  }

  return (
    <section className="mt-8">
      <h3 className="text-xl font-bold mb-6 border-b-2 border-[#2264EC] pb-3 pl-2 flex items-center gap-2">
        댓글 및 리뷰
        <span className="inline-block bg-[#2264EC] text-white text-sm font-semibold px-2 py-0.5 rounded ml-2">
          {totalComments + " 개"}
        </span>
      </h3>
      {/* 새 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="flex gap-3 mt-6 mb-7">
        <input
          name="new"
          placeholder="댓글을 입력하세요"
          className="w-full border rounded px-2 py-1"
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
        />
        <button type="submit" className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white bg-transparent rounded">등록</button>
      </form>

      {/* 댓글 트리 */}
      {commentTree.map(comment =>
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onAddComment={onAddComment}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
          onLikeComment={onLikeComment}
          depth={0}
          postAuthor={postAuthor}
        />
      )}
    </section>
  )
}

// --- CommentItem 컴포넌트 ---
interface ItemProps {
  comment: Comment & { replies?: Comment[] }
  postId: number
  onAddComment: (postId: number, comment: Comment) => void
  onEditComment: (postId: number, commentId: number, newContent: string) => void
  onDeleteComment: (postId: number, commentId: number) => void
  onLikeComment: (postId: number, commentId: number) => void
}

interface CommentItemProps extends ItemProps {
  depth?: number
  postAuthor: string
}

function CommentItem({
  comment,
  postId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  depth = 0, // 추가: 깊이(댓글/대댓글 구분)
  postAuthor
}: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [draft, setDraft] = useState(comment.content)
  const [replyDraft, setReplyDraft] = useState("")
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(comment.createdAt))
  const isPostAuthor = comment.author === postAuthor;

  // 시간 경과 주기적 갱신
  useEffect(() => {
    const timer = setInterval(() => setTimeAgo(getTimeAgo(comment.createdAt)), 60000)
    return () => clearInterval(timer)
  }, [comment.createdAt])

  // 답글 작성
  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyDraft.trim()) return
    const newReply: Comment = {
      id: Date.now(),
      postId,
      author: "로그인유저", // 실제 서비스 연결시 변경
      authorId: 1,
      content: replyDraft,
      likes: 0,
      timeAgo: "방금 전",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: comment.id,
    }
    onAddComment(postId, newReply)
    setReplyDraft("")
    setReplyOpen(false)
  }

  // 댓글/답글 수정
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    onEditComment(postId, comment.id, draft)
    setEditOpen(false)
  }

  // --- 시각적 구분 및 테마 적용 ---
  return (
    <div className={`
      mb-3 transition-all
      ${depth === 0
        ? "rounded-xl px-7 py-5 bg-[#232a3b] shadow-lg"
        : "ml-9 rounded-xl px-7 py-4 bg-[#19202d] border-l-4 border-[#2264EC]"}
    `}>
      <div className="flex items-center gap-2 mb-1">
        <span className={"font-bold text-lg " + (isPostAuthor ? "text-[#2264EC]" : "text-white")}>
          {comment.author}
        </span>
        <span className="text-xs text-gray-400 ml-1">
          {timeAgo}
          {" · "}
          {new Date(comment.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          })}
        </span>
      </div>
      {editOpen ? (
        <form onSubmit={handleEdit} className="mt-2">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="w-full border rounded p-2 bg-gray-900 text-gray-100"
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="px-2 py-1 rounded bg-blue-600 text-white text-xs">저장</button>
            <button
              type="button"
              className="text-gray-400 text-xs"
              onClick={() => {
                setDraft(comment.content)
                setEditOpen(false)
              }}
            >취소</button>
          </div>
        </form>
      ) : (
        <p className="mt-2 text-base text-gray-200">{comment.content}</p>
      )}
      <div className="flex gap-3 text-sm text-gray-400 mb-1">
        <button
          className={`flex items-center gap-1 px-2 py-1 rounded ${comment.liked ? "text-red-400 bg-gray-700" : "text-gray-400 hover:text-red-400"}`}
          onClick={() => onLikeComment(postId, comment.id)}
        >
          👍 {comment.likes}
        </button>
        <button className="text-gray-400 hover:text-blue-400" onClick={() => setReplyOpen(o => !o)}>답글</button>
        <button className="text-gray-400 hover:text-blue-400" onClick={() => setEditOpen(o => !o)}>수정</button>
        <button className="text-gray-400 hover:text-red-400" onClick={() => onDeleteComment(postId, comment.id)}>삭제</button>
      </div>
      {/* 답글 폼 */}
      {replyOpen && (
        <form onSubmit={handleReply} className="mt-2">
          <input
            name="r"
            placeholder="답글을 입력하세요"
            className="w-full border rounded px-2 py-1 bg-gray-900 text-gray-100"
            value={replyDraft}
            onChange={e => setReplyDraft(e.target.value)}
          />
          <button type="submit" className="mt-1 px-2 py-1 text-xs text-white bg-blue-600 rounded">등록</button>
        </form>
      )}
      {/* 대댓글(재귀) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(r =>
            <CommentItem
              key={r.id}
              comment={r}
              postId={postId}
              onAddComment={onAddComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onLikeComment={onLikeComment}
              depth={depth + 1}
              postAuthor={postAuthor}
            />
          )}
        </div>
      )}
    </div>
  )
}
