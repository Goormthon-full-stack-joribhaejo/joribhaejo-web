package com.example.joribhaejospring.user;

// UserController.java
import com.example.joribhaejospring.user.dto.LoginRequest;
import com.example.joribhaejospring.user.dto.LoginResponse;
import com.example.joribhaejospring.user.dto.SignupRequest;
import com.example.joribhaejospring.user.dto.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "회원가입",
            description = ""
    )
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        userService.signup(request);
        return ResponseEntity.ok("회원가입 성공");
    }
    
    @Operation(
            summary = "로그인",
            description = ""
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @Operation(
            summary = "내 정보 조회",
            description = "",
            security = @SecurityRequirement(name = "Authorization")
    )
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyInfo() {
        UserResponse user = userService.getMyInfo();

        return ResponseEntity.ok(user);
    }
}