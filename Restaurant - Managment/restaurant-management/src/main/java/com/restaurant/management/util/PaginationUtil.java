package com.restaurant.management.util;

import com.restaurant.management.exception.InvalidPaginationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PaginationUtil {

    public static final int DEFAULT_PAGE = 1;
    public static final int DEFAULT_SIZE = 10;
    public static final int MAX_SIZE = 50;

    private PaginationUtil() {
    }

    public static Pageable toPageable(int page, int size, Sort sort) {
        if (page < 1) {
            throw new InvalidPaginationException("error.pagination.page.invalid");
        }
        if (size < 1 || size > MAX_SIZE) {
            throw new InvalidPaginationException("error.pagination.size.invalid", MAX_SIZE);
        }
        return PageRequest.of(page - 1, size, sort);
    }
}