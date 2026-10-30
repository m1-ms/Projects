package com.restaurant.management.mapper;

import com.restaurant.management.dto.request.ChefRequest;
import com.restaurant.management.dto.response.ChefResponse;
import com.restaurant.management.entity.Chef;
import org.springframework.stereotype.Component;

@Component
public class ChefMapper {

    public Chef toEntity(ChefRequest request) {
        Chef chef = new Chef();
        updateEntity(chef, request);
        return chef;
    }

    public void updateEntity(Chef chef, ChefRequest request) {
        chef.setName(request.getName().trim());
        chef.setSpecialization(request.getSpecialization().trim());
        chef.setLogoPath(clean(request.getLogoPath()));
        chef.setFacebookLink(clean(request.getFacebookLink()));
        chef.setTwitterLink(clean(request.getTwitterLink()));
        chef.setInstagramLink(clean(request.getInstagramLink()));
    }

    public ChefResponse toResponse(Chef chef) {
        return ChefResponse.builder()
                .id(chef.getId())
                .name(chef.getName())
                .specialization(chef.getSpecialization())
                .logoPath(chef.getLogoPath())
                .facebookLink(chef.getFacebookLink())
                .twitterLink(chef.getTwitterLink())
                .instagramLink(chef.getInstagramLink())
                .createdDate(chef.getCreatedDate())
                .updatedDate(chef.getUpdatedDate())
                .createdBy(chef.getCreatedBy())
                .updatedBy(chef.getUpdatedBy())
                .build();
    }

    private String clean(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}