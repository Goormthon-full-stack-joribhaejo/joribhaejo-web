package com.example.joribhaejospring.post.dto;

import com.example.joribhaejospring.post.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostCreateRequest {
    private Integer boardId;
    private String title;
    private String content;
    private Post.PostCategory category;
}
