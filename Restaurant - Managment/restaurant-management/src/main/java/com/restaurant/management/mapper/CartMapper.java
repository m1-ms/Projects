package com.restaurant.management.mapper;

import com.restaurant.management.dto.response.CartItemResponse;
import com.restaurant.management.dto.response.CartResponse;
import com.restaurant.management.entity.Product;
import com.restaurant.management.entity.RestaurantCart;
import com.restaurant.management.entity.RestaurantCartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class CartMapper {

    public CartResponse toResponse(RestaurantCart cart) {

        List<CartItemResponse> items = cart == null
                ? List.of()
                : cart.getItems().stream()
                  .map(this::toItemResponse)
                  .toList();

        int totalItems = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        return CartResponse.builder()
                .id(cart == null ? null : cart.getId())
                .items(items)
                .totalItems(totalItems)
                .subtotal(subtotal)
                .build();
    }

    private CartItemResponse toItemResponse(RestaurantCartItem item) {

        Product product = item.getProduct();

        BigDecimal lineTotal = product.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()))
                .setScale(2, RoundingMode.HALF_UP);

        return CartItemResponse.builder()
                .id(item.getId())
                .productId(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .imagePath(product.getImagePath())
                .categoryName(product.getCategory().getName())
                .price(product.getPrice())
                .quantity(item.getQuantity())
                .selectedSize(item.getSelectedSize())
                .lineTotal(lineTotal)
                .build();
    }
}