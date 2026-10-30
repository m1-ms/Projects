package com.restaurant.management.repository;

import com.restaurant.management.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    @Query("""
            select c from Category c
            where (:id is null or c.id = :id)
              and (:key is null or lower(c.name) like lower(concat('%', :key, '%')))
            """)
    Page<Category> search(@Param("id") Long id, @Param("key") String key, Pageable pageable);
}