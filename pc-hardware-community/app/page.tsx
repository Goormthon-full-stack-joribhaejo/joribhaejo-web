"use client"
import { CreatePost } from "@/components/create-post"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { PostDetail } from "@/components/post-detail"
import { PostList } from "@/components/post-list"
import { TopNavigation } from "@/components/top-navigation"
import type { Comment, Post } from "@/lib/types"
import { useCallback, useEffect, useRef, useState } from "react"

// === 1. 댓글 타입 정의(이미 있다면 생략) ===

type UserRole = "guest" | "member"
type ActiveSection = "forum" | "qa" | "study" | "activity" | "news"

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

export default function Home() {
  // === 2. 댓글 더미 데이터 State 선언 ===
  const [commentsByPost, setCommentsByPost] = useState<Record<number, Comment[]>>({
    2: [
      {
        id: 1,
        postId: 2,
        author: "TestUser1",
        authorId: 10,
        content: "정성 리뷰 감사합니다! 혹시 추천 1순위 의자는 뭔가요?",
        likes: 2,
        liked: false,
        timeAgo: "방금 전",
        createdAt: "2024-01-15T12:50:00Z",
        updatedAt: "2024-01-15T12:50:00Z",
        parentId: null,
      },
      {
        id: 2,
        postId: 2,
        author: "ComfortGamer",
        authorId: 2,
        content: "@TestUser1 저는 DXRacer 2024 추천합니다 :)",
        likes: 1,
        liked: false,
        timeAgo: "방금 전",
        createdAt: "2024-01-15T12:52:00Z",
        updatedAt: "2024-01-15T12:52:00Z",
        parentId: 1,
      }
    ],
    // ...필요시 다른 postId도
  })

  // === 3. 댓글 CRUD 핸들러 구현 ===
  // 댓글 추가 (일반/대댓글 동일, parentId만 다름)
  const handleAddComment = (postId: number, comment: Comment) => {
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }))
  }

  // 댓글 수정
  const handleEditComment = (postId: number, commentId: number, newContent: string) => {
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: prev[postId].map(c => c.id === commentId ? { ...c, content: newContent, updatedAt: new Date().toISOString() } : c)
    }))
  }

  // 댓글 삭제 (대댓글까지 삭제하려면 parentId도 함께)
  const handleDeleteComment = (postId: number, commentId: number) => {
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: prev[postId].filter(c => c.id !== commentId && c.parentId !== commentId)
    }))
  }

  // 댓글 좋아요
  const handleLikeComment = (postId: number, commentId: number) => {
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: prev[postId].map(c =>
        c.id === commentId
          ? {
            ...c,
            likes: c.liked ? c.likes - 1 : c.likes + 1,
            liked: !c.liked,
          }
          : c
      ),
    }))
  }

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "RTX 4090 vs RTX 4080: Comprehensive 4K Gaming Benchmark",
      content: "After extensive testing across 20+ games at 4K resolution, here's my detailed comparison of these flagship GPUs. The performance gap is significant in ray tracing scenarios...",
      author: "TechReviewer_Pro",
      likes: 342,
      views: 2847,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      section: "forum",
      category: Category.HARD,
      hashtags: ["gaming", "gpu", "4k", "benchmark"],
      comments: [],
      timeAgo: "2시간 전"
    },
    {
      id: 2,
      title: "Best Budget Gaming Chairs Under $300 - 2024 Edition",
      content: "I've tested 12 different gaming chairs in this price range over the past 2 months. Here are my top picks for comfort, durability, and value...",
      author: "ComfortGamer",
      likes: 198,
      views: 1432,
      createdAt: "2024-01-14T15:45:00Z",
      updatedAt: "2024-01-14T15:45:00Z",
      section: "forum",
      category: Category.HARD,
      hashtags: ["gaming", "chairs", "budget", "comfort"],
      comments: [],
      timeAgo: "1일 전"
    },
    {
      id: 3,
      title: "React 19 New Features and Migration Guide",
      content: "Complete guide to React 19's new features including concurrent rendering, automatic batching, and the new compiler...",
      author: "ReactDev",
      likes: 267,
      views: 1856,
      createdAt: "2024-01-13T09:20:00Z",
      updatedAt: "2024-01-13T09:20:00Z",
      section: "study",
      category: Category.WEB,
      hashtags: ["react", "javascript", "web", "development"],
      comments: [],
      timeAgo: "2일 전"
    },
    {
      id: 4,
      title: "My New PC Build - RTX 4080 + Ryzen 7 7800X3D",
      content: "Just finished my new gaming PC build! Here are the specs and some photos of the setup. The performance is absolutely incredible...",
      author: "PCBuilder_2024",
      likes: 156,
      views: 892,
      createdAt: "2024-01-12T14:30:00Z",
      updatedAt: "2024-01-12T14:30:00Z",
      section: "activity",
      category: Category.HARD,
      hashtags: ["gaming", "pc", "rtx", "ryzen"],
      comments: [],
      timeAgo: "3일 전"
    },
    {
      id: 5,
      title: "How to fix GPU driver issues on Windows 11?",
      content: "I'm having trouble with my GPU drivers on Windows 11. The screen keeps flickering and games crash randomly. Has anyone experienced this?",
      author: "TroubleShooter",
      likes: 89,
      views: 567,
      createdAt: "2024-01-11T11:15:00Z",
      updatedAt: "2024-01-11T11:15:00Z",
      section: "qa",
      category: Category.HARD,
      hashtags: ["windows", "gpu", "driver", "issues"],
      comments: [],
      timeAgo: "4일 전"
    },
    {
      id: 6,
      title: "OpenAI GPT-5 Release Date and Features",
      content: "Latest rumors and confirmed information about GPT-5 release date, new features, and potential improvements...",
      author: "AITech_News",
      likes: 234,
      views: 1234,
      createdAt: "2024-01-10T16:45:00Z",
      updatedAt: "2024-01-10T16:45:00Z",
      section: "news",
      category: Category.AI,
      hashtags: ["ai", "openai", "gpt", "features"],
      comments: [],
      timeAgo: "5일 전"
    },
    {
      id: 7,
      title: "Docker vs Kubernetes: Which to Learn First?",
      content: "Comprehensive comparison of Docker and Kubernetes for beginners. Which technology should you learn first for DevOps?",
      author: "DevOps_Expert",
      likes: 178,
      views: 945,
      createdAt: "2024-01-09T13:20:00Z",
      updatedAt: "2024-01-09T13:20:00Z",
      section: "study",
      category: Category.DEVOPS,
      hashtags: ["docker", "kubernetes", "devops", "beginners"],
      comments: [],
      timeAgo: "6일 전"
    },
    {
      id: 8,
      title: "Flutter vs React Native: Mobile Development Battle",
      content: "Detailed comparison of Flutter and React Native for cross-platform mobile development. Performance, development speed, and ecosystem analysis...",
      author: "MobileDev_Pro",
      likes: 145,
      views: 678,
      createdAt: "2024-01-08T10:30:00Z",
      updatedAt: "2024-01-08T10:30:00Z",
      section: "study",
      category: Category.MOBILE,
      hashtags: ["flutter", "reactnative", "mobile", "crossplatform"],
      comments: [],
      timeAgo: "7일 전"
    }
  ])

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showEditPost, setShowEditPost] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [pinnedPosts, setPinnedPosts] = useState<Set<number>>(new Set())

  // TopNavigation 상태
  const [userRole, setUserRole] = useState<UserRole>("guest")
  const [activeSection, setActiveSection] = useState<ActiveSection>("forum")
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const handleDeleteFromList = (postId: number) => {
    setPostToDelete(postId)
    setShowDeleteDialog(true)
  }

  // 삭제 다이얼로그 상태 변화 추적
  useEffect(() => {
    console.log('showDeleteDialog changed to:', showDeleteDialog)
  }, [showDeleteDialog])

  useEffect(() => {
    console.log('postToDelete changed to:', postToDelete)
  }, [postToDelete])

  // 좋아요 토글 함수 - React Strict Mode 완전 대응
  const likeProcessingRef = useRef<Set<number>>(new Set())
  const likeTimeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map())
  const likeCallCountRef = useRef<Map<number, number>>(new Map())
  const likeLastCallTimeRef = useRef<Map<number, number>>(new Map())
  const likePendingUpdatesRef = useRef<Map<number, boolean>>(new Map())

  const handleLike = useCallback((postId: number) => {
    const now = Date.now()
    const lastCallTime = likeLastCallTimeRef.current.get(postId) || 0

    // 20ms 내에 중복 호출된 경우 무시 (매우 빠른 반응)
    if (now - lastCallTime < 20) {
      console.log('Like called too quickly for post:', postId, '- ignoring duplicate call')
      return
    }

    // 이미 처리 중인 좋아요는 무시
    if (likeProcessingRef.current.has(postId)) {
      console.log('Like already processing for post:', postId, '- ignoring duplicate call')
      return
    }

    // 호출 시간 기록
    likeLastCallTimeRef.current.set(postId, now)

    // 호출 횟수 추적
    const currentCallCount = likeCallCountRef.current.get(postId) || 0
    likeCallCountRef.current.set(postId, currentCallCount + 1)
    console.log(`Like call #${currentCallCount + 1} for post:`, postId)

    // 기존 타임아웃이 있다면 제거
    const existingTimeout = likeTimeoutRef.current.get(postId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
      likeTimeoutRef.current.delete(postId)
    }

    console.log('Processing like for post:', postId)
    likeProcessingRef.current.add(postId)

    // 현재 좋아요 상태 확인
    const isCurrentlyLiked = likedPosts.has(postId)
    const newLikedState = !isCurrentlyLiked

    // 대기 중인 업데이트가 있는지 확인
    if (likePendingUpdatesRef.current.has(postId)) {
      console.log('Pending update exists for post:', postId, '- skipping')
      return
    }

    // 대기 중인 업데이트 표시
    likePendingUpdatesRef.current.set(postId, newLikedState)

    if (isCurrentlyLiked) {
      // 이미 좋아요를 눌렀다면 취소
      setLikedPosts(prev => {
        const newLikedPosts = new Set(prev)
        newLikedPosts.delete(postId)
        return newLikedPosts
      })
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === postId ? { ...post, likes: Math.max(0, post.likes - 1) } : post
      ))
      console.log('Unliked post:', postId)
    } else {
      // 좋아요를 누르지 않았다면 추가
      setLikedPosts(prev => {
        const newLikedPosts = new Set(prev)
        newLikedPosts.add(postId)
        return newLikedPosts
      })
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ))
      console.log('Liked post:', postId)
    }

    // 처리 완료 후 ref에서 제거 (500ms 후 - 매우 빠른 해제)
    const timeout = setTimeout(() => {
      likeProcessingRef.current.delete(postId)
      likeTimeoutRef.current.delete(postId)
      likeCallCountRef.current.delete(postId)
      likeLastCallTimeRef.current.delete(postId)
      likePendingUpdatesRef.current.delete(postId)
      console.log('Like processing completed for post:', postId)
    }, 500)

    likeTimeoutRef.current.set(postId, timeout)
  }, [likedPosts])

  const handleView = (postId: number) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, views: post.views + 1 } : post
    ))
  }

  const handleCreatePost = (newPost: Omit<Post, 'id'>) => {
    const now = new Date().toISOString()
    const post: Post = {
      ...newPost,
      id: Math.max(...posts.map(p => p.id)) + 1,
      likes: 0,
      views: 0,
      createdAt: now,
      updatedAt: now,
      section: activeSection,
      category: (newPost as any).category || (selectedCategory === "ALL" ? Category.ETC : selectedCategory),
      hashtags: newPost.hashtags || []
    }
    setPosts(prev => [post, ...prev])
    setShowCreatePost(false)
  }

  const handleEditPost = (updatedPost: { title: string; content: string; author: string }) => {
    setPosts(prevPosts => prevPosts.map(post =>
      post.id === selectedPostId
        ? {
          ...post,
          ...updatedPost,
          updatedAt: new Date().toISOString()
        }
        : post
    ))
    setShowEditPost(false)
    setSelectedPostId(null)
  }

  const handleDeletePost = () => {
    const deleteId = postToDelete || selectedPostId
    if (deleteId) {
      console.log('Deleting post with ID:', deleteId)
      setPosts(prev => prev.filter(post => post.id !== deleteId))
      setSelectedPostId(null)
      setPostToDelete(null)
      setShowDeleteDialog(false)
      console.log('Post deleted successfully, returning to main view')
    }
  }

  const handleDeleteFromDetail = () => {
    setPostToDelete(selectedPostId)
    setShowDeleteDialog(true)
  }

  const handlePin = (postId: number) => {
    setPinnedPosts(prev => {
      const newPinnedPosts = new Set(prev)
      newPinnedPosts.add(postId)
      return newPinnedPosts
    })
  }

  const handleUnpin = (postId: number) => {
    setPinnedPosts(prev => {
      const newPinnedPosts = new Set(prev)
      newPinnedPosts.delete(postId)
      return newPinnedPosts
    })
  }

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section)
    setSelectedCategory("ALL")
    setSelectedPostId(null)  // 게시글 상세에서 빠져나와 목록으로 이동
    setShowCreatePost(false)
    setShowEditPost(false)
  }

  // 현재 섹션과 카테고리의 게시글만 필터링
  const currentSectionPosts = posts.filter(post => {
    const sectionMatch = post.section === activeSection
    const categoryMatch = selectedCategory === "ALL" || post.category === selectedCategory
    const searchMatch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.hashtags && post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    return sectionMatch && categoryMatch && searchMatch
  })

  // === TopNavigation은 항상 상단에 렌더링 ===
  return (
    <>
      <TopNavigation
        userRole={userRole}
        setUserRole={setUserRole}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onSectionChange={handleSectionChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 게시글 작성 */}
      {showCreatePost ? (
        <CreatePost
          onSubmit={handleCreatePost}
          onCancel={() => setShowCreatePost(false)}
          currentSection={activeSection}
          selectedCategory={selectedCategory}
          userRole={userRole}
          setUserRole={setUserRole}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onSectionChange={handleSectionChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )
        // 게시글 수정
        : showEditPost && selectedPostId ? (
          <CreatePost
            onSubmit={handleEditPost}
            onCancel={() => setShowEditPost(false)}
            initialData={{
              title: posts.find(p => p.id === selectedPostId)?.title || "",
              content: posts.find(p => p.id === selectedPostId)?.content || "",
              author: posts.find(p => p.id === selectedPostId)?.author || "",
              hashtags: posts.find(p => p.id === selectedPostId)?.hashtags || [],
            }}
            isEdit={true}
            userRole={userRole}
            setUserRole={setUserRole}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onSectionChange={handleSectionChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )
          // 게시글 상세
          : selectedPostId ? (
            <>
              <PostDetail
                post={posts.find(p => p.id === selectedPostId)!}
                isLiked={likedPosts.has(selectedPostId)}
                isPinned={pinnedPosts.has(selectedPostId)}
                onBack={() => setSelectedPostId(null)}
                onLike={() => handleLike(selectedPostId)}
                onView={() => handleView(selectedPostId)}
                onEdit={() => setShowEditPost(true)}
                onDelete={handleDeleteFromDetail}
                onPin={() => handlePin(selectedPostId)}
                onUnpin={() => handleUnpin(selectedPostId)}
                userRole={userRole}
                setUserRole={setUserRole}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onSectionChange={handleSectionChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                comments={commentsByPost[selectedPostId] || []}
                onAddComment={handleAddComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                onLikeComment={handleLikeComment}
              />
              <DeleteConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                  setShowDeleteDialog(false)
                  setPostToDelete(null)
                }}
                onConfirm={handleDeletePost}
                title="게시글 삭제"
                description="이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
              />
            </>
          )
            // 게시글 목록
            : (
              <>
                <PostList
                  posts={currentSectionPosts}
                  likedPosts={likedPosts}
                  pinnedPosts={pinnedPosts}
                  onPostClick={(id) => {
                    handleView(id)
                    setSelectedPostId(id)
                  }}
                  onView={handleView}
                  onCreatePost={() => setShowCreatePost(true)}
                  onLike={handleLike}
                  onEdit={(id) => {
                    setSelectedPostId(id)
                    setShowEditPost(true)
                  }}
                  onDelete={handleDeleteFromList}
                  onPin={handlePin}
                  onUnpin={handleUnpin}
                  currentSection={activeSection}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                <DeleteConfirmDialog
                  isOpen={showDeleteDialog}
                  onClose={() => {
                    setShowDeleteDialog(false)
                    setPostToDelete(null)
                  }}
                  onConfirm={handleDeletePost}
                  title="게시글 삭제"
                  description="이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                />
              </>
            )}
    </>
  )
}
