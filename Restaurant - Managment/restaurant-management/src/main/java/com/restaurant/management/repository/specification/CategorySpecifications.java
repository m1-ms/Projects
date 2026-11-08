package com.restaurant.management.repository.specification;

import com.restaurant.management.entity.Category;
import org.springframework.data.jpa.domain.Specification;

public final class CategorySpecifications {

    private CategorySpecifications() {
    }

    public static Specification<Category> nameContains(String key) {
        return (root, query, builder) -> {
            if (key == null) {
                return builder.conjunction();
            }
            return builder.like(builder.lower(root.<String>get("name")),
                    SpecificationSupport.containsPattern(key), SpecificationSupport.LIKE_ESCAPE);
        };
    }
}