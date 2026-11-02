package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.ContactInfoRequest;
import com.restaurant.management.dto.response.ContactInfoResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.entity.ContactInfo;
import com.restaurant.management.entity.RestaurantUser;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.ContactInfoMapper;
import com.restaurant.management.repository.ContactInfoRepository;
import com.restaurant.management.security.CurrentUserService;
import com.restaurant.management.service.ContactInfoService;
import com.restaurant.management.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactInfoServiceImpl implements ContactInfoService {

    private final ContactInfoRepository contactInfoRepository;
    private final ContactInfoMapper contactInfoMapper;
    private final CurrentUserService currentUserService;

    @Override
    @Transactional
    public ContactInfoResponse save(ContactInfoRequest request) {
        RestaurantUser sender = currentUserService.getCurrentUser();
        ContactInfo saved = contactInfoRepository.save(contactInfoMapper.toEntity(request, sender));
        return contactInfoMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ContactInfoResponse> getAll(int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        Page<ContactInfoResponse> result = contactInfoRepository.findAll(pageable)
                .map(contactInfoMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ContactInfoResponse> getMine(int page, int size) {
        Pageable pageable = PaginationUtil.toPageable(page, size, Sort.by(Sort.Direction.ASC, "id"));
        RestaurantUser user = currentUserService.getCurrentUser();
        Page<ContactInfoResponse> result = contactInfoRepository.findByUserId(user.getId(), pageable)
                .map(contactInfoMapper::toResponse);
        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactInfoResponse getById(Long id) {
        return contactInfoMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        contactInfoRepository.delete(findOrThrow(id));
    }

    private ContactInfo findOrThrow(Long id) {
        return contactInfoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("contact.notfound", String.valueOf(id)));
    }
}