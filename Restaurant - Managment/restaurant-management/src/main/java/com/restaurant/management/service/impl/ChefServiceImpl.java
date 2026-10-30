package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.ChefRequest;
import com.restaurant.management.dto.request.ChefUpdateRequest;
import com.restaurant.management.dto.response.ChefResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.entity.Chef;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.ChefMapper;
import com.restaurant.management.repository.ChefRepository;
import com.restaurant.management.service.ChefService;
import com.restaurant.management.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChefServiceImpl implements ChefService {

    private final ChefRepository chefRepository;
    private final ChefMapper chefMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ChefResponse> getAll(int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        Page<ChefResponse> result = chefRepository.findAll(pageable).map(chefMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public ChefResponse getById(Long id) {
        return chefMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    public ChefResponse save(ChefRequest request) {
        return chefMapper.toResponse(chefRepository.save(chefMapper.toEntity(request)));
    }

    @Override
    @Transactional
    public ChefResponse update(ChefUpdateRequest request) {
        Chef chef = findOrThrow(request.getId());
        chefMapper.updateEntity(chef, request);
        return chefMapper.toResponse(chefRepository.save(chef));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        chefRepository.delete(findOrThrow(id));
    }

    private Chef findOrThrow(Long id) {
        return chefRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("chef.notfound", String.valueOf(id)));
    }
}