package com.restaurant.management.security;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.restaurant.management.config.JwtProperties;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Service
public class JwtService {

    public static final String ROLES_CLAIM = "roles";
    private static final int MIN_SECRET_BYTES = 32;

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final Duration expiration;

    public JwtService(JwtProperties properties) {
        byte[] secretBytes = properties.getSecret().getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < MIN_SECRET_BYTES) {
            throw new IllegalStateException("app.jwt.secret must be at least 32 characters long");
        }
        SecretKey key = new SecretKeySpec(secretBytes, "HmacSHA256");
        this.jwtEncoder = new NimbusJwtEncoder(new ImmutableSecret<>(key));
        this.jwtDecoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
        this.expiration = Duration.ofMinutes(properties.getExpirationMinutes());
    }

    public String generateToken(String username, Collection<String> roles) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(username)
                .issuedAt(now)
                .expiresAt(now.plus(expiration))
                .claim(ROLES_CLAIM, List.copyOf(roles))
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    public Jwt parse(String token) {
        return jwtDecoder.decode(token);
    }

    public long getExpirationSeconds() {
        return expiration.toSeconds();
    }
}