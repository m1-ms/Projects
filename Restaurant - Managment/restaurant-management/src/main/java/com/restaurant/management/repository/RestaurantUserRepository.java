package com.restaurant.management.repository;

import com.restaurant.management.entity.RestaurantUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantUserRepository
        extends JpaRepository<RestaurantUser, Long>, JpaSpecificationExecutor<RestaurantUser> {

    @EntityGraph(attributePaths = "roles")
    Optional<RestaurantUser> findByUsernameIgnoreCase(String username);

    boolean existsByUsernameIgnoreCase(String username);

    @Override
    @EntityGraph(attributePaths = "details")
    Page<RestaurantUser> findAll(Specification<RestaurantUser> specification, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"details", "roles"})
    Optional<RestaurantUser> findById(Long id);
}