package com.restaurant.management.repository;

import com.restaurant.management.entity.RestaurantUser;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantUserRepository extends JpaRepository<RestaurantUser, Long> {

    @EntityGraph(attributePaths = "roles")
    Optional<RestaurantUser> findByUsernameIgnoreCase(String username);

    boolean existsByUsernameIgnoreCase(String username);
}