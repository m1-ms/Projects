
package com.restaurant.management.controller;

import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.UserResponse;
import com.restaurant.management.mapper.RestaurantUserMapper;
import com.restaurant.management.security.CurrentUserService;
import com.restaurant.management.util.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CurrentUserService currentUserService;
    private final RestaurantUserMapper userMapper;
    private final MessageService messages;

    @Transactional(readOnly = true)
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {

        UserResponse user = userMapper.toResponse(
                currentUserService.getCurrentUser()
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        messages.get("success.retrieved"),
                        user
                )
        );
    }
}
