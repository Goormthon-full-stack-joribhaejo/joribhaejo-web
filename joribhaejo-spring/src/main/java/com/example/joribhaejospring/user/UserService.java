package com.example.joribhaejospring.user;

import com.example.joribhaejospring.common.JwtUtil;
import com.example.joribhaejospring.common.exception.DuplicateRequestException;
import com.example.joribhaejospring.user.dto.LoginRequest;
import com.example.joribhaejospring.user.dto.LoginResponse;
import com.example.joribhaejospring.user.dto.SignupRequest;
import com.example.joribhaejospring.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateRequestException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return LoginResponse.builder()
                .id(user.getId())
                .accessToken(jwtUtil.generateAccessToken(auth))
                .build();
    }

    public UserResponse getMyInfo() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return new UserResponse(currentUser.getId(), currentUser.getUsername(), currentUser.getEmail());
    }
}