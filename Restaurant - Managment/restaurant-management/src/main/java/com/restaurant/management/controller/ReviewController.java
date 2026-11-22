package com.restaurant.management.controller;

import com.restaurant.management.dto.request.ReviewRequest;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.ReviewResponse;
import com.restaurant.management.enums.ReviewStatus;
import com.restaurant.management.service.ReviewService;
import com.restaurant.management.util.MessageService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final MessageService messages;

    // Public: Approved reviews only
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getApproved(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"),
                reviewService.getApproved(page, size)
        ));
    }

    // Authenticated customer: Submit review
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> submit(
            @Valid @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        messages.get("success.created"),
                        reviewService.submit(request)
                )
        );
    }

    // Authenticated customer: My reviews
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getMine(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"),
                reviewService.getMine(page, size)
        ));
    }

    // Admin: Reviews by status
    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getByStatus(
            @RequestParam ReviewStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"),
                reviewService.getByStatus(status, page, size)
        ));
    }

    // Admin: Approve or reject review
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateStatus(
            @PathVariable @Positive Long id,
            @RequestParam ReviewStatus status
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.updated"),
                reviewService.updateStatus(id, status)
        ));
    }
}