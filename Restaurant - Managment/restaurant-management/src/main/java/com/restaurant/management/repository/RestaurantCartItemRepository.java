package com.restaurant.management.repository;

import com.restaurant.management.entity.RestaurantCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantCartItemRepository
        extends JpaRepository<RestaurantCartItem, Long> {

    Optional<RestaurantCartItem> findByIdAndCart_User_Id(
            Long itemId,
            Long userId
    );
}