package com.restaurant.management.service;

import com.restaurant.management.dto.request.ContactInfoRequest;
import com.restaurant.management.dto.response.ContactInfoResponse;
import com.restaurant.management.dto.response.PageResponse;

public interface ContactInfoService {

    ContactInfoResponse save(ContactInfoRequest request);

    PageResponse<ContactInfoResponse> getAll(int page, int size);

    ContactInfoResponse getById(Long id);

    void delete(Long id);
}