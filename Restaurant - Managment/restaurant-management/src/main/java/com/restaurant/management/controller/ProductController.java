package com.restaurant.management.controller;

import com.restaurant.management.dto.request.ProductRequest;
import com.restaurant.management.dto.request.ProductUpdateRequest;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.ProductResponse;
import com.restaurant.management.service.ProductService;
import com.restaurant.management.util.MessageService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final MessageService messages;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), productService.getAll(page, size)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> search(
            @RequestParam(required = false) @Size(max = 100, message = "{product.key.size}") String key,
            @RequestParam(required = false) @Positive(message = "{category.id.invalid}") Long categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), productService.search(categoryId, key, page, size)));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getByCategory(
            @PathVariable @Positive(message = "{category.id.invalid}") Long categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), productService.getByCategoryId(categoryId, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), productService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> save(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                messages.get("success.created"), productService.save(request)));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> saveAll(
            @RequestBody @NotEmpty(message = "{product.list.required}")
            List<@Valid ProductRequest> requests) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                messages.get("success.created"), productService.saveAll(requests)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProductResponse>> update(@Valid @RequestBody ProductUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.updated"), productService.update(request)));
    }

    @PutMapping("/bulk")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> updateAll(
            @RequestBody @NotEmpty(message = "{product.list.required}")
            List<@Valid ProductUpdateRequest> requests) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.updated"), productService.updateAll(requests)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestParam @Positive(message = "{product.id.invalid}") Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(messages.get("success.deleted"), null));
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> deleteAll(
            @RequestParam @NotEmpty(message = "{product.ids.required}")
            List<@NotNull @Positive(message = "{product.id.invalid}") Long> ids) {
        productService.deleteAll(ids);
        return ResponseEntity.ok(ApiResponse.success(messages.get("success.deleted"), null));
    }
}