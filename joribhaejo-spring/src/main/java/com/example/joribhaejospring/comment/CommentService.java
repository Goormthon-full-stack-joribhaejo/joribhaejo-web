package com.example.joribhaejospring.comment;

import com.example.joribhaejospring.comment.dto.CommentCreateRequest;
import com.example.joribhaejospring.comment.dto.CommentResponse;
import com.example.joribhaejospring.comment.dto.CommentUpdateRequest;
import com.example.joribhaejospring.like.Like;
import com.example.joribhaejospring.like.LikeRepository;
import com.example.joribhaejospring.post.Post;
import com.example.joribhaejospring.post.PostRepository;
import com.example.joribhaejospring.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPost(Integer postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);

        return comments.stream().map((comment) -> {
            Integer likes = likeRepository.countByTargetTypeAndTargetId(Like.TargetType.COMMENT, comment.getId());
            return CommentResponse.fromEntity(comment, likes);
        }).toList();
    }

    @Transactional
    public void createComment(CommentCreateRequest request, Integer postId) {
        User user = getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("게시글을 찾을 수 없습니다."));

        Comment parent = null;
        if (request.getParentCommentId() != null) {
            parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new NoSuchElementException("해당 댓글을 찾을 수 없습니다."));
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
                .orElseThrow(() -> new NoSuchElementException("해당 댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized");
        }

        comment.setContent(request.getContent());
        commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Integer commentId) {
        User user = getCurrentUser();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized");
        }

        commentRepository.delete(comment);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
