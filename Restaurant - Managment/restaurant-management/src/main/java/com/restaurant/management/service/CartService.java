package com.restaurant.management.service;

import com.restaurant.management.dto.request.AddCartItemRequest;
import com.restaurant.management.dto.request.UpdateCartItemRequest;
import com.restaurant.management.dto.response.CartResponse;

public interface CartService {

    CartResponse getCart();

    CartResponse addItem(AddCartItemRequest request);

    CartResponse updateItem(Long itemId, UpdateCartItemRequest request);

    CartResponse removeItem(Long itemId);

    CartResponse clearCart();
}