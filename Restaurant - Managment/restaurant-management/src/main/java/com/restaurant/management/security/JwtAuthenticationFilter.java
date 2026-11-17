
package com.restaurant.management.security;

import com.restaurant.management.config.JwtProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public static final String INVALID_TOKEN_ATTRIBUTE = "restaurant.jwt.invalid";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            JwtProperties jwtProperties
    ) {
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null && !token.isBlank()) {
            try {
                Jwt jwt = jwtService.parse(token);

                List<String> roles =
                        jwt.getClaimAsStringList(JwtService.ROLES_CLAIM);

                List<SimpleGrantedAuthority> authorities =
                        (roles == null ? List.<String>of() : roles)
                                .stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                                .toList();

                UsernamePasswordAuthenticationToken authentication =
                        UsernamePasswordAuthenticationToken.authenticated(
                                jwt.getSubject(),
                                null,
                                authorities
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContext context =
                        SecurityContextHolder.createEmptyContext();

                context.setAuthentication(authentication);
                SecurityContextHolder.setContext(context);

            } catch (JwtException ex) {
                request.setAttribute(INVALID_TOKEN_ATTRIBUTE, Boolean.TRUE);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (jwtProperties.getCookieName().equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        // Temporary compatibility with the old Bearer-token flow.
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith(BEARER_PREFIX)) {
            return header.substring(BEARER_PREFIX.length()).trim();
        }

        return null;
    }
}
