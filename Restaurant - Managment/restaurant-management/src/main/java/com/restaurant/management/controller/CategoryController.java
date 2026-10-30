package com.restaurant.management.controller;

import com.restaurant.management.dto.request.CategoryRequest;
import com.restaurant.management.dto.request.CategoryUpdateRequest;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.CategoryResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.service.CategoryService;
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
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final MessageService messages;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CategoryResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), categoryService.getAll(page, size)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<CategoryResponse>>> search(
            @RequestParam(required = false) @Positive(message = "{category.id.invalid}") Long id,
            @RequestParam(required = false) @Size(max = 100, message = "{category.key.size}") String key,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), categoryService.search(id, key, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), categoryService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> save(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                messages.get("success.created"), categoryService.save(request)));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> saveAll(
            @RequestBody @NotEmpty(message = "{category.list.required}")
            List<@Valid CategoryRequest> requests) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                messages.get("success.created"), categoryService.saveAll(requests)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> update(@Valid @RequestBody CategoryUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.updated"), categoryService.update(request)));
    }

    @PutMapping("/bulk")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> updateAll(
            @RequestBody @NotEmpty(message = "{category.list.required}")
            List<@Valid CategoryUpdateRequest> requests) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.updated"), categoryService.updateAll(requests)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestParam @Positive(message = "{category.id.invalid}") Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(messages.get("success.deleted"), null));
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> deleteAll(
            @RequestParam @NotEmpty(message = "{category.ids.required}")
            List<@NotNull @Positive(message = "{category.id.invalid}") Long> ids) {
        categoryService.deleteAll(ids);
        return ResponseEntity.ok(ApiResponse.success(messages.get("success.deleted"), null));
    }
}