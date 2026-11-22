package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.ReviewRequest;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.ReviewResponse;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.entity.Review;
import com.restaurant.management.enums.ReviewStatus;
import com.restaurant.management.exception.InvalidRequestException;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.ReviewMapper;
import com.restaurant.management.repository.ReviewRepository;
import com.restaurant.management.security.CurrentUserService;
import com.restaurant.management.service.ReviewService;
import com.restaurant.management.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final CurrentUserService currentUserService;

    @Override
    @Transactional
    public ReviewResponse submit(ReviewRequest request) {

        RestaurantUser user = currentUserService.getCurrentUser();

        Review review = reviewMapper.toEntity(request, user);

        return reviewMapper.toResponse(
                reviewRepository.save(review)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getApproved(int page, int size) {

        Pageable pageable = createPageable(page, size);

        Page<ReviewResponse> result = reviewRepository
                .findByStatus(ReviewStatus.APPROVED, pageable)
                .map(reviewMapper::toResponse);

        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getMine(int page, int size) {

        RestaurantUser user = currentUserService.getCurrentUser();

        Pageable pageable = createPageable(page, size);

        Page<ReviewResponse> result = reviewRepository
                .findByUserId(user.getId(), pageable)
                .map(reviewMapper::toResponse);

        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getByStatus(
            ReviewStatus status,
            int page,
            int size
    ) {

        Pageable pageable = createPageable(page, size);

        Page<ReviewResponse> result = reviewRepository
                .findByStatus(status, pageable)
                .map(reviewMapper::toResponse);

        return PageResponse.from(result);
    }

    @Override
    @Transactional
    public ReviewResponse updateStatus(Long id, ReviewStatus status) {

        if (status == null || status == ReviewStatus.PENDING) {
            throw new InvalidRequestException("review.status.invalid");
        }

        Review review = reviewRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "review.notfound",
                                String.valueOf(id)
                        )
                );

        review.setStatus(status);

        return reviewMapper.toResponse(
                reviewRepository.save(review)
        );
    }

    private Pageable createPageable(int page, int size) {

        return PaginationUtil.toPageable(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdDate")
        );
    }
}