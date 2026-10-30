package com.restaurant.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {

    @NotBlank(message = "{category.name.required}")
    @Size(max = 100, message = "{category.name.size}")
    private String name;

    @NotBlank(message = "{category.logo.required}")
    @Size(max = 100, message = "{category.logo.size}")
    private String logo;

    @NotBlank(message = "{category.flag.required}")
    @Size(max = 50, message = "{category.flag.size}")
    private String flag;
}