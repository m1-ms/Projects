package com.restaurant.management.repository.specification;

import com.restaurant.management.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> matching(String key, Long categoryId) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (key != null) {
                String pattern = SpecificationSupport.containsPattern(key);
                predicates.add(builder.or(
                        builder.like(builder.lower(root.<String>get("name")), pattern,
                                SpecificationSupport.LIKE_ESCAPE),
                        builder.like(builder.lower(root.<String>get("description")), pattern,
                                SpecificationSupport.LIKE_ESCAPE)));
            }
            if (categoryId != null) {
                predicates.add(builder.equal(root.get("category").get("id"), categoryId));
            }
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}