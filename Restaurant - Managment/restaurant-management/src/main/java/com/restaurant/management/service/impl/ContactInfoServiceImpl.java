package com.restaurant.management.service.impl;

import com.restaurant.management.dto.request.ContactInfoRequest;
import com.restaurant.management.dto.response.ContactInfoResponse;
import com.restaurant.management.dto.response.PageResponse;
import com.restaurant.management.entity.ContactInfo;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.mapper.ContactInfoMapper;
import com.restaurant.management.repository.ContactInfoRepository;
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

    @Override
    @Transactional
    public ContactInfoResponse save(ContactInfoRequest request) {
        ContactInfo saved = contactInfoRepository.save(contactInfoMapper.toEntity(request));
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