package com.example.joribhaejospring.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Integer id;
    private String accessToken;
}
