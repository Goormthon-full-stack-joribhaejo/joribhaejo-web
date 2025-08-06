package com.example.joribhaejospring.message;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;
    
    @Operation(
            summary = "받은 쪽지 목록 조회",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @GetMapping("/inbox")
    public ResponseEntity<List<MessageDto>> getInboxMessages() {
        return ResponseEntity.ok(messageService.getInboxMessages());
    }

    @Operation(
            summary = "보낸 쪽지 목록 조회",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @GetMapping("/sent")
    public ResponseEntity<List<MessageDto>> getSentMessages() {
        return ResponseEntity.ok(messageService.getSentMessages());
    }

    @Operation(
            summary = "쪽지 상세 조회",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @GetMapping("/{messageId}")
    public ResponseEntity<MessageDto> getMessageDetail(@PathVariable Integer messageId) {
        return ResponseEntity.ok(messageService.getMessageDetail(messageId));
    }

    @Operation(
            summary = "쪽지 보내기",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @PostMapping("/{receiverId}")
    public ResponseEntity<MessageDto> sendMessage(@PathVariable Integer receiverId,
                                  @RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(receiverId, request.getContent()));
    }

    @Operation(
            summary = "쪽지 삭제",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Integer messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok().build();
    }
}
