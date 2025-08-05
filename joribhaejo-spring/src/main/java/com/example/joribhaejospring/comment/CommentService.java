package com.example.joribhaejospring.comment;

import com.example.joribhaejospring.comment.dto.CommentCreateRequest;
import com.example.joribhaejospring.comment.dto.CommentResponse;
import com.example.joribhaejospring.comment.dto.CommentUpdateRequest;
import com.example.joribhaejospring.post.Post;
import com.example.joribhaejospring.post.PostRepository;
import com.example.joribhaejospring.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPost(Integer postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);

        return comments.stream().map(CommentResponse::fromEntity).toList();
    }

    @Transactional
    public void createComment(CommentCreateRequest request, Integer postId) {
        User user = getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment parent = null;
        if (request.getParentCommentId() != null) {
            parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .post(post)
                .author(user)
                .parentComment(parent)
                .content(request.getContent())
                .build();

        commentRepository.save(comment);
    }

    @Transactional
    public void updateComment(Integer commentId, CommentUpdateRequest request) {
        User user = getCurrentUser();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        comment.setContent(request.getContent());
        commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Integer commentId) {
        User user = getCurrentUser();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        commentRepository.delete(comment);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
