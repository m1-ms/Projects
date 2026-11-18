
package com.restaurant.management.controller;

import com.restaurant.management.dto.request.AddCartItemRequest;
import com.restaurant.management.dto.request.UpdateCartItemRequest;
import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.CartResponse;
import com.restaurant.management.service.CartService;
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
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final MessageService messages;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        messages.get("success.retrieved"),
                        cartService.getCart()
                )
        );
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @Valid @RequestBody AddCartItemRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        messages.get("success.created"),
                        cartService.addItem(request)
                )
        );
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(
            @PathVariable @Positive Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        messages.get("success.updated"),
                        cartService.updateItem(itemId, request)
                )
        );
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @PathVariable @Positive Long itemId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        messages.get("success.deleted"),
                        cartService.removeItem(itemId)
                )
        );
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<CartResponse>> clearCart() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        messages.get("success.deleted"),
                        cartService.clearCart()
                )
        );
    }
}
