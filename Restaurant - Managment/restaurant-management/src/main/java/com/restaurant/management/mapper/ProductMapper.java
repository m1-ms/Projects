package com.restaurant.management.mapper;

import com.restaurant.management.dto.request.ProductRequest;
import com.restaurant.management.dto.response.ProductResponse;
import com.restaurant.management.entity.Category;
import com.restaurant.management.entity.Product;
import org.springframework.stereotype.Component;

import java.math.RoundingMode;
import java.util.List;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequest request, Category category) {
        Product product = new Product();
        updateEntity(product, request, category);
        return product;
    }

    public void updateEntity(Product product, ProductRequest request, Category category) {
        product.setName(request.getName().trim());
        product.setImagePath(isBlank(request.getImagePath()) ? null : request.getImagePath().trim());
        product.setDescription(request.getDescription().trim());
        product.setPrice(request.getPrice().setScale(2, RoundingMode.HALF_UP));
        product.setCategory(category);
    }

    public ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .imagePath(product.getImagePath())
                .description(product.getDescription())
                .price(product.getPrice())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .createdDate(product.getCreatedDate())
                .updatedDate(product.getUpdatedDate())
                .createdBy(product.getCreatedBy())
                .updatedBy(product.getUpdatedBy())
                .build();
    }

    public List<ProductResponse> toResponseList(List<Product> products) {
        return products.stream().map(this::toResponse).toList();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}