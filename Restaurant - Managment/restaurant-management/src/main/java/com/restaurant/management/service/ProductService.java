package com.restaurant.management.service;

import com.restaurant.management.dto.request.ProductRequest;
import com.restaurant.management.dto.request.ProductUpdateRequest;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {

    PageResponse<ProductResponse> getAll(int page, int size);

    PageResponse<ProductResponse> getByCategoryId(Long categoryId, int page, int size);

    ProductResponse getById(Long id);

    ProductResponse save(ProductRequest request);

    List<ProductResponse> saveAll(List<ProductRequest> requests);

    ProductResponse update(ProductUpdateRequest request);

    List<ProductResponse> updateAll(List<ProductUpdateRequest> requests);

    void delete(Long id);

    void deleteAll(List<Long> ids);

    PageResponse<ProductResponse> search(Long categoryId, String key, int page, int size);

}