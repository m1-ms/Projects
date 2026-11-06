package com.restaurant.management.dto.request;

import com.restaurant.management.exception.InvalidRequestException;

import java.time.LocalDate;

public record AuditSearchCriteria(
        LocalDate createdFrom,
        LocalDate createdTo,
        LocalDate updatedFrom,
        LocalDate updatedTo,
        String createdBy,
        String updatedBy) {

    public AuditSearchCriteria {
        createdBy = normalize(createdBy);
        updatedBy = normalize(updatedBy);
    }

    public void validate() {
        if (createdFrom != null && createdTo != null && createdFrom.isAfter(createdTo)) {
            throw new InvalidRequestException("search.created.range.invalid");
        }
        if (updatedFrom != null && updatedTo != null && updatedFrom.isAfter(updatedTo)) {
            throw new InvalidRequestException("search.updated.range.invalid");
        }
    }

    private static String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}