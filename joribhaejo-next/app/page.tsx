"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PostList } from "@/components/post-list";
import { PostDetail } from "@/components/post-detail";
import { CreatePost } from "@/components/create-post";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { TopNavigation } from "@/components/top-navigation";
import {
  usePosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useTogglePostLike,
  usePost,
} from "@/hooks/use-posts";
import { useBoards } from "@/hooks/use-boards";
import { Post, UserRole, Category } from "@/lib/types";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { MessageModal } from "@/components/message-modal";
import { useCurrentUser, useLikedPostIds } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { useInboxMessages, useSentMessages, useSendMessage, useDeleteMessage } from "@/hooks/use-messages";

export default function Home() {
  const queryClient = useQueryClient();
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState({ title: '', message: '' });

  const { data: receivedMessages, isLoading: loadingReceived, error: errorReceived } = useInboxMessages({ enabled: showMessage });
  const { data: sentMessages, isLoading: loadingSent, error: errorSent } = useSentMessages({ enabled: showMessage });
  const sendMessageMutation = useSendMessage();
  const deleteMessageMutation = useDeleteMessage();

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handleShowMessage = (title: string, message: string) => {
    setMessageContent({ title, message });
    setShowMessage(true);
  };

  const handleSendMessage = (recipient: string, message: string) => {
    sendMessageMutation.mutate({ recipientUsername: recipient, content: message });
    setShowMessage(false);
  };

  const { data: likedPostIdsData } = useLikedPostIds();
  const likedPostIds = likedPostIdsData || [];
  const [mounted, setMounted] = useState(false); // Add mounted state

  // TopNavigation 상태
  const [activeBoardId, setActiveBoardId] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // 현재 사용자 정보 (로그인 여부 판단)
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

  const userRole = currentUser ? "member" : "guest";

  // 데이터 페칭
  const {
    data: boards,
    isLoading: boardsLoading,
    isError: boardsError,
  } = useBoards();

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
    error: postsErrorObject,
  } = usePosts({
    boardId: activeBoardId,
    search: searchQuery,
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
    // sortBy: 'createdAt:desc', // API 명세에 sortBy가 없으므로 제거
  });
  const posts = postsData?.content || [];

  useEffect(() => {
    setMounted(true); // Set mounted to true after component mounts
  }, []);

  useEffect(() => {
    if (postsError) {
      console.error("Error fetching posts:", postsErrorObject);
    }
    console.log("postsData:", postsData);
    console.log("posts:", posts);
  }, [postsError, postsErrorObject, postsData, posts]);

  // 뮤테이션
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const togglePostLikeMutation = useTogglePostLike();

  const handleDeleteFromList = (postId: number) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };

  const handleLike = useCallback(
    (postId: number) => {
      togglePostLikeMutation.mutate(postId);
    },
    [togglePostLikeMutation]
  );

  const handleCreatePost = (
    newPost: Omit<
      Post,
      | "id"
      | "likeCount"
      | "comments"
      | "viewCount"
      | "timeAgo"
      | "createdAt"
      | "updatedAt"
    >
  ) => {
    createPostMutation.mutate(newPost, {
      onSuccess: () => {
        setShowCreatePost(false);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  };

  const handleEditPost = (updatedPost: Partial<Post>) => {
    console.log("handleEditPost called with:", updatedPost);
    if (selectedPostId) {
      const { title, content } = updatedPost;
      console.log(
        "Calling updatePostMutation.mutate for postId:",
        selectedPostId,
        "with data:",
        { title, content }
      );
      updatePostMutation.mutate(
        { id: selectedPostId, data: { title, content } },
        {
          onSuccess: () => {
            console.log("updatePostMutation onSuccess triggered!");
            setShowEditPost(false);
          },
          onError: (error) => {
            console.error("updatePostMutation onError triggered:", error);
            toast({
              title: "게시글 수정 실패",
              description: "게시글 수정 중 오류가 발생했습니다.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleDeletePost = () => {
    const deleteId = postToDelete || selectedPostId;
    if (deleteId) {
      deletePostMutation.mutate(deleteId, {
        onSuccess: () => {
          setSelectedPostId(null);
          setPostToDelete(null);
          setShowDeleteDialog(false);
        },
      });
    }
  };

  const handleDeleteFromDetail = () => {
    setPostToDelete(selectedPostId);
    setShowDeleteDialog(true);
  };

  if (boardsError) return <div>Error loading boards.</div>;
  if (postsError) return <div>Error loading posts.</div>;

  // Fetch single post data only if selectedPostId is not null
  const {
    data: singlePostResponse,
    isLoading: singlePostLoading,
    isError: singlePostError,
  } = usePost(selectedPostId || 0);
  const singlePost = selectedPostId ? singlePostResponse : undefined;

  // 사용자 정보 로딩 중일 때 로딩 스피너 표시
  // if (isUserLoading) {
  //   return <div>사용자 정보 로딩 중...</div>;
  // }

  if (showCreatePost) {
    return (
      <CreatePost
        onSubmit={handleCreatePost}
        onCancel={() => setShowCreatePost(false)}
        userRole={userRole}
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  }

  if (showEditPost && selectedPostId) {
    if (singlePostLoading) return <div>Loading post details...</div>;
    if (singlePostError) return <div>Error loading post details.</div>;
    if (!singlePost)
      return (
        <PostList
          posts={posts}
          likedPostIds={likedPostIds}
          onPostClick={setSelectedPostId}
          onCreatePost={() => setShowCreatePost(true)}
          onLike={handleLike}
          onEdit={(id) => {
            setSelectedPostId(id);
            setShowEditPost(true);
          }}
          onDelete={handleDeleteFromList}
          activeBoardId={activeBoardId}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      );

    return (
      <CreatePost
        onSubmit={handleEditPost}
        onCancel={() => setShowEditPost(false)}
        initialData={{
          title: singlePost.title,
          content: singlePost.content,
          author: singlePost.author,
        }}
        isEdit={true}
        userRole={userRole}
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  }

  if (selectedPostId) {
    if (singlePostLoading) return <div>Loading post details...</div>;
    if (singlePostError) return <div>Error loading post details.</div>;
    if (!singlePost)
      return (
        <PostList
          posts={posts}
          likedPostIds={likedPostIds}
          onPostClick={setSelectedPostId}
          onCreatePost={() => setShowCreatePost(true)}
          onLike={handleLike}
          onEdit={(id) => {
            setSelectedPostId(id);
            setShowEditPost(true);
          }}
          onDelete={handleDeleteFromList}
          activeBoardId={activeBoardId}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      );

    return (
      <>
        <PostDetail
          post={singlePost}
          onBack={() => setSelectedPostId(null)}
          onLike={() => handleLike(singlePost.id)}
          onEdit={() => setShowEditPost(true)}
          onDelete={handleDeleteFromDetail}
          userRole={userRole}
          activeBoardId={activeBoardId}
          setActiveBoardId={setActiveBoardId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          likedPostIds={likedPostIds}
        />

        <DeleteConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setPostToDelete(null);
          }}
          onConfirm={handleDeletePost}
          title="게시글 삭제"
          description="이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        />
      </>
    );
  }

  // Conditionally render based on mounted state// Home 컴포넌트의 return 로직 전체를 아래 코드로 교체하세요.
  return mounted ? (
    <>
      <MessageModal
        isOpen={showMessage}
        onClose={handleCloseMessage}
        title={messageContent.title}
        message={messageContent.message}
        onSendMessage={handleSendMessage}
        receivedMessages={receivedMessages || []}
        sentMessages={sentMessages || []}
        onDeleteMessage={(messageId) => deleteMessageMutation.mutate(messageId)}
      />
      <TopNavigation
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLoginClick={() => setShowLogin(true)}
        onLogoutSuccess={() => {
          /* 로그아웃 후 로직, 예: setShowLogin(true) */
        }}
        onSignupClick={() => setShowSignup(true)}
        onMessageClick={() => setShowMessage(true)}
      />

      {/* 로그인/회원가입/게시물 목록을 삼항 연산자(ternary operator)로 분기 처리 */}
      {showLogin ? (
        <LoginForm onLoginSuccess={() => setShowLogin(false)} />
      ) : showSignup ? (
        <SignupForm onRegisterSuccess={() => setShowSignup(false)} />
      ) : (
        <PostList
          posts={posts}
          likedPostIds={likedPostIds}
          onPostClick={(id) => {
            setSelectedPostId(id);
          }}
          onCreatePost={() => setShowCreatePost(true)}
          onLike={handleLike}
          onEdit={(id) => {
            setSelectedPostId(id);
            setShowEditPost(true);
          }}
          onDelete={handleDeleteFromList}
          activeBoardId={activeBoardId}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isLoading={postsLoading}
          isError={postsError}
        />
      )}
    </>
  ) : (
    <>
      {/* TopNavigation 스켈레톤 */}
      <div className="h-16 border-b flex items-center justify-between px-4 animate-pulse">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      {/* PostList 스켈레톤 */}
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </>
  );
}
