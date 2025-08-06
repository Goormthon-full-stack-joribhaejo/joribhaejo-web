"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import type { Post } from "@/lib/types"
import { getTimeAgo } from "@/lib/utils"
import { Edit, Eye, Heart, MoreHorizontal, Pin, Plus, Share2, Star, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

enum Category {
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

interface PostListProps {
  posts: Post[]
  likedPosts: Set<number>
  pinnedPosts: Set<number>
  onPostClick: (id: number) => void
  onView: (id: number) => void
  onCreatePost: () => void
  onLike?: (id: number) => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onPin?: (id: number) => void
  onUnpin?: (id: number) => void
  currentSection?: string
  selectedCategory?: Category | "ALL"
  onCategoryChange?: (category: Category | "ALL") => void
}

const categoryLabels = {
  ALL: "전체",
  WEB: "웹 개발",
  MOBILE: "모바일",
  BACK: "백엔드",
  HARD: "하드웨어",
  AI: "AI/ML",
  NETWORK: "네트워크",
  SECURITY: "보안",
  DEVOPS: "DevOps",
  ETC: "기타"
}

const categoryColors = {
  WEB: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MOBILE: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  BACK: "bg-green-500/20 text-green-400 border-green-500/30",
  HARD: "bg-red-500/20 text-red-400 border-red-500/30",
  AI: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  NETWORK: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  SECURITY: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  DEVOPS: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  ETC: "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

export function PostList({
  posts,
  likedPosts,
  pinnedPosts,
  onPostClick,
  onView,
  onCreatePost,
  onLike,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  currentSection,
  selectedCategory = "ALL",
  onCategoryChange
}: PostListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "방금 전"
    if (diffInHours < 24) return `${diffInHours}시간 전`
    return `${Math.floor(diffInHours / 24)}일 전`
  }

  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(tick => tick + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const getSectionLabel = (section: string) => {
    const sectionLabels = {
      forum: "자유게시판",
      qa: "Q&A",
      study: "스터디",
      activity: "대외활동",
      news: "IT 뉴스"
    }
    return sectionLabels[section as keyof typeof sectionLabels] || section
  }

  const handleShare = async (post: Post) => {
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

  const categories = ["ALL", ...Object.values(Category)]

  // 고정된 게시글을 먼저 표시
  const sortedPosts = [...posts].sort((a, b) => {
    const aPinned = pinnedPosts?.has(a.id) || false
    const bPinned = pinnedPosts?.has(b.id) || false
    if (aPinned && !bPinned) return -1
    if (!aPinned && bPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 text-gray-100 dark:text-gray-100 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-800 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                {currentSection ? getSectionLabel(currentSection) : "PC 하드웨어 커뮤니티"}
              </h1>
              <p className="text-gray-400 dark:text-gray-400 mt-2">
                {currentSection
                  ? `${getSectionLabel(currentSection)}에 대한 정보를 공유하세요`
                  : "PC 하드웨어에 대한 정보를 공유하세요"
                }
              </p>
            </div>
            <Button
              onClick={onCreatePost}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              글쓰기
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange?.(category as Category | "ALL")}
              className={`whitespace-nowrap ${selectedCategory === category
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-gray-600 dark:border-gray-600 text-gray-300 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-500"
                }`}
            >
              {categoryLabels[category as keyof typeof categoryLabels]}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <Card
              key={post.id}
              className={`bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700 hover:border-gray-600 dark:hover:border-gray-600 transition-colors cursor-pointer ${pinnedPosts?.has(post.id) ? 'border-blue-500/50 bg-blue-500/5' : ''
                }`}
              onClick={() => onPostClick(post.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-red-500 text-white">
                        {post.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100 dark:text-gray-100">{post.author}</span>
                      {pinnedPosts?.has(post.id) && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                    </div>
                    <span className="text-sm text-gray-400 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-400 dark:text-gray-400">{getTimeAgo(post.createdAt)}
                      {" · "}
                      {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric", month: "2-digit", day: "2-digit"
                      })}</span>
                  </div>

                  {/* Category Badge */}
                  <Badge className={`${categoryColors[post.category as keyof typeof categoryColors]} border`}>
                    {categoryLabels[post.category as keyof typeof categoryLabels]}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-100 dark:text-gray-100 mb-3 hover:text-blue-400 dark:hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 dark:text-gray-300 text-sm leading-relaxed">
                    {post.content}
                  </p>

                  {/* 해시태그 */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-700 dark:bg-gray-700 text-gray-300 dark:text-gray-300 rounded-md border border-gray-600 dark:border-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Engagement */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700 dark:border-gray-700">
                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('Like button clicked in PostList for post:', post.id)
                          onLike?.(post.id)
                        }}
                        className={`gap-2 transition-colors ${likedPosts.has(post.id)
                          ? "text-red-400 hover:text-red-300"
                          : "text-gray-400 dark:text-gray-400 hover:text-red-400"
                          }`}
                      >
                        <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </Button>

                      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.views.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Pin/Unpin Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (pinnedPosts?.has(post.id)) {
                            onUnpin?.(post.id)
                          } else {
                            onPin?.(post.id)
                          }
                        }}
                        className={`transition-colors ${pinnedPosts?.has(post.id)
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-gray-400 dark:text-gray-400 hover:text-yellow-400"
                          }`}
                      >
                        <Pin className={`w-4 h-4 ${pinnedPosts?.has(post.id) ? "fill-current" : ""}`} />
                      </Button>

                      {/* Share Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShare(post)
                        }}
                        className="text-gray-400 dark:text-gray-400 hover:text-blue-400"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>

                      {/* Edit/Delete Menu */}
                      {(onEdit || onDelete) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 dark:text-gray-400 hover:text-gray-200 dark:hover:text-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700">
                            {onEdit && (
                              <DropdownMenuItem
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation()
                                  onEdit(post.id)
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
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation()
                                  onDelete(post.id)
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 