package com.example.joribhaejospring.post;

import com.example.joribhaejospring.post.dto.PageResponse;
import com.example.joribhaejospring.post.dto.PostCreateRequest;
import com.example.joribhaejospring.post.dto.PostResponse;
import com.example.joribhaejospring.post.dto.PostUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @Operation(
            summary = "게시글 목록 조회",
            description = ""
    )
    @GetMapping
    public ResponseEntity<PageResponse<PostResponse>> getPosts(
            @RequestParam Integer boardId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Post.PostCategory category
    ) {
        return ResponseEntity.ok(postService.getPosts(boardId, search, category, PageRequest.of(page, size)));
    }

    @Operation(
            summary = "게시글 상세 조회",
            description = ""
    )
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Integer postId) {
        return ResponseEntity.ok(postService.getPostAndIncreaseViewCount(postId));
    }

    @Operation(
            summary = "게시글 작성",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostCreateRequest request) {
        return ResponseEntity.ok(postService.createPost(request));
    }

    @Operation(
            summary = "게시글 수정",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @PutMapping("/{postId}")
    public ResponseEntity<String> updatePost(@PathVariable Integer postId, @RequestBody PostUpdateRequest request) {
        postService.updatePost(postId, request);
        return ResponseEntity.ok("게시글 수정 성공");
    }

    @Operation(
            summary = "게시글 삭제",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Integer postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok("게시글 삭제 성공");
    }
}

