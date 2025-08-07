package com.example.joribhaejospring.like;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @Operation(
            summary = "좋아요 누른 게시글 ID 조회",
            description = ""
    )
    @GetMapping("/users/me/liked-post-ids")
    public ResponseEntity<List<Integer>> getLikedPostIds() {
        return ResponseEntity.ok(likeService.getLikedIds(Like.TargetType.POST));
    }

    @Operation(
            summary = "게시글 좋아요 토글",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @PostMapping("/likes/{targetId}/posts")
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
    @PostMapping("/likes/{targetId}/comments")
    public ResponseEntity<String> toggleCommentLike(
            @PathVariable Integer targetId
    ) {
        likeService.toggleLike(Like.TargetType.COMMENT, targetId);
        return ResponseEntity.ok("좋아요 토글");
    }
}
