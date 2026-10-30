package com.restaurant.management.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductDetailsUpdateRequest extends ProductDetailsRequest {

    @NotNull(message = "{product.details.id.required}")
    private Long id;
}