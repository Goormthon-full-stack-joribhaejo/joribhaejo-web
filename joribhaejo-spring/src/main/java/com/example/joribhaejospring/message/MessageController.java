package com.example.joribhaejospring.message;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    // 받은 쪽지 목록
    @GetMapping("/inbox")
    public List<MessageDto> getInboxMessages() {
        return messageService.getInboxMessages();
    }

    // 보낸 쪽지 목록
    @GetMapping("/sent")
    public List<MessageDto> getSentMessages() {
        return messageService.getSentMessages();
    }

    // 쪽지 상세 조회
    @GetMapping("/{messageId}")
    public MessageDto getMessageDetail(@PathVariable Integer messageId) {
        return messageService.getMessageDetail(messageId);
    }

    // 쪽지 보내기
    @PostMapping("/{receiverId}")
    public MessageDto sendMessage(@PathVariable Integer receiverId,
                                  @RequestBody MessageRequest request) {
        return messageService.sendMessage(receiverId, request.getContent());
    }

    // 쪽지 삭제 (본인만)
    @DeleteMapping("/{messageId}")
    public void deleteMessage(@PathVariable Integer messageId) {
        messageService.deleteMessage(messageId);
    }
}
