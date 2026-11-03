package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderResponse {

    private final Long id;
    private final String code;
    private final BigDecimal totalPrice;
    private final Integer totalNumber;
    private final Long userId;
    private final String username;
    private final List<OrderItemResponse> products;
    private final LocalDateTime createdDate;
    private final LocalDateTime updatedDate;
    private final String createdBy;
    private final String updatedBy;
}