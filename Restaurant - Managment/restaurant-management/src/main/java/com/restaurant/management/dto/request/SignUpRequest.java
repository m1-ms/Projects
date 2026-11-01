package com.restaurant.management.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequest {

    @NotBlank(message = "{auth.username.required}")
    @Size(min = 7, max = 50, message = "{auth.username.size}")
    @Pattern(regexp = "^[A-Za-z0-9._-]*$", message = "{auth.username.pattern}")
    private String username;

    @NotBlank(message = "{auth.password.required}")
    @Size(min = 7, max = 64, message = "{auth.password.size}")
    @Pattern(regexp = ".*[A-Z].*", message = "{auth.password.uppercase}")
    @Pattern(regexp = ".*[a-z].*", message = "{auth.password.lowercase}")
    @Pattern(regexp = ".*\\d.*", message = "{auth.password.digit}")
    @Pattern(regexp = ".*[^A-Za-z0-9\\s].*", message = "{auth.password.special}")
    @Pattern(regexp = "^[\\x21-\\x7E]*$", message = "{auth.password.charset}")
    private String password;

    @NotNull(message = "{auth.age.required}")
    @Min(value = 16, message = "{auth.age.range}")
    @Max(value = 80, message = "{auth.age.range}")
    private Integer age;

    @Pattern(regexp = "^$|^\\+?[0-9]{7,15}$", message = "{auth.phone.invalid}")
    private String phoneNumber;

    @Size(max = 255, message = "{auth.address.size}")
    private String address;
}