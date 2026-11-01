package com.restaurant.management.service;

import com.restaurant.management.dto.request.LoginRequest;
import com.restaurant.management.dto.request.SignUpRequest;
import com.restaurant.management.dto.response.AuthResponse;
import com.restaurant.management.dto.response.UserResponse;

public interface AuthService {

    UserResponse signUp(SignUpRequest request);

    AuthResponse login(LoginRequest request);
}