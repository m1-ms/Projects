package com.restaurant.management.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductUpdateRequest extends ProductRequest {

    @NotNull(message = "{product.id.required}")
    private Long id;
}