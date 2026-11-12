package com.restaurant.management.dto.response;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record DashboardResponse(
        Totals totals,
        List<RecentOrder> recentOrders,
        List<RecentProduct> recentProducts,
        List<RecentCategory> recentCategories) implements Serializable {

    public record Totals(long categories, long products, long chefs, long users, long orders)
            implements Serializable {
    }

    public record RecentOrder(Long id, String code, BigDecimal totalPrice, Integer totalNumber,
                              String username, LocalDateTime createdDate) implements Serializable {
    }

    public record RecentProduct(Long id, String name, BigDecimal price, String categoryName,
                                LocalDateTime createdDate) implements Serializable {
    }

    public record RecentCategory(Long id, String name, String flag, LocalDateTime createdDate)
            implements Serializable {
    }
}