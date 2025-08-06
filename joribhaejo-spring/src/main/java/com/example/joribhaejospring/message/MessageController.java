package com.example.joribhaejospring.message;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    // 받은 쪽지 목록
    @GetMapping("/inbox")
    public ResponseEntity<List<MessageDto>> getInboxMessages() {
        return ResponseEntity.ok(messageService.getInboxMessages());
    }

    // 보낸 쪽지 목록
    @GetMapping("/sent")
    public ResponseEntity<List<MessageDto>> getSentMessages() {
        return ResponseEntity.ok(messageService.getSentMessages());
    }

    // 쪽지 상세 조회
    @GetMapping("/{messageId}")
    public ResponseEntity<MessageDto> getMessageDetail(@PathVariable Integer messageId) {
        return ResponseEntity.ok(messageService.getMessageDetail(messageId));
    }

    // 쪽지 보내기
    @PostMapping("/{receiverId}")
    public ResponseEntity<MessageDto> sendMessage(@PathVariable Integer receiverId,
                                  @RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(receiverId, request.getContent()));
    }

    // 쪽지 삭제 (본인만)
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Integer messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok().build();
    }
}
