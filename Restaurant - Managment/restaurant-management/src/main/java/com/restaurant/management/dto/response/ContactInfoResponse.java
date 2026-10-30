package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ContactInfoResponse {

    private final Long id;
    private final String name;
    private final String email;
    private final String subject;
    private final String message;
    private final LocalDateTime createdDate;
    private final LocalDateTime updatedDate;
    private final String createdBy;
    private final String updatedBy;
}