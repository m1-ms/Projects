package com.restaurant.management.controller;

import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.DashboardResponse;
import com.restaurant.management.service.DashboardService;
import com.restaurant.management.util.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;
    private final MessageService messages;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), dashboardService.getDashboard()));
    }
}