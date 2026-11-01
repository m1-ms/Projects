package com.restaurant.management.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final HandlerExceptionResolver resolver;

    public RestAuthenticationEntryPoint(@Lazy @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
        this.resolver = resolver;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) {
        boolean invalidToken = Boolean.TRUE.equals(request.getAttribute(JwtAuthenticationFilter.INVALID_TOKEN_ATTRIBUTE));
        AuthenticationException cause = invalidToken ? new InvalidTokenException() : authException;
        resolver.resolveException(request, response, null, cause);
    }
}