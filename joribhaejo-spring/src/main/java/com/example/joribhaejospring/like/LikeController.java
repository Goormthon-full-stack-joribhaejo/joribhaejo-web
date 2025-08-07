package com.example.joribhaejospring.like;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @Operation(
            summary = "좋아요 상태 조회",
            description = ""
    )
    @GetMapping("/{targetId}")
    public ResponseEntity<Boolean> checkLike(
            @RequestParam Like.TargetType targetType,
            @PathVariable Integer targetId
    ) {
        boolean liked = likeService.isLiked(targetType, targetId);
        return ResponseEntity.ok(liked);
    }

    @Operation(
            summary = "게시글 좋아요 토글",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @PostMapping("/{targetId}/posts")
    public ResponseEntity<String> togglePostLike(
            @PathVariable Integer targetId
    ) {
        likeService.toggleLike(Like.TargetType.POST, targetId);
        return ResponseEntity.ok("좋아요 토글");
    }

    @Operation(
            summary = "댓글 좋아요 토글",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @PostMapping("/{targetId}/comments")
    public ResponseEntity<String> toggleCommentLike(
            @PathVariable Integer targetId
    ) {
        likeService.toggleLike(Like.TargetType.COMMENT, targetId);
        return ResponseEntity.ok("좋아요 토글");
    }
}
