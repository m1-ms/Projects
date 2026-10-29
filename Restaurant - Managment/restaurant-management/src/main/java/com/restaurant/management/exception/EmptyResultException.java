package com.restaurant.management.exception;

import org.springframework.http.HttpStatus;

public class EmptyResultException extends BusinessException {

    public EmptyResultException(String messageKey, Object... args) {
        super(HttpStatus.NOT_FOUND, messageKey, args);
    }
}