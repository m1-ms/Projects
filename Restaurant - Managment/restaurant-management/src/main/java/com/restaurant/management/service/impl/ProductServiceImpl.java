package com.restaurant.management.service.impl;

import com.restaurant.management.config.CacheNames;
import com.restaurant.management.dto.request.AuditSearchCriteria;
import com.restaurant.management.dto.request.ProductRequest;
import com.restaurant.management.dto.request.ProductUpdateRequest;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.ProductResponse;
import com.restaurant.management.entity.Category;
import com.restaurant.management.entity.Product;
import com.restaurant.management.exception.EmptyResultException;
import com.restaurant.management.exception.InvalidRequestException;
import com.restaurant.management.exception.ResourceInUseException;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.ProductMapper;
import com.restaurant.management.repository.CategoryRepository;
import com.restaurant.management.repository.ProductRepository;
import com.restaurant.management.repository.RestaurantOrderRepository;
import com.restaurant.management.repository.specification.AuditSpecifications;
import com.restaurant.management.repository.specification.ProductSpecifications;
import com.restaurant.management.service.ProductService;
import com.restaurant.management.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final RestaurantOrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = CacheNames.PRODUCTS, key = "'all:' + #page + ':' + #size")
    public PageResponse<ProductResponse> getAll(int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        Page<ProductResponse> result = productRepository.findAll(pageable).map(productMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = CacheNames.PRODUCTS, key = "'category:' + #categoryId + ':' + #page + ':' + #size")
    public PageResponse<ProductResponse> getByCategoryId(Long categoryId, int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        findCategoryOrThrow(categoryId);
        Page<ProductResponse> result = productRepository.findByCategoryId(categoryId, pageable)
                .map(productMapper::toResponse);
        if (result.getTotalElements() == 0) {
            throw new EmptyResultException("product.empty");
        }
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = CacheNames.PRODUCTS, key = "'search:' + #categoryId + ':' + #key?.trim()?.toLowerCase() + ':' + #page + ':' + #size")
    public PageResponse<ProductResponse> search(Long categoryId, String key, int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        if (categoryId != null) {
            findCategoryOrThrow(categoryId);
        }
        String normalizedKey = (key == null || key.isBlank()) ? null : key.trim();
        Page<ProductResponse> result = productRepository.search(categoryId, normalizedKey, pageable)
                .map(productMapper::toResponse);
        if (result.getTotalElements() == 0) {
            throw new EmptyResultException("product.empty");
        }
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> auditSearch(AuditSearchCriteria criteria, String key, Long categoryId,
                                                     int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        criteria.validate();
        if (categoryId != null) {
            findCategoryOrThrow(categoryId);
        }
        String normalizedKey = (key == null || key.isBlank()) ? null : key.trim();
        Specification<Product> specification = AuditSpecifications.<Product>matching(criteria)
                .and(ProductSpecifications.matching(normalizedKey, categoryId));
        Page<ProductResponse> result = productRepository.findAll(specification, pageable)
                .map(productMapper::toResponse);
        if (result.getTotalElements() == 0) {
            throw new EmptyResultException("product.empty");
        }
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = CacheNames.PRODUCTS, key = "'id:' + #id")
    public ProductResponse getById(Long id) {
        return productMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = {CacheNames.PRODUCTS, CacheNames.PRODUCT_DETAILS, CacheNames.DASHBOARD}, allEntries = true)
    public ProductResponse save(ProductRequest request) {
        Category category = findCategoryOrThrow(request.getCategoryId());
        Product saved = productRepository.save(productMapper.toEntity(request, category));
        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = {CacheNames.PRODUCTS, CacheNames.PRODUCT_DETAILS, CacheNames.DASHBOARD}, allEntries = true)
    public List<ProductResponse> saveAll(List<ProductRequest> requests) {
        Map<Long, Category> categories = loadCategories(
                requests.stream().map(ProductRequest::getCategoryId).toList());
        List<Product> entities = requests.stream()
                .map(request -> productMapper.toEntity(request, categories.get(request.getCategoryId())))
                .toList();
        return productMapper.toResponseList(productRepository.saveAll(entities));
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = {CacheNames.PRODUCTS, CacheNames.PRODUCT_DETAILS, CacheNames.DASHBOARD}, allEntries = true)
    public ProductResponse update(ProductUpdateRequest request) {
        Product product = findOrThrow(request.getId());
        Category category = findCategoryOrThrow(request.getCategoryId());
        productMapper.updateEntity(product, request, category);
        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = {CacheNames.PRODUCTS, CacheNames.PRODUCT_DETAILS, CacheNames.DASHBOARD}, allEntries = true)
    public List<ProductResponse> updateAll(List<ProductUpdateRequest> requests) {
        Set<Long> seenIds = new HashSet<>();
        for (ProductUpdateRequest request : requests) {
            if (!seenIds.add(request.getId())) {
                throw new InvalidRequestException("product.duplicate.id", String.valueOf(request.getId()));
            }
        }
        Map<Long, Product> products = loadProducts(seenIds);
        Map<Long, Category> categories = loadCategories(
                requests.stream().map(ProductUpdateRequest::getCategoryId).toList());

        List<Product> updated = new ArrayList<>();
        for (ProductUpdateRequest request : requests) {
            Product product = products.get(request.getId());
            productMapper.updateEntity(product, request, categories.get(request.getCategoryId()));
            updated.add(product);
        }
        return productMapper.toResponseList(productRepository.saveAll(updated));
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = {CacheNames.PRODUCTS, CacheNames.PRODUCT_DETAILS, CacheNames.DASHBOARD}, allEntries = true)
    public void delete(Long id) {
        Product product = findOrThrow(id);
        assertNotOrdered(product);
        productRepository.delete(product);
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = {CacheNames.PRODUCTS, CacheNames.PRODUCT_DETAILS, CacheNames.DASHBOARD}, allEntries = true)
    public void deleteAll(List<Long> ids) {
        Map<Long, Product> products = loadProducts(new HashSet<>(ids));
        products.values().forEach(this::assertNotOrdered);
        productRepository.deleteAll(products.values());
    }

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("product.notfound", String.valueOf(id)));
    }

    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("category.notfound", String.valueOf(id)));
    }

    private void assertNotOrdered(Product product) {
        if (orderRepository.existsByProductsId(product.getId())) {
            throw new ResourceInUseException("product.in.use", product.getName());
        }
    }

    private Map<Long, Category> loadCategories(List<Long> ids) {
        Set<Long> distinctIds = new HashSet<>(ids);
        Map<Long, Category> found = categoryRepository.findAllById(distinctIds).stream()
                .collect(Collectors.toMap(Category::getId, Function.identity()));
        for (Long id : distinctIds) {
            if (!found.containsKey(id)) {
                throw new ResourceNotFoundException("category.notfound", String.valueOf(id));
            }
        }
        return found;
    }

    private Map<Long, Product> loadProducts(Set<Long> ids) {
        Map<Long, Product> found = productRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
        for (Long id : ids) {
            if (!found.containsKey(id)) {
                throw new ResourceNotFoundException("product.notfound", String.valueOf(id));
            }
        }
        return found;
    }
}