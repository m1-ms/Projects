package com.restaurant.management.service;

import com.restaurant.management.dto.request.ProductDetailsCreateRequest;
import com.restaurant.management.dto.request.ProductDetailsUpdateRequest;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.ProductDetailsResponse;

public interface ProductDetailsService {

    PageResponse<ProductDetailsResponse> getAll(int page, int size);

    ProductDetailsResponse getById(Long id);

    ProductDetailsResponse getByProductId(Long productId);

    ProductDetailsResponse save(ProductDetailsCreateRequest request);

    ProductDetailsResponse update(ProductDetailsUpdateRequest request);

    void delete(Long id);
}