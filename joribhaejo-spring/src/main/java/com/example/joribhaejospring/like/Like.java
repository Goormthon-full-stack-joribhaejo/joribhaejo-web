package com.example.joribhaejospring.like;

import com.example.joribhaejospring.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 10)
    private TargetType targetType;

    @Column(name = "target_id", nullable = false)
    private Integer targetId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum TargetType {
        POST,
        COMMENT
    }
}
