package com.restaurant.management.service.impl;

import com.restaurant.management.dto.response.DashboardResponse;
import com.restaurant.management.mapper.DashboardMapper;
import com.restaurant.management.repository.CategoryRepository;
import com.restaurant.management.repository.ChefRepository;
import com.restaurant.management.repository.ProductRepository;
import com.restaurant.management.repository.RestaurantOrderRepository;
import com.restaurant.management.repository.RestaurantUserRepository;
import com.restaurant.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ChefRepository chefRepository;
    private final RestaurantUserRepository userRepository;
    private final RestaurantOrderRepository orderRepository;
    private final DashboardMapper dashboardMapper;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        DashboardResponse.Totals totals = new DashboardResponse.Totals(
                categoryRepository.count(),
                productRepository.count(),
                chefRepository.count(),
                userRepository.count(),
                orderRepository.count());

        return new DashboardResponse(
                totals,
                orderRepository.findTop5ByOrderByIdDesc().stream().map(dashboardMapper::toRecentOrder).toList(),
                productRepository.findTop5ByOrderByIdDesc().stream().map(dashboardMapper::toRecentProduct).toList(),
                categoryRepository.findTop5ByOrderByIdDesc().stream().map(dashboardMapper::toRecentCategory).toList());
    }
}