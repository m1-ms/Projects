package com.restaurant.management.config;

import com.restaurant.management.entity.RestaurantRole;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.entity.RestaurantUserDetails;
import com.restaurant.management.enums.RoleCode;
import com.restaurant.management.repository.RestaurantRoleRepository;
import com.restaurant.management.repository.RestaurantUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(2)
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    private final RestaurantUserRepository userRepository;
    private final RestaurantRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProperties adminProperties;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (userRepository.existsByUsernameIgnoreCase(adminProperties.getUsername())) {
            return;
        }
        RestaurantRole adminRole = findRole(RoleCode.ADMIN);
        RestaurantRole userRole = findRole(RoleCode.USER);

        RestaurantUserDetails details = new RestaurantUserDetails();
        details.setAge(adminProperties.getAge());

        RestaurantUser admin = new RestaurantUser();
        admin.setUsername(adminProperties.getUsername());
        admin.setPassword(passwordEncoder.encode(adminProperties.getPassword()));
        admin.setDetails(details);
        details.setUser(admin);
        admin.getRoles().add(adminRole);
        admin.getRoles().add(userRole);

        userRepository.save(admin);
    }

    private RestaurantRole findRole(RoleCode code) {
        return roleRepository.findByCode(code)
                .orElseThrow(() -> new IllegalStateException("Role " + code + " is missing"));
    }
}