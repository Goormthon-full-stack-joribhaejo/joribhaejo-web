package com.example.joribhaejospring.board;

import com.example.joribhaejospring.board.dto.BoardResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    @Operation(
            summary = "게시판 목록 조회",
            description = ""
    )
    @GetMapping
    public ResponseEntity<List<BoardResponse>> getAllBoards() {
        List<BoardResponse> boards = boardService.getAllBoards();
        return ResponseEntity.ok(boards);
    }

    @Operation(
            summary = "게시판 추가",
            description = "테스트용"
    )
    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(
            @RequestParam String name,
            @RequestParam String description
    ) {
        BoardResponse boards = boardService.createBoard(name, description);
        return ResponseEntity.ok(boards);
    }

    @Operation(
            summary = "게시판 수정",
            description = "테스트용"
    )
    @PutMapping("/{boardId}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable Integer boardId,
            @RequestParam String name,
            @RequestParam String description
    ) {
        BoardResponse boards = boardService.updateBoard(boardId, name, description);
        return ResponseEntity.ok(boards);
    }

    @Operation(
            summary = "게시판 삭제",
            description = "테스트용"
    )
    @DeleteMapping("/{boardId}")
    public ResponseEntity<String> deleteBoard(
            @PathVariable Integer boardId
    ) {
        boardService.deleteBoard(boardId);
        return ResponseEntity.ok("게시판이 삭제되었습니다.");
    }
}
