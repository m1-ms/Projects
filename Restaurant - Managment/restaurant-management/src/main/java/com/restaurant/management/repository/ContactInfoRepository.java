package com.restaurant.management.repository;

import com.restaurant.management.entity.ContactInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactInfoRepository extends JpaRepository<ContactInfo, Long> {

    @Override
    @EntityGraph(attributePaths = "user")
    Page<ContactInfo> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "user")
    Optional<ContactInfo> findById(Long id);

    @EntityGraph(attributePaths = "user")
    Page<ContactInfo> findByUserId(Long userId, Pageable pageable);
}