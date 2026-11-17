
package com.restaurant.management.controller;

import com.restaurant.management.config.JwtProperties;
import com.restaurant.management.dto.request.LoginRequest;
import com.restaurant.management.dto.request.SignUpRequest;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.AuthResponse;
import com.restaurant.management.dto.response.UserResponse;
import com.restaurant.management.service.AuthService;
import com.restaurant.management.util.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MessageService messages;
    private final JwtProperties jwtProperties;

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken csrfToken) {
        return csrfToken;
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {

        ResponseCookie cookie = ResponseCookie
                .from(jwtProperties.getCookieName(), "")
                .httpOnly(true)
                .secure(jwtProperties.isCookieSecure())
                .sameSite(jwtProperties.getCookieSameSite())
                .path("/")
                .maxAge(Duration.ZERO)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.<Void>success(
                        messages.get("auth.logout.success"),
                        null
                ));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserResponse>> signUp(
            @Valid @RequestBody SignUpRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        messages.get("auth.signup.success"),
                        authService.signUp(request)
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(request);

        ResponseCookie cookie = ResponseCookie
                .from(jwtProperties.getCookieName(), authResponse.getToken())
                .httpOnly(true)
                .secure(jwtProperties.isCookieSecure())
                .sameSite(jwtProperties.getCookieSameSite())
                .path("/")
                .maxAge(Duration.ofSeconds(authResponse.getExpiresInSeconds()))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.success(
                        messages.get("auth.login.success"),
                        authResponse
                ));
    }
}
