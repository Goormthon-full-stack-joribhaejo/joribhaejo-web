"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Eye, ArrowLeft, Clock, MoreHorizontal, Edit, Trash2, Pin, Share2, Star } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TopNavigation } from "./top-navigation"
import { CommentsSection } from "./comments-section"
import { toast } from "@/hooks/use-toast"
import type { Post } from "@/app/page"

interface PostDetailProps {
  post: Post
  isLiked: boolean
  isPinned: boolean
  onBack: () => void
  onLike: () => void
  onView: () => void
  onEdit?: () => void
  onDelete?: () => void
  onPin?: () => void
  onUnpin?: () => void
  userRole: "guest" | "member"
  setUserRole: (role: "guest" | "member") => void
  activeSection: "forum" | "qa" | "study" | "activity" | "news"
  setActiveSection: (section: "forum" | "qa" | "study" | "activity" | "news") => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function PostDetail({ 
  post, 
  isLiked, 
  isPinned,
  onBack, 
  onLike, 
  onView, 
  onEdit, 
  onDelete,
  onPin,
  onUnpin,
  userRole,
  setUserRole,
  activeSection,
  setActiveSection,
  searchQuery,
  onSearchChange
}: PostDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleShare = async () => {
    const url = `${window.location.origin}?post=${post.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "URL 복사 완료",
        description: "게시글 링크가 클립보드에 복사되었습니다.",
      })
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "URL 복사에 실패했습니다. 수동으로 복사해주세요.",
        variant: "destructive",
      })
    }
  }

  const isEdited = post.createdAt !== post.updatedAt

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 text-gray-100 dark:text-gray-100">
      {/* Top Navigation */}
      <TopNavigation
        userRole={userRole}
        setUserRole={setUserRole}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* Back Button */}
      <div className="pt-20 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Card className="bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-red-500 text-white">
                    {post.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-100 dark:text-gray-100 text-lg">{post.author}</h3>
                    {isPinned && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(post.createdAt)}</span>
                    {isEdited && (
                      <>
                        <span>•</span>
                        <span className="text-yellow-400 dark:text-yellow-400">수정됨 {formatDate(post.updatedAt)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Pin/Unpin Button */}
                {(onPin || onUnpin) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isPinned) {
                        onUnpin?.()
                      } else {
                        onPin?.()
                      }
                    }}
                    className={`transition-colors ${
                      isPinned
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-gray-400 dark:text-gray-400 hover:text-yellow-400"
                    }`}
                  >
                    <Pin className={`w-4 h-4 ${isPinned ? "fill-current" : ""}`} />
                  </Button>
                )}

                {/* Share Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-gray-400 dark:text-gray-400 hover:text-blue-400"
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                {/* Edit/Delete Menu */}
                {(onEdit || onDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 dark:text-gray-400 hover:text-gray-200 dark:hover:text-gray-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700">
                      {onEdit && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Edit button clicked in PostDetail')
                            onEdit()
                          }} 
                          className="text-gray-100 dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          수정
                        </DropdownMenuItem>
                      )}
                      {onEdit && onDelete && <DropdownMenuSeparator className="bg-gray-700 dark:bg-gray-700" />}
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Delete button clicked in PostDetail')
                            onDelete()
                          }} 
                          className="text-red-400 dark:text-red-400 hover:bg-gray-700 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-100 dark:text-gray-100 mb-6">
                {post.title}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* 해시태그 */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-700 dark:border-gray-700">
                  {post.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm bg-gray-700 dark:bg-gray-700 text-gray-300 dark:text-gray-300 rounded-md border border-gray-600 dark:border-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Engagement */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700 dark:border-gray-700">
                <div className="flex items-center gap-6">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      console.log('Like button clicked in PostDetail for post:', post.id)
                      onLike()
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                    className={`gap-3 transition-colors ${
                      isLiked
                        ? "text-red-400 hover:text-red-300"
                        : "text-gray-400 dark:text-gray-400 hover:text-red-400"
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                    <span className="font-medium text-lg">{post.likeCount}</span>
                  </Button>

                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-400">
                    <Eye className="w-5 h-5" />
                    <span className="text-lg font-medium">{(post.viewCount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments Section */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <CommentsSection postId={post.id} />
      </div>
    </div>
  )
}
