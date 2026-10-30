package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProductDetailsResponse {

    private final Long id;
    private final Long productId;
    private final String productName;
    private final String ingredients;
    private final Integer calories;
    private final Integer preparationTimeMinutes;
    private final String servingSize;
    private final LocalDateTime createdDate;
    private final LocalDateTime updatedDate;
    private final String createdBy;
    private final String updatedBy;
}