package com.example.joribhaejospring.post;

import jakarta.persistence.LockModeType;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    Page<Post> findByBoardIdAndCategoryAndTitleContainingIgnoreCase(Integer boardId, Post.PostCategory category, String s, Pageable pageable);

    Page<Post> findByBoardIdAndTitleContainingIgnoreCase(Integer boardId, String keyword, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Post> findById(@NonNull Integer id);
}
