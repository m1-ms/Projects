package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.AuditSearchCriteria;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.UserResponse;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.enums.RoleCode;
import com.restaurant.management.exception.EmptyResultException;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.RestaurantUserMapper;
import com.restaurant.management.repository.RestaurantUserRepository;
import com.restaurant.management.repository.specification.AuditSpecifications;
import com.restaurant.management.repository.specification.UserSpecifications;
import com.restaurant.management.service.UserService;
import com.restaurant.management.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final RestaurantUserRepository userRepository;
    private final RestaurantUserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsers(String key, RoleCode role, AuditSearchCriteria criteria,
                                               int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        criteria.validate();
        String normalizedKey = (key == null || key.isBlank()) ? null : key.trim();
        Specification<RestaurantUser> specification = AuditSpecifications.<RestaurantUser>matching(criteria)
                .and(UserSpecifications.matching(normalizedKey, role));
        Page<UserResponse> result = userRepository.findAll(specification, pageable).map(userMapper::toResponse);
        if (result.getTotalElements() == 0) {
            throw new EmptyResultException("user.search.empty");
        }
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUser(Long id) {
        RestaurantUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("user.notfound", String.valueOf(id)));
        return userMapper.toResponse(user);
    }
}