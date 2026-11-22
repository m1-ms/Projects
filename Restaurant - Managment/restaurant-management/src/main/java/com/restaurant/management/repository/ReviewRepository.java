package com.restaurant.management.repository;

import com.restaurant.management.entity.Review;
import com.restaurant.management.enums.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = "user")
    Page<Review> findByStatus(
            ReviewStatus status,
            Pageable pageable
    );

    @EntityGraph(attributePaths = "user")
    Page<Review> findByUserId(
            Long userId,
            Pageable pageable
    );

    long countByStatus(ReviewStatus status);
}