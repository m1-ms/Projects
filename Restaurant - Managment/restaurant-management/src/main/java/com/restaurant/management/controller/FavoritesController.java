package com.restaurant.management.controller;

import com.restaurant.management.dto.response.ApiResponse;
import com.restaurant.management.dto.response.ProductResponse;
import com.restaurant.management.service.FavoriteService;
import com.restaurant.management.util.MessageService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoritesController {

    private final FavoriteService favoriteService;
    private final MessageService messages;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFavorites() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        messages.get("success.retrieved"),
                        favoriteService.getFavorites()
                )
        );
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> addFavorite(
            @PathVariable @Positive(message = "{product.id.invalid}") Long productId) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        messages.get("success.created"),
                        favoriteService.addFavorite(productId)
                )
        );
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> removeFavorite(
            @PathVariable @Positive(message = "{product.id.invalid}") Long productId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        messages.get("success.deleted"),
                        favoriteService.removeFavorite(productId)
                )
        );
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> clearFavorites() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        messages.get("success.deleted"),
                        favoriteService.clearFavorites()
                )
        );
    }
}