package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class CartItemResponse {

    private final Long id;
    private final Long productId;
    private final String name;
    private final String description;
    private final String imagePath;
    private final String categoryName;
    private final BigDecimal price;
    private final Integer quantity;
    private final String selectedSize;
    private final BigDecimal lineTotal;
}