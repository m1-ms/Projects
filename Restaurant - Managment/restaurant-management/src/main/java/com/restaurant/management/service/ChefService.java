package com.restaurant.management.service;

import com.restaurant.management.dto.request.ChefRequest;
import com.restaurant.management.dto.request.ChefUpdateRequest;
import com.restaurant.management.dto.response.ChefResponse;
import com.restaurant.management.dto.response.PageResponse;

public interface ChefService {

    PageResponse<ChefResponse> getAll(int page, int size);

    ChefResponse getById(Long id);

    ChefResponse save(ChefRequest request);

    ChefResponse update(ChefUpdateRequest request);

    void delete(Long id);
}