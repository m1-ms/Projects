package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class OrderItemResponse {

    private final Long productId;
    private final String name;
    private final BigDecimal price;
}