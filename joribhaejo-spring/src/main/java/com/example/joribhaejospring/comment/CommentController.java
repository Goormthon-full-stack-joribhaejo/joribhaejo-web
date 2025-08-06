package com.example.joribhaejospring.comment;

import com.example.joribhaejospring.comment.dto.CommentCreateRequest;
import com.example.joribhaejospring.comment.dto.CommentResponse;
import com.example.joribhaejospring.comment.dto.CommentUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @Operation(
            summary = "댓글 목록 조회",
            description = ""
    )
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }
    
    @Operation(
            summary = "댓글 작성",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @PostMapping("/comments/{postId}")
    public ResponseEntity<Void> createComment(
            @RequestBody CommentCreateRequest request,
            @PathVariable Integer postId
    ) {
        commentService.createComment(request, postId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "댓글 수정",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Void> updateComment(
            @PathVariable Integer commentId,
            @RequestBody CommentUpdateRequest request
    ) {
        commentService.updateComment(commentId, request);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "댓글 삭제",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer commentId) {
        commentService.deleteComment(commentId);

        return ResponseEntity.ok().build();
    }
}
