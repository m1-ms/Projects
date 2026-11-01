package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class UserResponse {

    private final Long id;
    private final String username;
    private final Integer age;
    private final String phoneNumber;
    private final String address;
    private final List<String> roles;
    private final LocalDateTime createdDate;
}