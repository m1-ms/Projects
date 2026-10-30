package com.restaurant.management.mapper;

import com.restaurant.management.dto.request.CategoryRequest;
import com.restaurant.management.dto.response.CategoryResponse;
import com.restaurant.management.entity.Category;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequest request) {
        Category category = new Category();
        updateEntity(category, request);
        return category;
    }

    public void updateEntity(Category category, CategoryRequest request) {
        category.setName(request.getName().trim());
        category.setLogo(request.getLogo().trim());
        category.setFlag(request.getFlag().trim());
    }

    public CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .logo(category.getLogo())
                .flag(category.getFlag())
                .createdDate(category.getCreatedDate())
                .updatedDate(category.getUpdatedDate())
                .createdBy(category.getCreatedBy())
                .updatedBy(category.getUpdatedBy())
                .build();
    }

    public List<CategoryResponse> toResponseList(List<Category> categories) {
        return categories.stream().map(this::toResponse).toList();
    }
}