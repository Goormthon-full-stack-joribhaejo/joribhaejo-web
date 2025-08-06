package com.example.joribhaejospring.like;

import com.example.joribhaejospring.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    boolean existsByUserAndTargetTypeAndTargetId(User user, Like.TargetType targetType, Integer targetId);

    Optional<Like> findByUserAndTargetTypeAndTargetId(User user, Like.TargetType targetType, Integer targetId);

    List<Like> findAllByTargetTypeAndTargetId(Like.TargetType targetType, Integer postId);

    Integer countByTargetTypeAndTargetId(Like.TargetType targetType, Integer postId);
}
