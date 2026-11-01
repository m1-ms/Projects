package com.restaurant.management.mapper;

import com.restaurant.management.dto.request.SignUpRequest;
import com.restaurant.management.dto.response.UserResponse;
import com.restaurant.management.entity.RestaurantRole;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.entity.RestaurantUserDetails;
import org.springframework.stereotype.Component;

@Component
public class RestaurantUserMapper {

    public RestaurantUser toEntity(SignUpRequest request, String encodedPassword, RestaurantRole role) {
        RestaurantUserDetails details = new RestaurantUserDetails();
        details.setAge(request.getAge());
        details.setPhoneNumber(clean(request.getPhoneNumber()));
        details.setAddress(clean(request.getAddress()));

        RestaurantUser user = new RestaurantUser();
        user.setUsername(request.getUsername().trim());
        user.setPassword(encodedPassword);
        user.setDetails(details);
        details.setUser(user);
        user.getRoles().add(role);
        return user;
    }

    public UserResponse toResponse(RestaurantUser user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .age(user.getDetails().getAge())
                .phoneNumber(user.getDetails().getPhoneNumber())
                .address(user.getDetails().getAddress())
                .roles(user.getRoles().stream().map(role -> role.getCode().name()).sorted().toList())
                .createdDate(user.getCreatedDate())
                .build();
    }

    private String clean(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}