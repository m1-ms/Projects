package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.LoginRequest;
import com.restaurant.management.dto.request.SignUpRequest;
import com.restaurant.management.dto.response.AuthResponse;
import com.restaurant.management.dto.response.UserResponse;
import com.restaurant.management.entity.RestaurantRole;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.enums.RoleCode;
import com.restaurant.management.exception.DuplicateResourceException;
import com.restaurant.management.mapper.RestaurantUserMapper;
import com.restaurant.management.repository.RestaurantRoleRepository;
import com.restaurant.management.repository.RestaurantUserRepository;
import com.restaurant.management.security.JwtService;
import com.restaurant.management.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String ROLE_PREFIX = "ROLE_";

    private final RestaurantUserRepository userRepository;
    private final RestaurantRoleRepository roleRepository;
    private final RestaurantUserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    @Transactional
    public UserResponse signUp(SignUpRequest request) {
        String username = request.getUsername().trim();
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new DuplicateResourceException("auth.username.duplicate", username);
        }
        RestaurantRole defaultRole = roleRepository.findByCode(RoleCode.USER)
                .orElseThrow(() -> new IllegalStateException("Default role USER is missing"));
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        RestaurantUser saved = userRepository.save(userMapper.toEntity(request, encodedPassword, defaultRole));
        return userMapper.toResponse(saved);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(request.getUsername().trim(), request.getPassword()));

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith(ROLE_PREFIX))
                .map(authority -> authority.substring(ROLE_PREFIX.length()))
                .sorted()
                .toList();

        return AuthResponse.builder()
                .token(jwtService.generateToken(authentication.getName(), roles))
                .tokenType("Bearer")
                .expiresInSeconds(jwtService.getExpirationSeconds())
                .username(authentication.getName())
                .roles(roles)
                .build();
    }
}