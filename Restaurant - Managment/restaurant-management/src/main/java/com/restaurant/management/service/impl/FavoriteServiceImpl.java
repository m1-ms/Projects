package com.restaurant.management.service.impl;

import com.restaurant.management.dto.response.ProductResponse;
import com.restaurant.management.entity.Product;
import com.restaurant.management.entity.RestaurantFavorite;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.ProductMapper;
import com.restaurant.management.repository.ProductRepository;
import com.restaurant.management.repository.RestaurantFavoriteRepository;
import com.restaurant.management.security.CurrentUserService;
import com.restaurant.management.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final RestaurantFavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getFavorites() {

        RestaurantUser user = currentUserService.getCurrentUser();

        return loadFavorites(user.getId());
    }

    @Override
    @Transactional
    public List<ProductResponse> addFavorite(Long productId) {

        RestaurantUser user = currentUserService.getCurrentUser();

        boolean alreadyFavorite = favoriteRepository
                .findByUser_IdAndProduct_Id(user.getId(), productId)
                .isPresent();

        if (!alreadyFavorite) {

            Product product = productRepository.findById(productId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "product.notfound",
                                    String.valueOf(productId)
                            )
                    );

            RestaurantFavorite favorite = new RestaurantFavorite();
            favorite.setUser(user);
            favorite.setProduct(product);

            favoriteRepository.save(favorite);
        }

        return loadFavorites(user.getId());
    }

    @Override
    @Transactional
    public List<ProductResponse> removeFavorite(Long productId) {

        RestaurantUser user = currentUserService.getCurrentUser();

        favoriteRepository.deleteByUser_IdAndProduct_Id(
                user.getId(),
                productId
        );

        return loadFavorites(user.getId());
    }

    @Override
    @Transactional
    public List<ProductResponse> clearFavorites() {

        RestaurantUser user = currentUserService.getCurrentUser();

        favoriteRepository.deleteAllByUser_Id(user.getId());

        return List.of();
    }

    private List<ProductResponse> loadFavorites(Long userId) {

        return favoriteRepository
                .findAllByUser_IdOrderByIdDesc(userId)
                .stream()
                .map(favorite ->
                        productMapper.toResponse(favorite.getProduct())
                )
                .toList();
    }
}