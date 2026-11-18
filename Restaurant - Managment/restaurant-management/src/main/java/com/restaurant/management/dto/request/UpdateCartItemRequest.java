package com.restaurant.management.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateCartItemRequest {

    @NotNull(message = "{cart.quantity.required}")
    @Positive(message = "{cart.quantity.invalid}")
    @Max(value = 20, message = "{cart.quantity.max}")
    private Integer quantity;
}