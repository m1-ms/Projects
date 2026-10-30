package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CategoryResponse {

    private final Long id;
    private final String name;
    private final String logo;
    private final String flag;
    private final LocalDateTime createdDate;
    private final LocalDateTime updatedDate;
    private final String createdBy;
    private final String updatedBy;
}