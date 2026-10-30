package com.restaurant.management.controller;

import com.restaurant.management.dto.request.ContactInfoRequest;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.ContactInfoResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.service.ContactInfoService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/contact-info")
@RequiredArgsConstructor
public class ContactInfoController {

    private final ContactInfoService contactInfoService;
    private final MessageService messages;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactInfoResponse>> save(@Valid @RequestBody ContactInfoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                messages.get("success.created"), contactInfoService.save(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ContactInfoResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), contactInfoService.getAll(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactInfoResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                messages.get("success.retrieved"), contactInfoService.getById(id)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestParam @Positive(message = "{contact.id.invalid}") Long id) {
        contactInfoService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(messages.get("success.deleted"), null));
    }
}