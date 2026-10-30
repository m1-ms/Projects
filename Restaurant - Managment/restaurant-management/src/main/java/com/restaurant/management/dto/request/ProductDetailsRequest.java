package com.restaurant.management.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductDetailsRequest {

    @NotBlank(message = "{product.details.ingredients.required}")
    @Size(max = 1000, message = "{product.details.ingredients.size}")
    private String ingredients;

    @Min(value = 0, message = "{product.details.calories.range}")
    @Max(value = 10000, message = "{product.details.calories.range}")
    private Integer calories;

    @Min(value = 1, message = "{product.details.time.range}")
    @Max(value = 1440, message = "{product.details.time.range}")
    private Integer preparationTimeMinutes;

    @Size(max = 100, message = "{product.details.serving.size}")
    private String servingSize;
}