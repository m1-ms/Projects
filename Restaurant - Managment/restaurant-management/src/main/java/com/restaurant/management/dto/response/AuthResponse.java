package com.restaurant.management.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AuthResponse {

    @JsonIgnore
    private final String token;

    private final String tokenType;
    private final long expiresInSeconds;
    private final String username;
    private final List<String> roles;
}