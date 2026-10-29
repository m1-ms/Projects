package com.restaurant.management.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends BusinessException {

    public DuplicateResourceException(String messageKey, Object... args) {
        super(HttpStatus.CONFLICT, messageKey, args);
    }
}