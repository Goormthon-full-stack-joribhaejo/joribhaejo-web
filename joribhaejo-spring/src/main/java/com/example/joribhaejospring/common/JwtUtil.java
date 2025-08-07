package com.example.joribhaejospring.common;

import com.example.joribhaejospring.user.User;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtUtil {
    private final JwtProperties jwtProperties;

    // Access 토큰 생성
    public String generateAccessToken(Authentication auth) {
        User user = (User) auth.getPrincipal();

        String authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("auth", authorities)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getAccessExp()))
                .signWith(jwtProperties.getSecretKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(jwtProperties.getSecretKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("잘못된 JWT 서명입니다: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("JWT 토큰이 만료되었습니다: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("지원하지 않는 JWT 토큰입니다: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT 토큰이 비어 있습니다: {}", e.getMessage());
        } catch (Exception e) {
            Date date = new Date();
            log.error("Invalid JWT token inspected : {} {}", e.getMessage(), date);
            return false;
        }
        return false;
    }

    public Integer getIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(jwtProperties.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return Integer.parseInt(claims.getSubject());
    }
}
