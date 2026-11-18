package com.restaurant.management.repository;

import com.restaurant.management.entity.RestaurantFavorite;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantFavoriteRepository
        extends JpaRepository<RestaurantFavorite, Long> {

    @EntityGraph(attributePaths = {
            "product",
            "product.category"
    })
    List<RestaurantFavorite> findAllByUser_IdOrderByIdDesc(Long userId);

    Optional<RestaurantFavorite> findByUser_IdAndProduct_Id(
            Long userId,
            Long productId
    );

    void deleteByUser_IdAndProduct_Id(Long userId, Long productId);

    void deleteAllByUser_Id(Long userId);
}