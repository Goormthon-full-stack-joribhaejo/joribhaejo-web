"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { useQueryClient } from '@tanstack/react-query'
import { PostList } from "@/components/post-list"
import { PostDetail } from "@/components/post-detail"
import { CreatePost } from "@/components/create-post"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { TopNavigation } from "@/components/top-navigation"
import { usePosts, useCreatePost, useUpdatePost, useDeletePost, useToggleLike, useIncrementViews, usePost } from '@/hooks/use-posts'
import { useBoards } from '@/hooks/use-boards'
import { Post, UserRole, Category } from '@/lib/types'
import { LoginForm } from "@/components/login-form"
import { useCurrentUser } from "@/hooks/use-auth"

export default function Home() {
  const queryClient = useQueryClient()
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showEditPost, setShowEditPost] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [pinnedPosts, setPinnedPosts] = useState<Set<number>>(new Set())
  
  // TopNavigation 상태
  const [activeSection, setActiveSection] = useState<number>(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  // 현재 사용자 정보 (로그인 여부 판단)
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()

  const userRole = currentUser ? "member" : "guest";

  // 데이터 페칭
  const { data: boards, isLoading: boardsLoading, isError: boardsError } = useBoards();

  const { data: postsData, isLoading: postsLoading, isError: postsError, error: postsErrorObject } = usePosts({
    boardId: activeSection,
    search: searchQuery,
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
    // sortBy: 'createdAt:desc', // API 명세에 sortBy가 없으므로 제거
  })
  const posts = postsData?.content || []

  useEffect(() => {
    if (postsError) {
      console.error('Error fetching posts:', postsErrorObject)
    }
    console.log('postsData:', postsData);
    console.log('posts:', posts);
  }, [postsError, postsErrorObject, postsData, posts])

  // 뮤테이션
  const createPostMutation = useCreatePost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()
  const toggleLikeMutation = useToggleLike()
  const incrementViewsMutation = useIncrementViews()

  const handleDeleteFromList = (postId: number) => {
    setPostToDelete(postId)
    setShowDeleteDialog(true)
  }

  const handleLike = useCallback((postId: number) => {
    toggleLikeMutation.mutate(postId)
  }, [toggleLikeMutation])

  const handleView = (postId: number) => {
    incrementViewsMutation.mutate(postId)
  }

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'likeCount' | 'comments' | 'viewCount' | 'timeAgo' | 'createdAt' | 'updatedAt'>) => {
    createPostMutation.mutate(newPost, {
      onSuccess: () => {
        setShowCreatePost(false)
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    })
  }

  const handleEditPost = (updatedPost: Partial<Post>) => {
    console.log('handleEditPost called with:', updatedPost);
    if (selectedPostId) {
      const { title, content } = updatedPost;
      console.log('Calling updatePostMutation.mutate for postId:', selectedPostId, 'with data:', { title, content });
      updatePostMutation.mutate({ id: selectedPostId, data: { title, content } }, {
        onSuccess: () => {
          console.log('updatePostMutation onSuccess triggered!');
          setShowEditPost(false)
        },
        onError: (error) => {
          console.error('updatePostMutation onError triggered:', error);
          // Optionally show a toast or error message to the user
          toast({
            title: "게시글 수정 실패",
            description: "게시글 수정 중 오류가 발생했습니다.",
            variant: "destructive",
          });
        }
      })
    }
  }

  const handleDeletePost = () => {
    const deleteId = postToDelete || selectedPostId
    if (deleteId) {
      deletePostMutation.mutate(deleteId, {
        onSuccess: () => {
          setSelectedPostId(null)
          setPostToDelete(null)
          setShowDeleteDialog(false)
        }
      })
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

  
  if (boardsError) return <div>Error loading boards.</div>;
  if (postsError) return <div>Error loading posts.</div>;

  // Fetch single post data only if selectedPostId is not null
  const { data: singlePostResponse, isLoading: singlePostLoading, isError: singlePostError } = usePost(selectedPostId || 0);
  const singlePost = selectedPostId ? singlePostResponse : undefined;

  // 사용자 정보 로딩 중일 때 로딩 스피너 표시
  if (isUserLoading) {
    return <div>사용자 정보 로딩 중...</div>;
  }

  if (showCreatePost) {
    return <CreatePost 
      onSubmit={handleCreatePost} 
      onCancel={() => setShowCreatePost(false)}
      userRole={userRole}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  }

  if (showEditPost && selectedPostId) {
    if (singlePostLoading) return <div>Loading post details...</div>;
    if (singlePostError) return <div>Error loading post details.</div>;
    if (!singlePost) return <PostList posts={posts} boards={boards} likedPosts={likedPosts} pinnedPosts={pinnedPosts} onPostClick={setSelectedPostId} onView={handleView} onCreatePost={() => setShowCreatePost(true)} onLike={handleLike} onEdit={(id) => { setSelectedPostId(id); setShowEditPost(true) }} onDelete={handleDeleteFromList} onPin={handlePin} onUnpin={handleUnpin} activeSectionId={activeSection} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />;
    
    return <CreatePost 
        onSubmit={handleEditPost} 
        onCancel={() => setShowEditPost(false)} 
        initialData={{
          title: singlePost.title,
          content: singlePost.content,
          author: singlePost.author,
          hashtags: singlePost.hashtags
        }}
        isEdit={true}
        userRole={userRole}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
  }

  if (selectedPostId) {
    if (singlePostLoading) return <div>Loading post details...</div>;
    if (singlePostError) return <div>Error loading post details.</div>;
    if (!singlePost) return <PostList posts={posts} boards={boards} likedPosts={likedPosts} pinnedPosts={pinnedPosts} onPostClick={setSelectedPostId} onView={handleView} onCreatePost={() => setShowCreatePost(true)} onLike={handleLike} onEdit={(id) => { setSelectedPostId(id); setShowEditPost(true) }} onDelete={handleDeleteFromList} onPin={handlePin} onUnpin={handleUnpin} activeSectionId={activeSection} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />;
    
    return (
      <>
        <PostDetail
          post={singlePost}
          isLiked={likedPosts.has(singlePost.id)}
          isPinned={pinnedPosts.has(singlePost.id)}
          onBack={() => setSelectedPostId(null)}
          onLike={() => handleLike(singlePost.id)}
          onView={() => handleView(singlePost.id)}
          onEdit={() => setShowEditPost(true)}
          onDelete={handleDeleteFromDetail}
          onPin={() => handlePin(singlePost.id)}
          onUnpin={() => handleUnpin(singlePost.id)}
          userRole={userRole}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
  }

  return (
    <>
      <TopNavigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLoginClick={() => setShowLogin(true)}
      />
      {showLogin && <LoginForm onLoginSuccess={() => setShowLogin(false)} />}
      <PostList 
        posts={posts} 
        boards={boards}
        likedPosts={likedPosts}
        pinnedPosts={pinnedPosts}
        onPostClick={(id) => {
          handleView(id);
          setSelectedPostId(id);
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
        activeSectionId={activeSection}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isLoading={postsLoading}
        isError={postsError}
         />
    </>
  );
}