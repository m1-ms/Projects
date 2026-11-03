package com.restaurant.management.mapper;

import com.restaurant.management.dto.response.OrderItemResponse;
import com.restaurant.management.dto.response.OrderResponse;
import com.restaurant.management.entity.Product;
import com.restaurant.management.entity.RestaurantOrder;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class OrderMapper {

    public OrderResponse toResponse(RestaurantOrder order) {
        List<OrderItemResponse> items = order.getProducts().stream()
                .sorted(Comparator.comparing(Product::getId))
                .map(product -> OrderItemResponse.builder()
                        .productId(product.getId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .code(order.getCode())
                .totalPrice(order.getTotalPrice())
                .totalNumber(order.getTotalNumber())
                .userId(order.getUser().getId())
                .username(order.getUser().getUsername())
                .products(items)
                .createdDate(order.getCreatedDate())
                .updatedDate(order.getUpdatedDate())
                .createdBy(order.getCreatedBy())
                .updatedBy(order.getUpdatedBy())
                .build();
    }
}