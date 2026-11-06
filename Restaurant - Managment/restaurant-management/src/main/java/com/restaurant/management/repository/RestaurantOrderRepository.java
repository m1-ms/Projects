package com.restaurant.management.repository;

import com.restaurant.management.entity.RestaurantOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantOrderRepository
        extends JpaRepository<RestaurantOrder, Long>, JpaSpecificationExecutor<RestaurantOrder> {

    @Override
    @EntityGraph(attributePaths = "user")
    Page<RestaurantOrder> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "user")
    Page<RestaurantOrder> findAll(Specification<RestaurantOrder> specification, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"user", "products"})
    Optional<RestaurantOrder> findById(Long id);

    @EntityGraph(attributePaths = "user")
    Page<RestaurantOrder> findByUserId(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "products"})
    Optional<RestaurantOrder> findByIdAndUserId(Long id, Long userId);

    boolean existsByProductsId(Long productId);
}