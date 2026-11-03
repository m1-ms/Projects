package com.restaurant.management.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderRequest {

    @NotEmpty(message = "{order.products.required}")
    @Size(max = 50, message = "{order.products.size}")
    private List<@NotNull(message = "{order.product.id.required}")
    @Positive(message = "{order.product.id.invalid}") Long> productIds;

    @NotNull(message = "{order.total.price.required}")
    @Positive(message = "{order.total.price.invalid}")
    @Digits(integer = 8, fraction = 2, message = "{order.total.price.digits}")
    private BigDecimal totalPrice;

    @NotNull(message = "{order.total.number.required}")
    @Positive(message = "{order.total.number.invalid}")
    private Integer totalNumber;
}