package com.example.joribhaejospring.post;

import com.example.joribhaejospring.post.dto.PostCreateRequest;
import com.example.joribhaejospring.post.dto.PostResponse;
import com.example.joribhaejospring.post.dto.PostUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    // 게시글 목록 조회 (검색/필터 포함, category, search nullable)
    @GetMapping
    public ResponseEntity<Page<Post>> getPosts(
            @RequestParam Integer boardId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Post.PostCategory category
    ) {
        Page<Post> posts = postService.getPosts(boardId, search, category, PageRequest.of(page, size));
        return ResponseEntity.ok(posts);
    }

    // 게시글 상세 조회 (조회수 증가 포함)
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Integer postId) {
        return ResponseEntity.ok(postService.getPostAndIncreaseViewCount(postId));
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostCreateRequest request) {
        return ResponseEntity.ok(postService.createPost(request));
    }

    // 게시글 수정 (작성자만 가능)
    @PutMapping("/{postId}")
    public ResponseEntity<Void> updatePost(@PathVariable Integer postId, @RequestBody PostUpdateRequest request) {
        postService.updatePost(postId, request);
        return ResponseEntity.ok().build();
    }

    // 게시글 삭제 (작성자만 가능)
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok().build();
    }
}

