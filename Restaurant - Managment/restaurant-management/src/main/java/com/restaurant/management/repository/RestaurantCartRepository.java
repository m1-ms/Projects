package com.restaurant.management.repository;

import com.restaurant.management.entity.RestaurantCart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantCartRepository
        extends JpaRepository<RestaurantCart, Long> {

    @EntityGraph(attributePaths = {
            "items",
            "items.product",
            "items.product.category"
    })
    Optional<RestaurantCart> findByUser_Id(Long userId);
}