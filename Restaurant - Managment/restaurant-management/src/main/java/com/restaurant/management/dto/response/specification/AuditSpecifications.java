package com.restaurant.management.repository.specification;

import com.restaurant.management.dto.request.AuditSearchCriteria;
import com.restaurant.management.entity.BaseAuditEntity;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class AuditSpecifications {

    private static final String CREATED_DATE = "createdDate";
    private static final String UPDATED_DATE = "updatedDate";
    private static final String CREATED_BY = "createdBy";
    private static final String UPDATED_BY = "updatedBy";

    private AuditSpecifications() {
    }

    public static <T extends BaseAuditEntity> Specification<T> matching(AuditSearchCriteria criteria) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            addDateRange(predicates, builder, root.<LocalDateTime>get(CREATED_DATE),
                    criteria.createdFrom(), criteria.createdTo());
            addDateRange(predicates, builder, root.<LocalDateTime>get(UPDATED_DATE),
                    criteria.updatedFrom(), criteria.updatedTo());
            addUser(predicates, builder, root.<String>get(CREATED_BY), criteria.createdBy());
            addUser(predicates, builder, root.<String>get(UPDATED_BY), criteria.updatedBy());
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void addDateRange(List<Predicate> predicates, CriteriaBuilder builder,
                                     Expression<LocalDateTime> field, LocalDate from, LocalDate to) {
        if (from != null) {
            predicates.add(builder.greaterThanOrEqualTo(field, from.atStartOfDay()));
        }
        if (to != null) {
            predicates.add(builder.lessThan(field, to.plusDays(1).atStartOfDay()));
        }
    }

    private static void addUser(List<Predicate> predicates, CriteriaBuilder builder,
                                Expression<String> field, String user) {
        if (user != null) {
            predicates.add(builder.equal(builder.lower(field), user.toLowerCase(Locale.ROOT)));
        }
    }
}