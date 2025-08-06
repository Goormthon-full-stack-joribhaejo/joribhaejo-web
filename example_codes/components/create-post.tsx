"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send } from "lucide-react"
import { TopNavigation } from "./top-navigation"
import type { Post } from "@/app/page"

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

interface CreatePostProps {
  onSubmit: (post: any) => void
  onCancel: () => void
  initialData?: {
    title: string
    content: string
    author: string
    hashtags?: string[]
  }
  isEdit?: boolean
  currentSection?: string
  selectedCategory?: Category | "ALL"
  userRole: "guest" | "member"
  setUserRole: (role: "guest" | "member") => void
  activeSection: "forum" | "qa" | "study" | "activity" | "news"
  setActiveSection: (section: "forum" | "qa" | "study" | "activity" | "news") => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

const categoryLabels = {
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

export function CreatePost({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEdit, 
  currentSection, 
  selectedCategory,
  userRole,
  setUserRole,
  activeSection,
  setActiveSection,
  searchQuery,
  onSearchChange
}: CreatePostProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [author, setAuthor] = useState(initialData?.author || "")
  const [category, setCategory] = useState<Category>(selectedCategory && selectedCategory !== "ALL" ? selectedCategory : Category.ETC)
  const [hashtags, setHashtags] = useState(initialData?.hashtags?.join(", ") || "")

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !author.trim()) return

    // 해시태그 처리: 쉼표로 구분하고 공백 제거
    const hashtagArray = hashtags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    if (isEdit) {
      // 수정 모드: likes, views, createdAt은 제외
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        hashtags: hashtagArray
      })
    } else {
      // 새 게시글 모드: 모든 필드 포함
      const now = new Date().toISOString()
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        likes: 0,
        views: 0,
        createdAt: now,
        updatedAt: now,
        category: category,
        hashtags: hashtagArray
      })
    }
  }

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

      {/* Header */}
      <div className="pt-20 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              취소
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                {initialData ? "게시글 수정" : "새 글 작성"}
              </h1>
              {currentSection && !isEdit && (
                <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                  {getSectionLabel(currentSection)} 섹션에 작성됩니다
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Card className="bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-100 dark:text-gray-100">게시글 정보</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                  작성자
                </label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="작성자 이름을 입력하세요"
                  className="bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                  required
                />
              </div>

              {!isEdit && (
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                    카테고리
                  </label>
                  <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                    <SelectTrigger className="bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 text-gray-100 dark:text-gray-100">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700">
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-gray-100 dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                  제목
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="게시글 제목을 입력하세요"
                  className="bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                  내용
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="게시글 내용을 입력하세요"
                  rows={10}
                  className="bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 resize-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="hashtags" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                  해시태그
                </label>
                <Input
                  id="hashtags"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="해시태그를 쉼표로 구분하여 입력하세요 (예: gaming, gpu, 4k)"
                  className="bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                  쉼표(,)로 구분하여 여러 해시태그를 입력할 수 있습니다
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-gray-600 dark:border-gray-600 text-gray-300 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-500 hover:text-gray-200 dark:hover:text-gray-200"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isEdit ? "수정하기" : "작성하기"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 