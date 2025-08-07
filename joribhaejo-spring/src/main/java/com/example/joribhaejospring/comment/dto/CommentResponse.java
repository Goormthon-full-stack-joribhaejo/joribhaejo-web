package com.example.joribhaejospring.comment.dto;

import com.example.joribhaejospring.comment.Comment;
import com.example.joribhaejospring.like.Like;
import com.example.joribhaejospring.post.Post;
import com.example.joribhaejospring.user.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse {
    private Integer id;
    private Integer postId;
    private Integer authorId;
    private Integer parentCommentId;
    private String content;
    private Integer likeCount;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private LocalDateTime createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private LocalDateTime updatedAt;

    public static CommentResponse fromEntity(Comment comment, Integer likeCount) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .authorId(comment.getAuthor().getId())
                .likeCount(likeCount)
                .parentCommentId(comment.getParentComment().getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
