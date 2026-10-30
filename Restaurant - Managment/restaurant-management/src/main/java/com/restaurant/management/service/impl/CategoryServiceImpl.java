package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.CategoryRequest;
import com.restaurant.management.dto.request.CategoryUpdateRequest;
import com.restaurant.management.dto.response.CategoryResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.entity.Category;
import com.restaurant.management.exception.DuplicateResourceException;
import com.restaurant.management.exception.InvalidRequestException;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.CategoryMapper;
import com.restaurant.management.repository.CategoryRepository;
import com.restaurant.management.service.CategoryService;
import com.restaurant.management.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CategoryResponse> getAll(int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<CategoryResponse> result = categoryRepository.findAll(pageable).map(categoryMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        return categoryMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    public CategoryResponse save(CategoryRequest request) {
        assertNameAvailable(request.getName());
        Category saved = categoryRepository.save(categoryMapper.toEntity(request));
        return categoryMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public List<CategoryResponse> saveAll(List<CategoryRequest> requests) {
        Set<String> seenNames = new HashSet<>();
        for (CategoryRequest request : requests) {
            assertNameAvailable(request.getName());
            if (!seenNames.add(normalize(request.getName()))) {
                throw new DuplicateResourceException("category.duplicate", request.getName().trim());
            }
        }
        List<Category> entities = requests.stream().map(categoryMapper::toEntity).toList();
        return categoryMapper.toResponseList(categoryRepository.saveAll(entities));
    }

    @Override
    @Transactional
    public CategoryResponse update(CategoryUpdateRequest request) {
        Category category = findOrThrow(request.getId());
        assertNameAvailableForUpdate(request.getName(), request.getId());
        categoryMapper.updateEntity(category, request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public List<CategoryResponse> updateAll(List<CategoryUpdateRequest> requests) {
        Set<Long> seenIds = new HashSet<>();
        Set<String> seenNames = new HashSet<>();
        List<Category> updated = new ArrayList<>();
        for (CategoryUpdateRequest request : requests) {
            if (!seenIds.add(request.getId())) {
                throw new InvalidRequestException("category.duplicate.id", String.valueOf(request.getId()));
            }
            if (!seenNames.add(normalize(request.getName()))) {
                throw new DuplicateResourceException("category.duplicate", request.getName().trim());
            }
            Category category = findOrThrow(request.getId());
            assertNameAvailableForUpdate(request.getName(), request.getId());
            categoryMapper.updateEntity(category, request);
            updated.add(category);
        }
        return categoryMapper.toResponseList(categoryRepository.saveAll(updated));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        categoryRepository.delete(findOrThrow(id));
    }

    @Override
    @Transactional
    public void deleteAll(List<Long> ids) {
        List<Long> distinctIds = ids.stream().distinct().toList();
        List<Category> found = categoryRepository.findAllById(distinctIds);
        if (found.size() != distinctIds.size()) {
            Set<Long> foundIds = found.stream().map(Category::getId).collect(Collectors.toSet());
            String missing = distinctIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .map(String::valueOf)
                    .collect(Collectors.joining(", "));
            throw new ResourceNotFoundException("category.notfound", missing);
        }
        categoryRepository.deleteAll(found);
    }

    private Category findOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("category.notfound", String.valueOf(id)));
    }

    private void assertNameAvailable(String name) {
        if (categoryRepository.existsByNameIgnoreCase(name.trim())) {
            throw new DuplicateResourceException("category.duplicate", name.trim());
        }
    }

    private void assertNameAvailableForUpdate(String name, Long id) {
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(name.trim(), id)) {
            throw new DuplicateResourceException("category.duplicate", name.trim());
        }
    }

    private String normalize(String name) {
        return name.trim().toLowerCase(Locale.ROOT);
    }
}