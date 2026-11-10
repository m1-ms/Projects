package com.restaurant.management.controller;

import com.restaurant.management.dto.request.AuditSearchCriteria;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.UserResponse;
import com.restaurant.management.enums.RoleCode;
import com.restaurant.management.service.UserService;
import com.restaurant.management.util.MessageService;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Validated
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;
    private final MessageService messages;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getUsers(
            @RequestParam(required = false) @Size(max = 100, message = "{user.key.size}") String key,
            @RequestParam(required = false) RoleCode role,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdTo,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        AuditSearchCriteria criteria = new AuditSearchCriteria(createdFrom, createdTo, null, null, null, null);
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), userService.getUsers(key, role, criteria, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), userService.getUser(id)));
    }
}