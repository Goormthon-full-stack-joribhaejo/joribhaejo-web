package com.example.joribhaejospring.post.dto;

import com.example.joribhaejospring.post.Post;
import com.example.joribhaejospring.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class PostResponse {
    private Integer id;
    private Integer boardId;
    private Integer authorId;
    private String author;
    private String title;
    private String content;
    private Post.PostCategory category;
    private Integer viewCount;
    private Integer likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse fromEntity(Post post, Integer likeCount) {
        return PostResponse.builder()
                .id(post.getId())
                .boardId(post.getBoard().getId())
                .authorId(post.getAuthor().getId())
                .author(post.getAuthor().getUsername())
                .title(post.getTitle())
                .content(post.getContent())
                .category(post.getCategory())
                .viewCount(post.getViewCount())
                .likeCount(likeCount)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
