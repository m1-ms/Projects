package com.restaurant.management.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddCartItemRequest {

    @NotNull(message = "{cart.product.required}")
    @Positive(message = "{cart.product.invalid}")
    private Long productId;

    @NotNull(message = "{cart.quantity.required}")
    @Positive(message = "{cart.quantity.invalid}")
    @Max(value = 20, message = "{cart.quantity.max}")
    private Integer quantity;

    @Size(max = 100, message = "{cart.size.max}")
    private String selectedSize;
}