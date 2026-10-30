package com.restaurant.management.service;

import com.restaurant.management.dto.request.CategoryRequest;
import com.restaurant.management.dto.request.CategoryUpdateRequest;
import com.restaurant.management.dto.response.CategoryResponse;
import com.restaurant.management.dto.response.PageResponse;

import java.util.List;

public interface CategoryService {

    PageResponse<CategoryResponse> getAll(int page, int size);

    CategoryResponse getById(Long id);

    CategoryResponse save(CategoryRequest request);

    List<CategoryResponse> saveAll(List<CategoryRequest> requests);

    CategoryResponse update(CategoryUpdateRequest request);

    List<CategoryResponse> updateAll(List<CategoryUpdateRequest> requests);

    void delete(Long id);

    void deleteAll(List<Long> ids);
}