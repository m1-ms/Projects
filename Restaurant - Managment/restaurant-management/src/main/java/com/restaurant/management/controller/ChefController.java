package com.restaurant.management.controller;

import com.restaurant.management.dto.request.ChefRequest;
import com.restaurant.management.dto.request.ChefUpdateRequest;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.ChefResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.service.ChefService;
import com.restaurant.management.util.MessageService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/chefs")
@RequiredArgsConstructor
public class ChefController {

    private final ChefService chefService;
    private final MessageService messages;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ChefResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), chefService.getAll(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChefResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), chefService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChefResponse>> save(@Valid @RequestBody ChefRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                messages.get("success.created"), chefService.save(request)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ChefResponse>> update(@Valid @RequestBody ChefUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.updated"), chefService.update(request)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestParam @Positive(message = "{chef.id.invalid}") Long id) {
        chefService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(messages.get("success.deleted"), null));
    }
}