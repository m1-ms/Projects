package com.restaurant.management.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "{product.name.required}")
    @Size(max = 150, message = "{product.name.size}")
    private String name;

    @Size(max = 255, message = "{product.image.size}")
    private String imagePath;

    @NotBlank(message = "{product.description.required}")
    @Size(max = 1000, message = "{product.description.size}")
    private String description;

    @NotNull(message = "{product.price.required}")
    @Positive(message = "{product.price.invalid}")
    @Digits(integer = 8, fraction = 2, message = "{product.price.digits}")
    private BigDecimal price;

    @NotNull(message = "{product.category.required}")
    @Positive(message = "{product.category.invalid}")
    private Long categoryId;
}