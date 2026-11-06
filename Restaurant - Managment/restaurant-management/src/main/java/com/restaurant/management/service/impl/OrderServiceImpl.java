package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.AuditSearchCriteria;
import com.restaurant.management.dto.request.OrderRequest;
import com.restaurant.management.dto.response.OrderResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.entity.Product;
import com.restaurant.management.entity.RestaurantOrder;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.exception.EmptyResultException;
import com.restaurant.management.exception.InvalidRequestException;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.OrderMapper;
import com.restaurant.management.repository.ProductRepository;
import com.restaurant.management.repository.RestaurantOrderRepository;
import com.restaurant.management.security.CurrentUserService;
import com.restaurant.management.service.OrderService;
import com.restaurant.management.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final RestaurantOrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse create(OrderRequest request) {
        RestaurantUser user = currentUserService.getCurrentUser();

        List<Long> requestedIds = request.getProductIds();
        Set<Long> distinctIds = new LinkedHashSet<>(requestedIds);
        if (distinctIds.size() != requestedIds.size()) {
            throw new InvalidRequestException("order.products.duplicate", firstDuplicate(requestedIds));
        }

        Map<Long, Product> found = productRepository.findAllById(distinctIds).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
        for (Long id : distinctIds) {
            if (!found.containsKey(id)) {
                throw new ResourceNotFoundException("product.notfound", String.valueOf(id));
            }
        }
        List<Product> products = distinctIds.stream().map(found::get).toList();

        if (request.getTotalNumber() != products.size()) {
            throw new InvalidRequestException("order.total.number.mismatch", String.valueOf(products.size()));
        }
        BigDecimal expectedPrice = products.stream()
                .map(Product::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
        if (expectedPrice.compareTo(request.getTotalPrice()) != 0) {
            throw new InvalidRequestException("order.total.price.mismatch", expectedPrice.toPlainString());
        }

        RestaurantOrder order = new RestaurantOrder();
        order.setCode(generateCode());
        order.setTotalPrice(expectedPrice);
        order.setTotalNumber(products.size());
        order.setUser(user);
        order.setProducts(new HashSet<>(products));
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getMyOrders(int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        RestaurantUser user = currentUserService.getCurrentUser();
        Page<OrderResponse> result = orderRepository.findByUserId(user.getId(), pageable)
                .map(orderMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getMyOrder(Long id) {
        RestaurantUser user = currentUserService.getCurrentUser();
        RestaurantOrder order = orderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("order.notfound", String.valueOf(id)));
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        Page<OrderResponse> result = orderRepository.findAll(pageable).map(orderMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        RestaurantOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("order.notfound", String.valueOf(id)));
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> searchOrders(AuditSearchCriteria criteria, int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        criteria.validate();
        Specification<RestaurantOrder> specification = com.restaurant.management.repository.specification.AuditSpecifications.matching(criteria);
        Page<OrderResponse> result = orderRepository.findAll(specification, pageable)
                .map(orderMapper::toResponse);
        if (result.getTotalElements() == 0) {
            throw new EmptyResultException("order.search.empty");
        }
        return PageResponse.from(result);
    }

    private String generateCode() {
        return "ORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
    }

    private String firstDuplicate(List<Long> ids) {
        Set<Long> seen = new HashSet<>();
        for (Long id : ids) {
            if (!seen.add(id)) {
                return String.valueOf(id);
            }
        }
        return "";
    }
}