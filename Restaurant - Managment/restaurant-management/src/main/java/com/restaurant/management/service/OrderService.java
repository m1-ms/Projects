package com.restaurant.management.service;

import com.restaurant.management.dto.request.AuditSearchCriteria;
import com.restaurant.management.dto.request.OrderRequest;
import com.restaurant.management.dto.response.OrderResponse;
import com.restaurant.management.dto.response.PageResponse;

public interface OrderService {

    OrderResponse create(OrderRequest request);

    PageResponse<OrderResponse> getMyOrders(int page, int size);

    OrderResponse getMyOrder(Long id);

    PageResponse<OrderResponse> getAllOrders(int page, int size);

    OrderResponse getOrderById(Long id);

    PageResponse<OrderResponse> searchOrders(AuditSearchCriteria criteria, int page, int size);
}