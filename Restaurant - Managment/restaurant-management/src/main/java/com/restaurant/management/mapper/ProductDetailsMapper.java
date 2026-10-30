package com.restaurant.management.mapper;

import com.restaurant.management.dto.request.ProductDetailsRequest;
import com.restaurant.management.dto.response.ProductDetailsResponse;
import com.restaurant.management.entity.ProductDetails;
import org.springframework.stereotype.Component;

@Component
public class ProductDetailsMapper {

    public ProductDetails toEntity(ProductDetailsRequest request) {
        ProductDetails details = new ProductDetails();
        updateEntity(details, request);
        return details;
    }

    public void updateEntity(ProductDetails details, ProductDetailsRequest request) {
        details.setIngredients(request.getIngredients().trim());
        details.setCalories(request.getCalories());
        details.setPreparationTimeMinutes(request.getPreparationTimeMinutes());
        details.setServingSize(isBlank(request.getServingSize()) ? null : request.getServingSize().trim());
    }

    public ProductDetailsResponse toResponse(ProductDetails details) {
        return ProductDetailsResponse.builder()
                .id(details.getId())
                .productId(details.getProduct().getId())
                .productName(details.getProduct().getName())
                .ingredients(details.getIngredients())
                .calories(details.getCalories())
                .preparationTimeMinutes(details.getPreparationTimeMinutes())
                .servingSize(details.getServingSize())
                .createdDate(details.getCreatedDate())
                .updatedDate(details.getUpdatedDate())
                .createdBy(details.getCreatedBy())
                .updatedBy(details.getUpdatedBy())
                .build();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}