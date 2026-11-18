package com.restaurant.management.service;

import com.restaurant.management.dto.response.ProductResponse;

import java.util.List;

public interface FavoriteService {

    List<ProductResponse> getFavorites();

    List<ProductResponse> addFavorite(Long productId);

    List<ProductResponse> removeFavorite(Long productId);

    List<ProductResponse> clearFavorites();
}