package com.restaurant.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChefRequest {

    private static final String LINK_REGEX = "^$|^https?://\\S{1,247}$";

    @NotBlank(message = "{chef.name.required}")
    @Size(max = 100, message = "{chef.name.size}")
    private String name;

    @NotBlank(message = "{chef.specialization.required}")
    @Size(max = 100, message = "{chef.specialization.size}")
    private String specialization;

    @Size(max = 255, message = "{chef.logo.size}")
    private String logoPath;

    @Pattern(regexp = LINK_REGEX, message = "{chef.facebook.invalid}")
    private String facebookLink;

    @Pattern(regexp = LINK_REGEX, message = "{chef.twitter.invalid}")
    private String twitterLink;

    @Pattern(regexp = LINK_REGEX, message = "{chef.instagram.invalid}")
    private String instagramLink;
}