package com.restaurant.management.service;

import com.restaurant.management.dto.request.AuditSearchCriteria;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.UserResponse;
import com.restaurant.management.enums.RoleCode;

public interface UserService {

    PageResponse<UserResponse> getUsers(String key, RoleCode role, AuditSearchCriteria criteria, int page, int size);

    UserResponse getUser(Long id);
}