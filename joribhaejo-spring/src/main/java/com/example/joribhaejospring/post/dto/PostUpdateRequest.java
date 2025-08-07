package com.example.joribhaejospring.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostUpdateRequest {
    private String title;
    private String content;
}
