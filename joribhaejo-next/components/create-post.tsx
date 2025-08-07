"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send } from "lucide-react"
import { Post, Category } from "@/lib/types"
import { categoryLabels } from "@/lib/constants"

interface CreatePostProps {
  initialData?: Post; // Optional initial data for editing
  onSubmit: (post: { boardId: number; title: string; content: string; category: Category }) => void;
  onCancel: () => void;
  activeSection: number;
}

export function CreatePost({
  initialData,
  onSubmit,
  onCancel,
  activeSection,
}: CreatePostProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [category, setCategory] = useState<Category>(initialData?.category || Category.ETC) // Default to 'ETC'

  const isEdit = !!initialData

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    if (isEdit) {
      // 수정 모드
      onSubmit({
        boardId: activeSection,
        title: title.trim(),
        content: content.trim(),
        category: category,
      })
    } else {
      // 새 게시글 모드
      onSubmit({
        boardId: activeSection,
        title: title.trim(),
        content: content.trim(),
        category: category,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 text-gray-100 dark:text-gray-100">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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