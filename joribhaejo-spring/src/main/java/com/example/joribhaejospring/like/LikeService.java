package com.example.joribhaejospring.like;

import com.example.joribhaejospring.user.User;
import com.sun.jdi.request.DuplicateRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;

    // 좋아요 상태 조회
    public boolean isLiked(Like.TargetType targetType, Integer targetId) {
        User user = getCurrentUser();

        return likeRepository.existsByUserAndTargetTypeAndTargetId(user, targetType, targetId);
    }

    // 좋아요 생성
    @Transactional
    public void createLike(Like.TargetType targetType, Integer targetId) {
        User user = getCurrentUser();

        boolean exists = likeRepository.existsByUserAndTargetTypeAndTargetId(user, targetType, targetId);

        if (exists) {
            throw new DuplicateRequestException("이미 좋아요한 상태입니다.");
        }

        Like like = Like.builder()
                .user(user)
                .targetType(targetType)
                .targetId(targetId)
                .build();

        likeRepository.save(like);
    }

    // 좋아요 취소
    @Transactional
    public void deleteLike(Like.TargetType targetType, Integer targetId) {
        User user = getCurrentUser();

        Like like = likeRepository.findByUserAndTargetTypeAndTargetId(user, targetType, targetId)
                .orElseThrow(() -> new NoSuchElementException("좋아요가 존재하지 않습니다."));
        likeRepository.delete(like);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
