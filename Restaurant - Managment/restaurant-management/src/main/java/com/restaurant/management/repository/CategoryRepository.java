package com.restaurant.management.repository;

import com.restaurant.management.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    @Query("""
            select c from Category c
            where (:id is null or c.id = :id)
              and (:key is null or lower(c.name) like lower(concat('%', :key, '%')))
            """)
    Page<Category> search(@Param("id") Long id, @Param("key") String key, Pageable pageable);

    List<Category> findTop5ByOrderByIdDesc();


    @Query("""
            select c.id as id,
                   c.name as name,
                   c.logo as logo,
                   c.flag as flag,
                   c.imagePath as imagePath,
                   count(p.id) as productCount
            from Category c
            left join c.products p
            where c.popular = true
            group by c.id, c.name, c.logo, c.flag, c.imagePath
            order by c.name
            """)
    List<PopularCategoryView> findPopularCategories();

    interface PopularCategoryView {
        Long getId();

        String getName();

        String getLogo();

        String getFlag();

        String getImagePath();

        Long getProductCount();
    }

}