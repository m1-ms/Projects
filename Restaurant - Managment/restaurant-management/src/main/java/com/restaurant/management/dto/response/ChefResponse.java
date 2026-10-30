package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChefResponse {

    private final Long id;
    private final String name;
    private final String specialization;
    private final String logoPath;
    private final String facebookLink;
    private final String twitterLink;
    private final String instagramLink;
    private final LocalDateTime createdDate;
    private final LocalDateTime updatedDate;
    private final String createdBy;
    private final String updatedBy;
}