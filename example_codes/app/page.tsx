"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { PostList } from "@/components/post-list"
import { PostDetail } from "@/components/post-detail"
import { CreatePost } from "@/components/create-post"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { TopNavigation } from "@/components/top-navigation"

export type Post = {
  id: number
  title: string
  content: string
  author: string
  likes: number
  views: number
  createdAt: string
  updatedAt: string
  section: ActiveSection
  category: Category
  hashtags: string[]
}

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
      hashtags: ["gaming", "gpu", "4k", "benchmark"]
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
      hashtags: ["gaming", "chairs", "budget", "comfort"]
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
      hashtags: ["react", "javascript", "web", "development"]
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
      hashtags: ["gaming", "pc", "rtx", "ryzen"]
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
      hashtags: ["windows", "gpu", "driver", "issues"]
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
      hashtags: ["ai", "openai", "gpt", "features"]
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
      hashtags: ["docker", "kubernetes", "devops", "beginners"]
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
      hashtags: ["flutter", "reactnative", "mobile", "crossplatform"]
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
      category: selectedCategory === "ALL" ? Category.ETC : selectedCategory,
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

  if (showCreatePost) {
    return <CreatePost onSubmit={handleCreatePost} onCancel={() => setShowCreatePost(false)} currentSection={activeSection} selectedCategory={selectedCategory} userRole={userRole} setUserRole={setUserRole} activeSection={activeSection} setActiveSection={setActiveSection} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
  }

  if (showEditPost && selectedPostId) {
    const post = posts.find(p => p.id === selectedPostId)
    if (!post) return <PostList posts={currentSectionPosts} likedPosts={likedPosts} pinnedPosts={pinnedPosts} onPostClick={setSelectedPostId} onView={handleView} onCreatePost={() => setShowCreatePost(true)} onLike={handleLike} onEdit={(id) => { setSelectedPostId(id); setShowEditPost(true) }} onDelete={handleDeleteFromList} onPin={handlePin} onUnpin={handleUnpin} currentSection={activeSection} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
    
    return <CreatePost 
        onSubmit={handleEditPost} 
        onCancel={() => setShowEditPost(false)} 
        initialData={{
          title: post.title,
          content: post.content,
          author: post.author,
          hashtags: post.hashtags
        }}
        isEdit={true}
        userRole={userRole}
        setUserRole={setUserRole}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
  }

  if (selectedPostId) {
    const post = posts.find(p => p.id === selectedPostId)
    if (!post) return <PostList posts={posts} likedPosts={likedPosts} pinnedPosts={pinnedPosts} onPostClick={setSelectedPostId} onView={handleView} onCreatePost={() => setShowCreatePost(true)} onLike={handleLike} onEdit={(id) => { setSelectedPostId(id); setShowEditPost(true) }} onDelete={handleDeleteFromList} onPin={handlePin} onUnpin={handleUnpin} currentSection={activeSection} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
    
    return (
      <>
        <PostDetail
          post={post}
          isLiked={likedPosts.has(post.id)}
          isPinned={pinnedPosts.has(post.id)}
          onBack={() => setSelectedPostId(null)}
          onLike={() => handleLike(post.id)}
          onView={() => handleView(post.id)}
          onEdit={() => setShowEditPost(true)}
          onDelete={handleDeleteFromDetail}
          onPin={() => handlePin(post.id)}
          onUnpin={() => handleUnpin(post.id)}
          userRole={userRole}
          setUserRole={setUserRole}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <DeleteConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            console.log('Delete dialog closing')
            setShowDeleteDialog(false)
            setPostToDelete(null)
          }}
          onConfirm={() => {
            console.log('Delete confirmed, postToDelete:', postToDelete, 'selectedPostId:', selectedPostId)
            handleDeletePost()
          }}
          title="게시글 삭제"
          description="이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        />
      </>
    )
  }

  return (
    <>
      <TopNavigation 
        userRole={userRole} 
        setUserRole={setUserRole} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
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
          console.log('Delete dialog closing')
          setShowDeleteDialog(false)
          setPostToDelete(null)
        }}
        onConfirm={() => {
          console.log('Delete confirmed, postToDelete:', postToDelete, 'selectedPostId:', selectedPostId)
          handleDeletePost()
        }}
        title="게시글 삭제"
        description="이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      />
    </>
  )
}
