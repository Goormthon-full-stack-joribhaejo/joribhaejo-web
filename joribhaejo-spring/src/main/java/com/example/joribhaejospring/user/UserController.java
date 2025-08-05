package com.example.joribhaejospring.user;

// UserController.java
import com.example.joribhaejospring.user.dto.LoginRequest;
import com.example.joribhaejospring.user.dto.LoginResponse;
import com.example.joribhaejospring.user.dto.SignupRequest;
import com.example.joribhaejospring.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        userService.signup(request);
        return ResponseEntity.ok().build();
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    // 내 정보 조회
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyInfo(
            @RequestHeader String currentUserId
    ) {
        UserResponse user = userService.getMyInfo();

        return ResponseEntity.ok(user);
    }
}