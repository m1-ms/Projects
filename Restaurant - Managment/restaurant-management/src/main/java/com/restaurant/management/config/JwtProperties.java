package com.restaurant.management.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    private String secret;

    private long expirationMinutes = 1440;

    private String cookieName = "storm_auth_token";

    private boolean cookieSecure = false;

    private String cookieSameSite = "Lax";
}