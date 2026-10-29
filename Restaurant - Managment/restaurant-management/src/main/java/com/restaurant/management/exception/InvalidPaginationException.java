package com.restaurant.management.exception;

import org.springframework.http.HttpStatus;

public class InvalidPaginationException extends BusinessException {

    public InvalidPaginationException(String messageKey, Object... args) {
        super(HttpStatus.BAD_REQUEST, messageKey, args);
    }
}