package com.restaurant.management.mapper;

import com.restaurant.management.dto.request.ContactInfoRequest;
import com.restaurant.management.dto.response.ContactInfoResponse;
import com.restaurant.management.entity.ContactInfo;
import org.springframework.stereotype.Component;

@Component
public class ContactInfoMapper {

    public ContactInfo toEntity(ContactInfoRequest request) {
        ContactInfo contactInfo = new ContactInfo();
        contactInfo.setName(request.getName().trim());
        contactInfo.setEmail(request.getEmail().trim());
        contactInfo.setSubject(request.getSubject().trim());
        contactInfo.setMessage(request.getMessage().trim());
        return contactInfo;
    }

    public ContactInfoResponse toResponse(ContactInfo contactInfo) {
        return ContactInfoResponse.builder()
                .id(contactInfo.getId())
                .name(contactInfo.getName())
                .email(contactInfo.getEmail())
                .subject(contactInfo.getSubject())
                .message(contactInfo.getMessage())
                .createdDate(contactInfo.getCreatedDate())
                .updatedDate(contactInfo.getUpdatedDate())
                .createdBy(contactInfo.getCreatedBy())
                .updatedBy(contactInfo.getUpdatedBy())
                .build();
    }
}