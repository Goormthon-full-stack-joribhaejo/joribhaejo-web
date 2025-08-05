package com.example.joribhaejospring.message;

import com.example.joribhaejospring.user.User;
import com.example.joribhaejospring.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<MessageDto> getInboxMessages() {
        User user = getCurrentUser();
        List<Message> messages = messageRepository.findByReceiverIdOrderByCreatedAtDesc(user.getId());
        return messages.stream().map(MessageDto::fromEntity).toList();
    }

    public List<MessageDto> getSentMessages() {
        User user = getCurrentUser();
        List<Message> messages = messageRepository.findBySenderIdOrderByCreatedAtDesc(user.getId());
        return messages.stream().map(MessageDto::fromEntity).toList();
    }

    public MessageDto getMessageDetail(Integer messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        return MessageDto.fromEntity(message);
    }

    public MessageDto sendMessage(Integer receiverId, String content) {
        User sender = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .build();

        messageRepository.save(message);
        return MessageDto.fromEntity(message);
    }

    public void deleteMessage(Integer messageId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getReceiver().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("No permission to delete this message");
        }

        messageRepository.delete(message);
    }

    private User getCurrentUser(){
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
