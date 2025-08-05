package com.example.joribhaejospring.post.dto;

import com.example.joribhaejospring.post.Post;
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
    private String title;
    private String content;
    private Post.PostCategory category;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse fromEntity(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .build();
    }
}
