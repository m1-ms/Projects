package com.restaurant.management.repository;

import com.restaurant.management.entity.ProductDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductDetailsRepository extends JpaRepository<ProductDetails, Long> {

    @Override
    @EntityGraph(attributePaths = "product")
    Page<ProductDetails> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "product")
    Optional<ProductDetails> findById(Long id);

    @EntityGraph(attributePaths = "product")
    Optional<ProductDetails> findByProductId(Long productId);
}