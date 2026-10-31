package com.restaurant.management.config;

import com.restaurant.management.entity.RestaurantRole;
import com.restaurant.management.enums.RoleCode;
import com.restaurant.management.repository.RestaurantRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleInitializer implements ApplicationRunner {

    private final RestaurantRoleRepository roleRepository;

    @Override
    public void run(ApplicationArguments args) {
        for (RoleCode code : RoleCode.values()) {
            if (!roleRepository.existsByCode(code)) {
                roleRepository.save(new RestaurantRole(code));
            }
        }
    }
}