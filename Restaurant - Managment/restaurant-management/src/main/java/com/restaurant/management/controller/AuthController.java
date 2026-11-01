package com.restaurant.management.controller;

import com.restaurant.management.dto.request.LoginRequest;
import com.restaurant.management.dto.request.SignUpRequest;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.AuthResponse;
import com.restaurant.management.dto.response.UserResponse;
import com.restaurant.management.service.AuthService;
import com.restaurant.management.util.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MessageService messages;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                messages.get("auth.signup.success"), authService.signUp(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("auth.login.success"), authService.login(request)));
    }
}