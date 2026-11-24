package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.AddCartItemRequest;
import com.restaurant.management.dto.request.UpdateCartItemRequest;
import com.restaurant.management.dto.response.CartResponse;
import com.restaurant.management.entity.Product;
import com.restaurant.management.entity.RestaurantCart;
import com.restaurant.management.entity.RestaurantCartItem;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.exception.InvalidRequestException;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.CartMapper;
import com.restaurant.management.repository.ProductRepository;
import com.restaurant.management.repository.RestaurantCartItemRepository;
import com.restaurant.management.repository.RestaurantCartRepository;
import com.restaurant.management.security.CurrentUserService;
import com.restaurant.management.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final RestaurantCartRepository cartRepository;
    private final RestaurantCartItemRepository itemRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;
    private final CartMapper cartMapper;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart() {

        RestaurantUser user = currentUserService.getCurrentUser();

        return cartRepository.findByUser_Id(user.getId())
                .map(cartMapper::toResponse)
                .orElseGet(() -> cartMapper.toResponse(null));
    }

    @Override
    @Transactional
    public CartResponse addItem(AddCartItemRequest request) {

        RestaurantUser user = currentUserService.getCurrentUser();

        Product product = productRepository.findByIdAndActiveTrue(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "product.notfound",
                                String.valueOf(request.getProductId())
                        )
                );

        RestaurantCart cart = getOrCreateCart(user);

        String selectedSize = normalizeSize(request.getSelectedSize());

        RestaurantCartItem existingItem = cart.getItems().stream()
                .filter(item ->
                        item.getProduct().getId().equals(product.getId())
                                && Objects.equals(
                                normalizeSize(item.getSelectedSize()),
                                selectedSize
                        )
                )
                .findFirst()
                .orElse(null);

        if (existingItem != null) {

            int updatedQuantity =
                    existingItem.getQuantity() + request.getQuantity();

            if (updatedQuantity > 20) {
                throw new InvalidRequestException("cart.quantity.max");
            }

            existingItem.setQuantity(updatedQuantity);

        } else {

            RestaurantCartItem item = new RestaurantCartItem();

            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            item.setSelectedSize(selectedSize);

            cart.addItem(item);
        }

        cartRepository.save(cart);

        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItem(
            Long itemId,
            UpdateCartItemRequest request
    ) {

        RestaurantUser user = currentUserService.getCurrentUser();

        RestaurantCartItem item = findCartItem(itemId, user.getId());

        item.setQuantity(request.getQuantity());

        itemRepository.save(item);

        return loadCart(user.getId());
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long itemId) {

        RestaurantUser user = currentUserService.getCurrentUser();

        RestaurantCartItem item = findCartItem(itemId, user.getId());

        itemRepository.delete(item);

        return loadCart(user.getId());
    }

    @Override
    @Transactional
    public CartResponse clearCart() {

        RestaurantUser user = currentUserService.getCurrentUser();

        RestaurantCart cart = cartRepository.findByUser_Id(user.getId())
                .orElse(null);

        if (cart == null) {
            return cartMapper.toResponse(null);
        }

        cart.getItems().clear();

        cartRepository.save(cart);

        return cartMapper.toResponse(cart);
    }

    private RestaurantCart getOrCreateCart(RestaurantUser user) {

        return cartRepository.findByUser_Id(user.getId())
                .orElseGet(() -> {
                    RestaurantCart cart = new RestaurantCart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    private RestaurantCartItem findCartItem(
            Long itemId,
            Long userId
    ) {

        return itemRepository
                .findByIdAndCart_User_Id(itemId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "cart.item.notfound",
                                String.valueOf(itemId)
                        )
                );
    }

    private CartResponse loadCart(Long userId) {

        return cartRepository.findByUser_Id(userId)
                .map(cartMapper::toResponse)
                .orElseGet(() -> cartMapper.toResponse(null));
    }

    private String normalizeSize(String size) {

        if (size == null || size.isBlank()) {
            return null;
        }

        return size.trim();
    }
}