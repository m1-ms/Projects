package com.restaurant.management.controller;

import com.restaurant.management.dto.request.ProductDetailsCreateRequest;
import com.restaurant.management.dto.request.ProductDetailsUpdateRequest;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.ProductDetailsResponse;
import com.restaurant.management.service.ProductDetailsService;
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
@RequestMapping("/api/product-details")
@RequiredArgsConstructor
public class ProductDetailsController {

    private final ProductDetailsService detailsService;
    private final MessageService messages;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductDetailsResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), detailsService.getAll(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDetailsResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), detailsService.getById(id)));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<ProductDetailsResponse>> getByProductId(
            @PathVariable @Positive(message = "{product.id.invalid}") Long productId) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), detailsService.getByProductId(productId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDetailsResponse>> save(
            @Valid @RequestBody ProductDetailsCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                messages.get("success.created"), detailsService.save(request)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProductDetailsResponse>> update(
            @Valid @RequestBody ProductDetailsUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.updated"), detailsService.update(request)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestParam @Positive(message = "{product.details.id.invalid}") Long id) {
        detailsService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(messages.get("success.deleted"), null));
    }
}