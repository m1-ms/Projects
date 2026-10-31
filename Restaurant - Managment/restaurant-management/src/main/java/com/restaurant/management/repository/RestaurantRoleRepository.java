package com.restaurant.management.repository;

import com.restaurant.management.entity.RestaurantRole;
import com.restaurant.management.enums.RoleCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantRoleRepository extends JpaRepository<RestaurantRole, Long> {

    Optional<RestaurantRole> findByCode(RoleCode code);

    boolean existsByCode(RoleCode code);
}