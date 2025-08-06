package com.example.joribhaejospring.like;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    // 좋아요 상태 조회 (비회원도 가능)
    @GetMapping
    public ResponseEntity<Boolean> checkLike(
            @RequestParam Like.TargetType targetType,
            @RequestParam Integer targetId
    ) {
        boolean liked = likeService.isLiked(targetType, targetId);
        return ResponseEntity.ok(liked);
    }

    // 좋아요 생성 (회원만)
    @PostMapping
    public ResponseEntity<Void> createLike(
            @RequestParam Like.TargetType targetType,
            @RequestParam Integer targetId
    ) {
        likeService.createLike(targetType, targetId);
        return ResponseEntity.ok().build();
    }

    // 좋아요 취소 (회원만)
    @DeleteMapping
    public ResponseEntity<Void> deleteLike(
            @RequestParam Like.TargetType targetType,
            @RequestParam Integer targetId
    ) {
        likeService.deleteLike(targetType, targetId);

        return ResponseEntity.ok().build();
    }

}
