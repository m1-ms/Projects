package com.restaurant.management.exception;

import org.springframework.http.HttpStatus;

public class ResourceInUseException extends BusinessException {

    public ResourceInUseException(String messageKey, Object... args) {
        super(HttpStatus.CONFLICT, messageKey, args);
    }
}