package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.ProductDetailsCreateRequest;
import com.restaurant.management.dto.request.ProductDetailsUpdateRequest;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.dto.response.ProductDetailsResponse;
import com.restaurant.management.entity.Product;
import com.restaurant.management.entity.ProductDetails;
import com.restaurant.management.exception.DuplicateResourceException;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.ProductDetailsMapper;
import com.restaurant.management.repository.ProductDetailsRepository;
import com.restaurant.management.repository.ProductRepository;
import com.restaurant.management.service.ProductDetailsService;
import com.restaurant.management.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductDetailsServiceImpl implements ProductDetailsService {

    private final ProductDetailsRepository detailsRepository;
    private final ProductRepository productRepository;
    private final ProductDetailsMapper detailsMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductDetailsResponse> getAll(int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        Page<ProductDetailsResponse> result = detailsRepository.findAll(pageable)
                .map(detailsMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailsResponse getById(Long id) {
        return detailsMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailsResponse getByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("product.notfound", String.valueOf(productId));
        }
        ProductDetails details = detailsRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "product.details.notfound.product", String.valueOf(productId)));
        return detailsMapper.toResponse(details);
    }

    @Override
    @Transactional
    public ProductDetailsResponse save(ProductDetailsCreateRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "product.notfound", String.valueOf(request.getProductId())));
        if (product.getDetails() != null) {
            throw new DuplicateResourceException("product.details.duplicate", String.valueOf(product.getId()));
        }
        ProductDetails details = detailsMapper.toEntity(request);
        details.setProduct(product);
        ProductDetails saved = detailsRepository.save(details);
        product.setDetails(saved);
        return detailsMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ProductDetailsResponse update(ProductDetailsUpdateRequest request) {
        ProductDetails details = findOrThrow(request.getId());
        detailsMapper.updateEntity(details, request);
        return detailsMapper.toResponse(detailsRepository.save(details));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ProductDetails details = findOrThrow(id);
        Product product = details.getProduct();
        if (product != null) {
            product.setDetails(null);
        } else {
            detailsRepository.delete(details);
        }
    }

    private ProductDetails findOrThrow(Long id) {
        return detailsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("product.details.notfound", String.valueOf(id)));
    }
}