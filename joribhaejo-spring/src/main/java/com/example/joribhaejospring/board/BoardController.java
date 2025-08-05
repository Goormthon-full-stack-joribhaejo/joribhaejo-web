package com.example.joribhaejospring.board;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    // 게시판 목록 조회
    @GetMapping
    public ResponseEntity<List<BoardResponse>> getAllBoards() {
        List<BoardResponse> boards = boardService.getAllBoards();
        return ResponseEntity.ok(boards);
    }
    
}
