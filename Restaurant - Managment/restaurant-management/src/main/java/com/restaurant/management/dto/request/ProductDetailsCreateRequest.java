package com.restaurant.management.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductDetailsCreateRequest extends ProductDetailsRequest {

    @NotNull(message = "{product.details.product.required}")
    @Positive(message = "{product.id.invalid}")
    private Long productId;
}