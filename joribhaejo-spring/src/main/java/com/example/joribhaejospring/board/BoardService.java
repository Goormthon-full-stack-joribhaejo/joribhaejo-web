package com.example.joribhaejospring.board;

import com.example.joribhaejospring.board.dto.BoardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;

    @Transactional(readOnly = true)
    public List<BoardResponse> getAllBoards() {
        return boardRepository.findAll().stream()
                .map(BoardResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public BoardResponse createBoard(String name, String description) {
        return BoardResponse.fromEntity(
                boardRepository.save(
                        Board.builder()
                                .name(name)
                                .description(description)
                                .build()
                )
        );
    }

    @Transactional
    public BoardResponse updateBoard(Integer boardId, String name, String description) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NoSuchElementException("게시판을 찾을 수 없습니다."));

        board.setName(name);
        board.setDescription(description);

        boardRepository.save(board);
        return BoardResponse.fromEntity(board);
    }

    @Transactional
    public void deleteBoard(Integer boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NoSuchElementException("게시판을 찾을 수 없습니다."));
        boardRepository.delete(board);
    }
}
