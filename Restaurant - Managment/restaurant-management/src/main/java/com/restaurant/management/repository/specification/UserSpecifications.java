package com.restaurant.management.repository.specification;

import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.enums.RoleCode;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class UserSpecifications {

    private UserSpecifications() {
    }

    public static Specification<RestaurantUser> matching(String key, RoleCode role) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (key != null) {
                predicates.add(builder.like(builder.lower(root.<String>get("username")),
                        SpecificationSupport.containsPattern(key), SpecificationSupport.LIKE_ESCAPE));
            }
            if (role != null) {
                predicates.add(builder.equal(root.join("roles", JoinType.INNER).<RoleCode>get("code"), role));
            }
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}