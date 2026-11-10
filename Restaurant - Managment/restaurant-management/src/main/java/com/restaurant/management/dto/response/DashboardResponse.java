package com.restaurant.management.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record DashboardResponse(
        Totals totals,
        List<RecentOrder> recentOrders,
        List<RecentProduct> recentProducts,
        List<RecentCategory> recentCategories) {

    public record Totals(long categories, long products, long chefs, long users, long orders) {
    }

    public record RecentOrder(Long id, String code, BigDecimal totalPrice, Integer totalNumber,
                              String username, LocalDateTime createdDate) {
    }

    public record RecentProduct(Long id, String name, BigDecimal price, String categoryName,
                                LocalDateTime createdDate) {
    }

    public record RecentCategory(Long id, String name, String flag, LocalDateTime createdDate) {
    }
}