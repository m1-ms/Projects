package com.restaurant.management.mapper;

import com.restaurant.management.dto.response.DashboardResponse;
import com.restaurant.management.entity.Category;
import com.restaurant.management.entity.Product;
import com.restaurant.management.entity.RestaurantOrder;
import org.springframework.stereotype.Component;

@Component
public class DashboardMapper {

    public DashboardResponse.RecentOrder toRecentOrder(RestaurantOrder order) {
        return new DashboardResponse.RecentOrder(order.getId(), order.getCode(), order.getTotalPrice(),
                order.getTotalNumber(), order.getUser().getUsername(), order.getCreatedDate());
    }

    public DashboardResponse.RecentProduct toRecentProduct(Product product) {
        return new DashboardResponse.RecentProduct(product.getId(), product.getName(), product.getPrice(),
                product.getCategory().getName(), product.getCreatedDate());
    }

    public DashboardResponse.RecentCategory toRecentCategory(Category category) {
        return new DashboardResponse.RecentCategory(category.getId(), category.getName(), category.getFlag(),
                category.getCreatedDate());
    }
}