package com.restaurant.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "{auth.username.required}")
    private String username;

    @NotBlank(message = "{auth.password.required}")
    private String password;
}