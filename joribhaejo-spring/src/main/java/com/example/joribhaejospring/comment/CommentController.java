package com.example.joribhaejospring.comment;

import com.example.joribhaejospring.comment.dto.CommentCreateRequest;
import com.example.joribhaejospring.comment.dto.CommentResponse;
import com.example.joribhaejospring.comment.dto.CommentUpdateRequest;
import com.example.joribhaejospring.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    // 댓글 목록 조회 (대댓글 포함)
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    // 댓글 작성
    @PostMapping("/comments/{postId}")
    public ResponseEntity<Void> createComment(
            @RequestBody CommentCreateRequest request,
            @PathVariable Integer postId
    ) {
        User user = getCurrentUser(); // private method 또는 인증정보에서 가져오는 방식
        commentService.createComment(request, postId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 댓글 수정
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Void> updateComment(
            @PathVariable Integer commentId,
            @RequestBody CommentUpdateRequest request
    ) {
        commentService.updateComment(commentId, request);

        return ResponseEntity.noContent().build();
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer commentId) {
        commentService.deleteComment(commentId);

        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser() {
        // 실제 인증 로직 또는 SecurityContextHolder 사용
        throw new UnsupportedOperationException("getCurrentUser() not implemented");
    }
}
