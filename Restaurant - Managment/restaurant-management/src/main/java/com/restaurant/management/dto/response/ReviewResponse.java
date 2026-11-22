package com.restaurant.management.dto.response;

import com.restaurant.management.enums.ReviewStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewResponse {

    private final Long id;
    private final Long userId;
    private final String username;
    private final Integer rating;
    private final String reviewText;
    private final ReviewStatus status;
    private final LocalDateTime createdDate;
}