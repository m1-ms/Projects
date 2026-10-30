package com.restaurant.management.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoryUpdateRequest extends CategoryRequest {

    @NotNull(message = "{category.id.required}")
    private Long id;
}