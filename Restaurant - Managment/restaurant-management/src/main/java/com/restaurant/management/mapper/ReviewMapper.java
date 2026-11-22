package com.restaurant.management.mapper;

import com.restaurant.management.dto.request.ReviewRequest;
import com.restaurant.management.dto.response.ReviewResponse;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public Review toEntity(ReviewRequest request, RestaurantUser user) {
        Review review = new Review();

        review.setRating(request.getRating());
        review.setReviewText(request.getReviewText().trim());
        review.setUser(user);

        return review;
    }

    public ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .username(review.getUser().getUsername())
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .status(review.getStatus())
                .createdDate(review.getCreatedDate())
                .build();
    }
}