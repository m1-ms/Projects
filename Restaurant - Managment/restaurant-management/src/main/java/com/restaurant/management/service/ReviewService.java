package com.restaurant.management.service;

import com.restaurant.management.dto.request.ReviewRequest;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.ReviewResponse;
import com.restaurant.management.enums.ReviewStatus;

public interface ReviewService {

    ReviewResponse submit(ReviewRequest request);

    PageResponse<ReviewResponse> getApproved(int page, int size);

    PageResponse<ReviewResponse> getMine(int page, int size);

    PageResponse<ReviewResponse> getByStatus(
            ReviewStatus status,
            int page,
            int size
    );

    ReviewResponse updateStatus(Long id, ReviewStatus status);
}