package com.restaurant.management.controller;

import com.restaurant.management.dto.request.AuditSearchCriteria;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.OrderResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.service.OrderService;
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
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;
    private final MessageService messages;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), orderService.getAllOrders(page, size)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> search(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate updatedFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate updatedTo,
            @RequestParam(required = false) @Size(max = 50, message = "{search.user.size}") String createdBy,
            @RequestParam(required = false) @Size(max = 50, message = "{search.user.size}") String updatedBy,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        AuditSearchCriteria criteria = new AuditSearchCriteria(
                createdFrom, createdTo, updatedFrom, updatedTo, createdBy, updatedBy);
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), orderService.searchOrders(criteria, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), orderService.getOrderById(id)));
    }
}