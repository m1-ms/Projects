package com.restaurant.management.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    @NotNull(message = "{review.rating.required}")
    @Min(value = 1, message = "{review.rating.invalid}")
    @Max(value = 5, message = "{review.rating.invalid}")
    private Integer rating;

    @NotBlank(message = "{review.text.required}")
    @Size(max = 1000, message = "{review.text.size}")
    private String reviewText;
}