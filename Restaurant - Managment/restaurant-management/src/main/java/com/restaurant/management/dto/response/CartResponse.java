package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class CartResponse {

    private final Long id;
    private final List<CartItemResponse> items;
    private final Integer totalItems;
    private final BigDecimal subtotal;
}