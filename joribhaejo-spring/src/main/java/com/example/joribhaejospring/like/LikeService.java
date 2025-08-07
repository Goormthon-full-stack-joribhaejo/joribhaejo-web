package com.example.joribhaejospring.like;

import com.example.joribhaejospring.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;

    @Transactional(readOnly = true)
    public List<Integer> getLikedIds(Like.TargetType targetType) {
        User user = getCurrentUser();

        List<Like> likes = likeRepository.findByUserAndTargetType(user, targetType);

        return likes.stream().map(Like::getTargetId).collect(Collectors.toList());
    }

    // 좋아요 상태 조회
    public boolean isLiked(Like.TargetType targetType, Integer targetId) {
        User user = getCurrentUser();

        return likeRepository.existsByUserAndTargetTypeAndTargetId(user, targetType, targetId);
    }

    @Transactional
    public void toggleLike(Like.TargetType targetType, Integer targetId) {
        User user = getCurrentUser();

        Optional<Like> existingLike = likeRepository.findByUserAndTargetTypeAndTargetId(user, targetType, targetId);

        if (existingLike.isPresent()) {
            // 이미 좋아요가 있는 경우 → 삭제 (toggle off)
            likeRepository.delete(existingLike.get());
        } else {
            // 좋아요가 없는 경우 → 새로 생성 (toggle on)
            Like newLike = Like.builder()
                    .user(user)
                    .targetType(targetType)
                    .targetId(targetId)
                    .build();
            likeRepository.save(newLike);
        }
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
