package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class ProductResponse {

    private final Long id;
    private final String name;
    private final String imagePath;
    private final String description;
    private final BigDecimal price;
    private final Long categoryId;
    private final String categoryName;
    private final LocalDateTime createdDate;
    private final LocalDateTime updatedDate;
    private final String createdBy;
    private final String updatedBy;
}