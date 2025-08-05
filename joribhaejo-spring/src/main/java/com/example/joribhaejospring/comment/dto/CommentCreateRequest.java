package com.example.joribhaejospring.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentCreateRequest {
    private Integer postId;
    private Integer parentCommentId;
    private String content;
}
