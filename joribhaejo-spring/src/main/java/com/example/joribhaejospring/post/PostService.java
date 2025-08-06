package com.example.joribhaejospring.post;

import com.example.joribhaejospring.board.Board;
import com.example.joribhaejospring.board.BoardRepository;
import com.example.joribhaejospring.post.dto.PageResponse;
import com.example.joribhaejospring.post.dto.PostCreateRequest;
import com.example.joribhaejospring.post.dto.PostResponse;
import com.example.joribhaejospring.post.dto.PostUpdateRequest;
import com.example.joribhaejospring.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final BoardRepository boardRepository;

    // 게시글 목록 조회 (검색, 필터)
    public PageResponse<Post> getPosts(Integer boardId, String search, Post.PostCategory category, Pageable pageable) {
        String keyword = (search == null) ? "" : search;

        Page<Post> page;
        if (category == null) {
            // 카테고리 조건 없이 조회
            page = postRepository.findByBoardIdAndTitleContainingIgnoreCase(boardId, keyword, pageable);
        } else {
            page = postRepository.findByBoardIdAndCategoryAndTitleContainingIgnoreCase(boardId, category, keyword, pageable);
        }

        return PageResponse.fromPage(page);
    }

    // 게시글 상세 조회 + 조회수 증가
    @Transactional
    public PostResponse getPostAndIncreaseViewCount(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        post.setViewCount(post.getViewCount() + 1);
        return PostResponse.fromEntity(postRepository.save(post));
    }

    // 게시글 작성
    @Transactional
    public PostResponse createPost(PostCreateRequest request) {
        User author = getCurrentUser();
        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new NoSuchElementException("Board not found"));

        Post post = Post.builder()
                .board(board)
                .author(author)
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .viewCount(0)
                .build();

        return PostResponse.fromEntity(postRepository.save(post));
    }

    // 게시글 수정 (작성자만 가능)
    @Transactional
    public void updatePost(Integer postId, PostUpdateRequest request) {
        User user = getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        postRepository.save(post);
    }

    // 게시글 삭제 (작성자만 가능)
    @Transactional
    public void deletePost(Integer postId) {
        User user = getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized");
        }

        postRepository.delete(post);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
