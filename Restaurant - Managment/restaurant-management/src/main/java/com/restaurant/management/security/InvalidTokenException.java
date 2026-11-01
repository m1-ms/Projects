package com.restaurant.management.security;

import org.springframework.security.core.AuthenticationException;

public class InvalidTokenException extends AuthenticationException {

    public InvalidTokenException() {
        super("Invalid or expired token");
    }
}