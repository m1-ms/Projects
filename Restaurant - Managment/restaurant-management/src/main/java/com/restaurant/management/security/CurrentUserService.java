package com.restaurant.management.security;

import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.repository.RestaurantUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final RestaurantUserRepository userRepository;

    public RestaurantUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new InsufficientAuthenticationException("Authentication is required");
        }
        return userRepository.findByUsernameIgnoreCase(authentication.getName())
                .orElseThrow(InvalidTokenException::new);
    }
}